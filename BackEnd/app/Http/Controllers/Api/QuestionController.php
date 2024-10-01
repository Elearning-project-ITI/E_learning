<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve all questions along with their related quizzes and choices
        $questions = Question::with(['quiz', 'choices'])->get();

        // Return the questions as a JSON response
        return response()->json([
            'success' => true,
            'data'    => $questions
        ], 200);
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
    public function store(Request $request)
    {
        // Validation of the request data
        $validator = Validator::make($request->all(), [
            'question' => 'required|string',
            'type' => 'required|in:multiple_choice,true_false',
            'score_question' => 'required|integer',
            'quiz_id' => 'required|exists:quizzes,id',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 400);
        }

        // Create a new question using the validated data
        $question = Question::create([
            'question' => $request->question,
            'type' => $request->type,
            'score_question' => $request->score_question,
            'quiz_id' => $request->quiz_id,
        ]);

        // Return a success response
        return response()->json([
            'success' => true,
            'message' => 'Question created successfully',
            'data' => $question
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
    // Find the question by ID
    $question = Question::find($id);

    // Check if the question exists
    if (!$question) {
        return response()->json([
            'success' => false,
            'message' => 'Question not found'
        ], 404);
    }

    // Return the found question
    return response()->json([
        'success' => true,
        'data' => $question
    ], 200);
    }

    public function getByQuiz($quiz_id)
    {
    // Get all questions related to the quiz
    $questions = Question::where('quiz_id', $quiz_id)->get();

    // Check if any questions were found
    if ($questions->isEmpty()) {
        return response()->json([
            'success' => false,
            'message' => 'No questions found for this quiz'
        ], 404);
    }

    // Return the list of questions
    return response()->json([
        'success' => true,
        'data' => $questions
    ], 200);
    }

    // public function getByQuiz($quiz_id)
    // {
    // // Fetch the quiz along with its associated questions
    // $quiz = Quiz::with('questions')->find($quiz_id);

    // // Check if the quiz exists
    // if (!$quiz) {
    //     return response()->json([
    //         'success' => false,
    //         'message' => 'Quiz not found'
    //     ], 404);
    // }

    // // Check if the quiz has questions
    // if ($quiz->questions->isEmpty()) {
    //     return response()->json([
    //         'success' => false,
    //         'message' => 'No questions found for this quiz'
    //     ], 404);
    // }

    // // Return the quiz and its questions
    // return response()->json([
    //     'success' => true,
    //     'data' => $quiz // This will include both the quiz and its questions
    // ], 200);
    // }

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
    public function update(Request $request, $id)
    {
    // Find the question by its ID
    $question = Question::find($id);

    // Check if the question exists
    if (!$question) {
        return response()->json([
            'success' => false,
            'message' => 'Question not found'
        ], 404);
    }

    // Validate the incoming request data
    $validatedData = $request->validate([
        'question' => 'required|string|max:255',
        'type' => 'required|in:multiple_choice,true_false',
        'score_question' => 'required|integer',
        'quiz_id' => 'required|exists:quizzes,id',
    ]);

    // Update the question with validated data
    $question->update($validatedData);

    // Return the updated question
    return response()->json([
        'success' => true,
        'message' => 'Question updated successfully',
        'data' => $question
    ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
    // Find the question by its ID
    $question = Question::find($id);

    // Check if the question exists
    if (!$question) {
        return response()->json([
            'success' => false,
            'message' => 'Question not found'
        ], 404);
    }

    // Delete the question
    $question->delete();

    // Return a success response
    return response()->json([
        'success' => true,
        'message' => 'Question deleted successfully'
    ], 200);
    }
    // public function getQuestionsByQuiz($quiz_id)
    // {
    //     $questions = Question::where('quiz_id', $quiz_id)->get();
    //     return response()->json(['success' => true, 'data' => $questions], 200);
    // }
}
