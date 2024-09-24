<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // Add this for handling storage operations


class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::all();

        // Return a JSON response with the list of courses
        return response()->json([
            'success' => true,
            'data' => $courses,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', 
            'date' => 'required|date',
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
        ]);
    
        return response()->json([
            'success' => true,
            'message' => 'Course created successfully!',
            'data' => $course,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Find the course by ID
        $course = Course::find($id);

        // Check if the course exists
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found!',
            ], 404); // Return a 404 error if the course is not found
        }

        // Return the course details as a JSON response
        return response()->json([
            'success' => true,
            'data' => $course,
        ], 200); // HTTP 200 for OK
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
            'image' => 'sometimes|file|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate the image
            'date' => 'sometimes|required|date',
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
    
            
            $imagePath = $request->file('image')->store('courses_images', 'public');
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
                'created_at' => $course->created_at,
                'updated_at' => $course->updated_at,
            ]
        ], 200); 
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the course by ID
        $course = Course::find($id);

        // Check if the course exists
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found!',
            ], 404); // Return 404 if the course is not found
        }

        // Delete the course
        $course->delete();

        // Return a JSON response indicating success
        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully!',
        ], 200); // HTTP 200 for OK
    }
}
