<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all materials
        $materials = Material::all();

        // Return a JSON response with the materials
        return response()->json([
            'success' => true,
            'data' => $materials,
        ], 200); // HTTP 200 for OK
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
//     public function store(Request $request)
// {
//     $validator = Validator::make($request->all(), [
//         'url' => 'required|url',
//         'type' => 'required|in:pdf,video,audio,text',
//         'course_id' => 'required|exists:courses,id',
//         'file' => 'nullable|file|mimes:pdf,mp4,mkv,avi,webm|max:102400', 
//     ]);

//     if ($validator->fails()) {
//         return response()->json([
//             'success' => false,
//             'message' => $validator->errors(),
//         ], 400); 
//     }

   
//     $file_path = '';
//     if ($request->hasFile('file')) {
//         $path = $request->file('file')->store('materials', 'uploads'); 
//         $file_path = asset('uploads/' . $path); 
//     }

    
//     $material = Material::create([
//         'url' => $request->url,
//         'type' => $request->type,
//         'course_id' => $request->course_id,
//         'file' => $file_path, 
//     ]);

//     return response()->json([
//         'success' => true,
//         'data' => $material,
//     ], 201); 
// }


// public function store(Request $request)
// {
//     // Validate the incoming request
//     $validator = Validator::make($request->all(), [
//         'url' => 'required|url',
//         'type' => 'required|in:pdf,video,audio,text',
//         'course_id' => 'required|exists:courses,id',
//         'file' => 'nullable|file|mimes:pdf,mp4,mkv,avi,webm|max:102400', 
//     ]);

//     if ($validator->fails()) {
//         return response()->json([
//             'success' => false,
//             'message' => $validator->errors(),
//         ], 400); 
//     }

//     $course = Course::find($request->course_id); // Get the course for which the material is being added
//     $file_path = null;

//     // Check if a file is provided
//     if ($request->hasFile('file')) {
//         // Create a unique folder for each course using its ID or name
//         $courseFolder = 'courses_materials/' . $course->id;
        
//         // Store the file in the course's folder
//         $path = $request->file('file')->store($courseFolder, 'uploads');
        
//         // Get the file path
//         $file_path = asset('uploads/' . $path); 
//     }

//     // Create the material entry
//     $material = Material::create([
//         'url' => $request->url,
//         'type' => $request->type,
//         'course_id' => $request->course_id,
//         'file' => $file_path, 
//     ]);

//     return response()->json([
//         'success' => true,
//         'data' => $material,
//     ], 201); 
// }

public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'url' => 'required|string',
        'type' => 'required|in:pdf,video,audio,text',
        'course_id' => 'required|exists:courses,id',
        'file' => 'nullable|file|mimes:pdf,mp4,mkv,avi,webm|max:102400', // Limit file size to 100MB
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors(),
        ], 400); 
    }

    $file_path = '';
    if ($request->hasFile('file')) {
        $course = Course::find($request->course_id);

        if ($course) {
            $courseName = preg_replace('/[^a-zA-Z0-9-_]/', '_', strtolower($course->name));

            $folderPath = 'courses_materials/' . $courseName;

            $path = $request->file('file')->store($folderPath, 'uploads');
            $file_path = asset('uploads/' . $path); 
        }
    }

    $material = Material::create([
        'url' => $request->url,
        'type' => $request->type,
        'course_id' => $request->course_id,
        'file' => $file_path, 
    ]);

    return response()->json([
        'success' => true,
        'data' => $material,
    ], 201); 
}


    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $material = Material::find($id);

        if (!$material) {
            return response()->json([
                'success' => false,
                'message' => 'Material not found',
            ], 404); 
        }

        return response()->json([
            'success' => true,
            'data' => $material,
        ], 200);     }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
//     public function update(Request $request, $id)
// {
//     $material = Material::find($id);

//     if (!$material) {
//         return response()->json([
//             'success' => false,
//             'message' => 'Material not found',
//         ], 404);
//     }

//     $validator = Validator::make($request->all(), [
//         'url' => 'sometimes|url',
//         'type' => 'sometimes|in:pdf,video,audio,text',
//         'course_id' => 'sometimes|exists:courses,id',
//         'file' => 'nullable|file|mimes:pdf,mp4,mkv,avi,webm|max:102400', 
//     ]);

//     if ($validator->fails()) {
//         return response()->json([
//             'success' => false,
//             'message' => $validator->errors(),
//         ], 400); 
//     }

   
//     if ($request->hasFile('file')) {
    
//         $path = $request->file('file')->store('materials', 'uploads');
//         $file_path = asset('uploads/' . $path); 
//         $material->file = $file_path; 
//     }

//     $material->update($request->only(['url', 'type', 'course_id']));

//     $material->save();

//     return response()->json([
//         'success' => true,
//         'data' => $material,
//     ], 200); 
// }
public function update(Request $request, $id)
{
    $material = Material::find($id);

    if (!$material) {
        return response()->json([
            'success' => false,
            'message' => 'Material not found',
        ], 404);
    }

    $validator = Validator::make($request->all(), [
        'url' => 'sometimes|string',
        'type' => 'sometimes|in:pdf,video,audio,text',
        'course_id' => 'sometimes|exists:courses,id',
        'file' => 'nullable|file|mimes:pdf,mp4,mkv,avi,webm|max:102400', // Limit file size to 100MB
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors(),
        ], 400); 
    }

    if ($request->hasFile('file')) {
        $course = Course::find($request->course_id ?? $material->course_id);

        if ($course) {
            $courseName = preg_replace('/[^a-zA-Z0-9-_]/', '_', strtolower($course->name));

            $folderPath = 'courses_materials/' . $courseName;

            $path = $request->file('file')->store($folderPath, 'uploads');
            $file_path = asset('uploads/' . $path); 

            $material->file = $file_path; 
        }
    }

    $material->update($request->only(['url', 'type', 'course_id']));

    
    $material->save();

    return response()->json([
        'success' => true,
        'data' => $material,
    ], 200);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $material = Material::find($id);

        if (!$material) {
            return response()->json([
                'success' => false,
                'message' => 'Material not found',
            ], 404); 
        }

        $material->delete();

        return response()->json([
            'success' => true,
            'message' => 'Material deleted successfully',
        ], 200); 
    }

public function getMaterialsByCourseId($courseId)
{
    $materials = Material::where('course_id', $courseId)->get();
    return response()->json(['data' => $materials]);
}
}
