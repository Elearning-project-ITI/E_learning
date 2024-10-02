<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; // <-- Add this line to use DB facade

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

public function submit(Request $request, $quizId)
{
    $userId = auth()->user()->id; 
    $submittedAnswers = $request->input('answers'); 

    $questions = DB::table('questions')
        ->where('quiz_id', $quizId)
        ->get();

    $totalScore = 0; 

    foreach ($questions as $question) {
        $correctChoice = DB::table('choices')
            ->where('question_id', $question->id)
            ->where('is_correct', 1)
            ->first();

        if (isset($submittedAnswers[$question->id]) && $submittedAnswers[$question->id] == $correctChoice->id) {
            $totalScore += $question->score_question;
        }
    }

    DB::table('quiz_user')->updateOrInsert(
        ['user_id' => $userId, 'quiz_id' => $quizId],
        ['final_result' => $totalScore, 'updated_at' => now()]
    );

    return response()->json([
        'final_result' => $totalScore,
        'message' => 'Quiz submitted successfully!',
    ]);
}


}
