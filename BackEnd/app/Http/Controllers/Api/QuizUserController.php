<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuizUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuizUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all QuizUser records
        $quizUsers = QuizUser::with(['user', 'quiz'])->get();

        // Return a JSON response with the QuizUser records
        return response()->json([
            'success' => true,
            'data' => $quizUsers,
        ], 200); // HTTP 200 for OK
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Create a validator instance with rules
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'quiz_id' => 'required|exists:quizzes,id',
            'final_result' => 'nullable|numeric|min:0|max:100',
        ]);

        // If validation fails, return the errors
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422); // HTTP 422 for Unprocessable Entity
        }

        // Create a new QuizUser record with the validated data
        $quizUser = QuizUser::create($request->all());

        // Return a JSON response with the created QuizUser record
        return response()->json([
            'success' => true,
            'data' => $quizUser,
        ], 201); // HTTP 201 for Created
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Fetch the QuizUser record with the specified ID and include related user and quiz information
        $quizUser = QuizUser::with(['user', 'quiz'])->find($id);

        if (!$quizUser) {
            // Return a JSON response if the QuizUser record is not found
            return response()->json([
                'success' => false,
                'message' => 'QuizUser not found',
            ], 404); // HTTP 404 for Not Found
        }

        // Return a JSON response with the QuizUser record
        return response()->json([
            'success' => true,
            'data' => $quizUser,
        ], 200); // HTTP 200 for OK
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Fetch the QuizUser record with the specified ID
        $quizUser = QuizUser::find($id);

        if (!$quizUser) {
            // Return a JSON response if the QuizUser record is not found
            return response()->json([
                'success' => false,
                'message' => 'QuizUser not found',
            ], 404); // HTTP 404 for Not Found
        }

        // Create a validator instance with rules
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'quiz_id' => 'required|exists:quizzes,id',
            'final_result' => 'nullable|numeric|min:0|max:100',
        ]);

        // If validation fails, return the errors
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422); // HTTP 422 for Unprocessable Entity
        }

        // Update the QuizUser record with the validated data
        $quizUser->update($request->all());

        // Return a JSON response with the updated QuizUser record
        return response()->json([
            'success' => true,
            'data' => $quizUser,
        ], 200); // HTTP 200 for OK
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the QuizUser by ID
        $quizUser = QuizUser::find($id);

        // Check if the QuizUser exists
        if (!$quizUser) {
            return response()->json([
                'success' => false,
                'message' => 'QuizUser not found',
            ], 404); // HTTP 404 for Not Found
        }

        // Delete the QuizUser record
        $quizUser->delete();

        // Return a success response
        return response()->json([
            'success' => true,
            'message' => 'QuizUser deleted successfully',
        ], 200); // HTTP 200 for OK
    }
}
