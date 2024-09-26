<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // Add this for handling storage operations


class CourseController extends Controller
{
    
    public function index()
    {
        $courses = Course::all();

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
        'date' => 'required|date',
        'description' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors(),
        ], 422);
    }

   

    $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('courses_images', 'uploads');
            $imagePath = asset('uploads/'.$imagePath);
        }

    $course = Course::create([
        'name' => $request->name,
        'price' => $request->price,
        'image' => $imagePath,
        'date' => $request->date,
        'description' => $request->description,
    ]);

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
        'date' => 'sometimes|required|date',
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

   
    return response()->json([
        'success' => true,
        'message' => 'Course updated successfully!',
        'data' => [
            'id' => $course->id,
            'name' => $course->name,
            'price' => $course->price,
            'image' => $course->image, 
            'date' => $course->date,
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
}
