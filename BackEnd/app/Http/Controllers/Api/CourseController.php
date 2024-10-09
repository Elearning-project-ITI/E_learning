<?php

namespace App\Http\Controllers\Api;
use Google_Service_Drive;
use Illuminate\Support\Facades\Notification;
use App\Events\CourseAddedEvent;
use Google_Service_Drive_DriveFile;
use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; 
use App\Models\User;
use Illuminate\Support\Facades\Auth;

use App\Notifications\CourseNotification;


class CourseController extends Controller
{
    
    // public function index()
    // {
    //     $courses = Course::with('bookings', 'reviews')->get();

    //     // Modify the course data to include number of students and average rating
    //     $courses = $courses->map(function ($course) {
    //         return [
    //             'id' => $course->id,
    //             'name' => $course->name,
    //             'description' => $course->description,
    //             'image'=> $course->image,
    //             'number_of_students' => $course->bookings->count(),  // Number of students who booked the course
    //             'price' =>$course->price,
    //             'average_rating' => $course->reviews->avg('rating'),  // Average rating of the course
    //             'created_at' => $course->created_at,
    //             'updated_at' => $course->updated_at,
    //         ];
    //     });

    //     return response()->json([
    //         'success' => true,
    //         'data' => $courses,
    //     ], 200);
    // }
    public function index(Request $request)
{
    // Get the search term from the query parameter
    $searchTerm = $request->query('name');

    // Query courses, optionally filtering by name if the search term is provided
    $courses = Course::with('bookings', 'reviews')
        ->when($searchTerm, function ($query, $searchTerm) {
            return $query->where('name', 'LIKE', '%' . $searchTerm . '%');
        })
        ->get();

    // Modify the course data to include the number of students and average rating
    $courses = $courses->map(function ($course) {
        return [
            'id' => $course->id,
            'name' => $course->name,
            'description' => $course->description,
            'image' => $course->image,
            'number_of_students' => $course->bookings->count(),  // Number of students who booked the course
            'price' => $course->price,
            'average_rating' => $course->reviews->avg('rating'),  // Average rating of the course
            'created_at' => $course->created_at,
            'updated_at' => $course->updated_at,
        ];
    });

    return response()->json([
        'success' => true,
        'data' => $courses,
    ], 200);
}
    
    // public function store(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'name' => 'required|string|max:255',
    //         'price' => 'required|numeric',
    //         'image' => 'required|string|max:255',
    //         'date' => 'required|date',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'success' => false,
    //             'errors' => $validator->errors(),
    //         ], 422);         }

