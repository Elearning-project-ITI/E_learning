<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
        // Manual validation using Validator facade
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'required|string|max:255', // Adjust as needed for image uploads
            'date' => 'required|date',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422); // HTTP 422 Unprocessable Entity for validation errors
        }

        // Create a new course with the validated data
        $course = Course::create($validator->validated());

        // Return a JSON response indicating success
        return response()->json([
            'success' => true,
            'message' => 'Course created successfully!',
            'data' => $course,
        ], 201); // HTTP 201 for "Created"
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
        // Find the course by ID
        $course = Course::find($id);

        // Check if the course exists
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found!',
            ], 404); // Return 404 error if the course is not found
        }

        // Manual validation for updating course
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'image' => 'sometimes|required|string|max:255', // Handle file uploads separately if needed
            'date' => 'sometimes|required|date',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422); // HTTP 422 for validation errors
        }

        // Update the course with the validated data (either full or partial update)
        $course->update($validator->validated());

        // Return a JSON response indicating success
        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully!',
            'data' => $course,
        ], 200); // HTTP 200 for OK
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