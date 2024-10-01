<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class QuizController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $quizzes = Quiz::with('course')->get();

        return response()->json([
            'success' => true,
            'data' => $quizzes,
        ], 200); 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id', 
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422); 
        }

        $quiz = Quiz::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $quiz,
        ], 201); 
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $quiz = Quiz::with('course')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $quiz,
            ], 200); 
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $quiz = Quiz::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'course_id' => 'required|exists:courses,id', 
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422); 
            }

            $quiz->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $quiz,
            ], 200); 
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found',
            ], 404); 
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $quiz = Quiz::find($id);

        if (!$quiz) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found',
            ], 404);
        }

        $quiz->delete();

        return response()->json([
            'success' => true,
            'message' => 'Quiz deleted successfully',
        ], 200); 
    }
}