    //     $course = Course::create($validator->validated());

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Course created successfully!',
    //         'data' => $course,
    //     ], 201);
    // }

 
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'price' => 'required|numeric',
        'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', 
       // 'date' => 'required|date',
        'description' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors(),
        ], 422);
    }

    $imagePath = null;
    $googleDriveUrl = null;

    if ($request->hasFile('image')) {
        $file = $request->file('image');
        $imagePath = $request->file('image')->store('courses_images', 'uploads');
        $imagePath = asset('uploads/' . $imagePath);

        // Google Drive Service
        $driveService = app(Google_Service_Drive::class);

        // Create file metadata for Google Drive
        $fileMetadata = new Google_Service_Drive_DriveFile([
            'name' => $file->getClientOriginalName(),
            'parents' => [env('GOOGLE_DRIVE_FOLDER_ID')]  // Optional: specify folder
        ]);

        // Upload the file to Google Drive
        $fileContent = file_get_contents($file->getRealPath());
        $uploadedFile = $driveService->files->create($fileMetadata, [
            'data' => $fileContent,
            'mimeType' => $file->getMimeType(),
            'uploadType' => 'multipart',
            'fields' => 'id',
        ]);

        // Get the file ID and create a public link
        $fileId = $uploadedFile->id;
        $driveService->files->update($fileId, new Google_Service_Drive_DriveFile(), [
            'addParents' => env('GOOGLE_DRIVE_FOLDER_ID'),
            'fields' => 'webViewLink, webContentLink',
        ]);

        // Set permission to make the file publicly accessible
        $permission = new \Google_Service_Drive_Permission([
            'type' => 'anyone',
            'role' => 'reader',
        ]);
        $driveService->permissions->create($fileId, $permission);

        // Generate and store the public URL
        $googleDriveUrl = "https://drive.google.com/uc?id={$fileId}";
    }

    // Create the course with the Google Drive image link
    $course = Course::create([
        'name' => $request->name,
        'price' => $request->price,
        'image' => $imagePath, // This can be kept if you want to store the local image path as well
        'drive_image' => $googleDriveUrl, // Store the Google Drive URL
        //'date' => now(),
        'description' => $request->description,
    ]);
 //   $action = $courseId ? 'edited' : 'added';

    // Notify all users
    $users = User::all();
    Notification::send($users, new CourseNotification($course, 'added'));
    $admin = Auth::user();
    event(new CourseAddedEvent($course, $admin));
    return response()->json([
        'success' => true,
        'message' => 'Course created successfully!',
        'data' => $course,
    ], 201);
}

   
    public function show($id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found!',
            ], 404); 
        }

        return response()->json([
            'success' => true,
            'data' => $course,
        ], 200); 
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
{
   
    $course = Course::find($id);

   
    if (!$course) {
        return response()->json([
            'success' => false,
            'message' => 'Course not found!',
        ], 404); 
    }

   
    $validator = Validator::make($request->all(), [
        'name' => 'sometimes|required|string|max:255',
        'price' => 'sometimes|required|numeric',
        'image' => 'sometimes|file|image|mimes:jpeg,png,jpg,gif|max:2048',
        //'date' => 'sometimes|required|date',
        'description' => 'required|string',
    ]);

    
    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors(),
        ], 422); 
    }

    if ($request->hasFile('image')) {
        
        if ($course->image && Storage::exists($course->image)) {
            Storage::delete($course->image);
        }

        
        $imagePath = $request->file('image')->store('courses_images', 'uploads');
        $imagePath   =asset('uploads/'.  $imagePath );
        $course->image = $imagePath; 
        
    }

   
    $course->update(array_merge(
        $validator->validated(),
        ['image' => $course->image] 
    ));

    $users = User::all();
    Notification::send($users, new CourseNotification($course, 'edited'));
    return response()->json([
        'success' => true,
        'message' => 'Course updated successfully!',
        'data' => [
            'id' => $course->id,
            'name' => $course->name,
            'price' => $course->price,
            'image' => $course->image, 
            //'date' => $course->date,
            'description' => $course->description,
            'created_at' => $course->created_at,
            'updated_at' => $course->updated_at,
        ]
    ], 200); 
    
}

    // public function update(Request $request, $id)
    // {
    //     
    //     $course = Course::find($id);
    
    //     
    //     if (!$course) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Course not found!',
    //         ], 404); // Return 404 error if the course is not found
    //     }
    
    //     
    //     $validator = Validator::make($request->all(), [
    //         'name' => 'sometimes|required|string|max:255',
    //         'price' => 'sometimes|required|numeric',
    //         'image' => 'sometimes|file|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate the image
    //         'date' => 'sometimes|required|date',
    //     ]);
    
    //     
    //     if ($validator->fails()) {
    //         return response()->json([
    //             'success' => false,
    //             'errors' => $validator->errors(),
    //         ], 422); // HTTP 422 for validation errors
    //     }
    
    //     
    //     if ($request->hasFile('image')) {
    //         // Delete the old image if it exists
    //         if ($course->image && Storage::exists($course->image)) {
    //             Storage::delete($course->image);
    //         }
    
    //        
    //         $imagePath = $request->file('image')->store('courses_images', 'public');
    //         $course->image = $imagePath; 
    //     }
    
    //     // Update the course with the validated data
    //     $course->update(array_merge(
    //         $validator->validated(),
    //         ['image' => $course->image] 
    //     ));
    
    //     
    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Course updated successfully!',
    //         'data' => [
    //             'id' => $course->id,
    //             'name' => $course->name,
    //             'price' => $course->price,
    //             'image' => $course->image ? asset('storage/' . $course->image) : null, // Return full URL of the image
    //             'date' => $course->date,
    //             'created_at' => $course->created_at,
    //             'updated_at' => $course->updated_at,
    //         ]
    //     ], 200); 
    // }
    

   

//     public function update(Request $request, $id)
// {
//     $course = Course::find($id);

//     if (!$course) {
//         return response()->json([
//             'success' => false,
//             'message' => 'Course not found!',
//         ], 404);
//     }

//     $validator = Validator::make($request->all(), [
//         'name' => 'sometimes|required|string|max:255',
//         'price' => 'sometimes|required|numeric',
//         'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
//         'date' => 'sometimes|required|date',
//     ]);

//     if ($validator->fails()) {
//         return response()->json([
//             'success' => false,
//             'errors' => $validator->errors(),
//         ], 422);
//     }

//     if ($request->hasFile('image')) {
//         if ($course->image) {
//             \Storage::delete('public/course_images/' . $course->image);
//         }

//         $image = $request->file('image');
//         $imageName = time().'.'.$image->getClientOriginalExtension();
//         $image->storeAs('public/course_images', $imageName);

//         $course->update(array_merge($validator->validated(), ['image' => $imageName]));
//     } else {
//         $course->update($validator->validated());
//     }

//     return response()->json([
//         'success' => true,
//         'message' => 'Course updated successfully!',
//         'data' => $course,
//     ], 200);
// }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        
        $course = Course::find($id);

        
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found!',
            ], 404);
        }

       
        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully!',
        ], 200); 
    }
    public function myCourses()
{
    $user = auth()->user();

    // Get courses the user has booked
    $courses = Course::whereHas('bookings', function ($query) use ($user) {
        $query->where('user_id', $user->id);
    })->get();

    return response()->json([
        'success' => true,
        'data' => $courses,
    ]);
}
public function myWishlist()
{
    $user = auth()->user();

    // Get courses the user has in their wishlist
    $wishlist = Wishlist::where('user_id', $user->id)->with('course')->get();

    return response()->json([
        'success' => true,
        'wishlist' => $wishlist,
    ]);
}
public function mostBookedCourses()
{
    $courses = Course::withCount('bookings')
        ->orderBy('bookings_count', 'desc')
        ->take(5) // Get top 5 courses
        ->get();

    return response()->json([
        'success' => true,
        'data' => $courses,
    ], 200);
}


}
