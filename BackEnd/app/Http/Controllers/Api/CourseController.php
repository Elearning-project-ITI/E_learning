<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors(),
        ], 422);
    }

    // if ($request->hasFile('image')) {
    //     $image = $request->file('image');
    //     $imageName = time().'.'.$image->getClientOriginalExtension(); 
    //     $image->storeAs('public/course_images', $imageName); 
    // }

    $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('courses_images', 'public');
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
    // public function update(Request $request, $id)
    // {
    //     // Find the course by ID
    //     $course = Course::find($id);

    //     // Check if the course exists
    //     if (!$course) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Course not found!',
    //         ], 404); // Return 404 error if the course is not found
    //     }

    //     // Manual validation for updating course
    //     $validator = Validator::make($request->all(), [
    //         'name' => 'sometimes|required|string|max:255',
    //         'price' => 'sometimes|required|numeric',
    //         'image' => 'sometimes|required|string|max:255', // Handle file uploads separately if needed
    //         'date' => 'sometimes|required|date',
    //     ]);

    //     // Check if validation fails
    //     if ($validator->fails()) {
    //         return response()->json([
    //             'success' => false,
    //             'errors' => $validator->errors(),
    //         ], 422); // HTTP 422 for validation errors
    //     }

    //     // Update the course with the validated data (either full or partial update)
    //     $course->update($validator->validated());

    //     // Return a JSON response indicating success
    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Course updated successfully!',
    //         'data' => $course,
    //     ], 200); // HTTP 200 for OK
    // }


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
        'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        'date' => 'sometimes|required|date',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors(),
        ], 422);
    }

    if ($request->hasFile('image')) {
        if ($course->image) {
            \Storage::delete('public/course_images/' . $course->image);
        }

        $image = $request->file('image');
        $imageName = time().'.'.$image->getClientOriginalExtension();
        $image->storeAs('public/course_images', $imageName);

        $course->update(array_merge($validator->validated(), ['image' => $imageName]));
    } else {
        $course->update($validator->validated());
    }

    return response()->json([
        'success' => true,
        'message' => 'Course updated successfully!',
        'data' => $course,
    ], 200);
}

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
