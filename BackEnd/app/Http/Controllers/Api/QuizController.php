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
        // Fetch all quizzes with related course information
        $quizzes = Quiz::with('course')->get();

        // Return a JSON response with the quizzes
        return response()->json([
            'success' => true,
            'data' => $quizzes,
        ], 200); // HTTP 200 for OK
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate using Validator
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id', // Ensure course_id exists in the courses table
        ]);

        // Check for validation failures
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422); // HTTP 422 for Unprocessable Entity
        }

        // Create a new quiz with the validated data
        $quiz = Quiz::create($request->all());

        // Return a JSON response with the created quiz
        return response()->json([
            'success' => true,
            'data' => $quiz,
        ], 201); // HTTP 201 for Created
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            // Fetch the quiz with the specified ID and include related course information
            $quiz = Quiz::with('course')->findOrFail($id);

            // Return a JSON response with the quiz
            return response()->json([
                'success' => true,
                'data' => $quiz,
            ], 200); // HTTP 200 for OK
        } catch (ModelNotFoundException $e) {
            // Return a JSON response for not found
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found',
            ], 404); // HTTP 404 for Not Found
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            // Find the quiz with the specified ID
            $quiz = Quiz::findOrFail($id);

            // Validate using Validator
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'course_id' => 'required|exists:courses,id', // Ensure course_id exists in the courses table
            ]);

            // Check for validation failures
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422); // HTTP 422 for Unprocessable Entity
            }

            // Update the quiz with the validated data
            $quiz->update($request->all());

            // Return a JSON response with the updated quiz
            return response()->json([
                'success' => true,
                'data' => $quiz,
            ], 200); // HTTP 200 for OK
        } catch (ModelNotFoundException $e) {
            // Return a JSON response for not found
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found',
            ], 404); // HTTP 404 for Not Found
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the quiz by its ID
        $quiz = Quiz::find($id);

        if (!$quiz) {
            // Return a JSON response if the quiz is not found
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found',
            ], 404); // HTTP 404 for Not Found
        }

        // Delete the quiz
        $quiz->delete();

        // Return a JSON response indicating success
        return response()->json([
            'success' => true,
            'message' => 'Quiz deleted successfully',
        ], 200); // HTTP 200 for OK
    }
    // Fetch quizzes by course ID
    public function getQuizzesByCourse($course_id)
    {
        $quizzes = Quiz::where('course_id', $course_id)->get();
        return response()->json(['success' => true, 'data' => $quizzes], 200);
    }
//     public function submitAnswers(Request $request, $quizId)
// {
//     // Validate the request
//     $request->validate([
//         'answers' => 'required|array',
//         'answers.*.questionId' => 'required|exists:questions,id',
//         'answers.*.selectedChoice' => 'nullable|exists:choices,choice',
//     ]);

//     // Get the quiz, questions, and correct answers
//     $quiz = Quiz::findOrFail($quizId);
//     $questions = $quiz->questions()->with('choices')->get();

//     $score = 0;
//     $totalQuestions = count($questions);

//     foreach ($questions as $question) {
//         $userAnswer = collect($request->answers)->firstWhere('questionId', $question->id);

//         // If the user has selected an answer, check if it's correct
//         if ($userAnswer && $userAnswer['selectedChoice']) {
//             $correctChoice = $question->choices->where('is_correct', true)->first();

//             if ($correctChoice && $correctChoice->choice === $userAnswer['selectedChoice']) {
//                 $score++;
//             }
//         }
//     }

//     // Calculate the result
//     $result = [
//         'quizId' => $quizId,
//         'score' => $score,
//         'totalQuestions' => $totalQuestions,
//         'percentage' => ($score / $totalQuestions) * 100,
//     ];

//     // Optionally save the result to the database (e.g., for future reference)
//     $userQuizResult = new UserQuizResult();
//     $userQuizResult->user_id = auth()->id();
//     $userQuizResult->quiz_id = $quizId;
//     $userQuizResult->score = $score;
//     $userQuizResult->total_questions = $totalQuestions;
//     $userQuizResult->save();

//     // Return the result
//     return response()->json(['message' => 'Quiz submitted successfully', 'result' => $result]);
// }
}
