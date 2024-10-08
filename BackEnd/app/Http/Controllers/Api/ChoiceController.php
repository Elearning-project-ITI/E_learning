<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Choice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class ChoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve all choices from the database
        $choices = Choice::all();

        // Return the choices as a JSON response
        return response()->json([
            'success' => true,
            'data' => $choices
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
        // Define validation rules
        $validator = Validator::make($request->all(), [
            'choice' => 'required|string',
            'is_correct' => 'required|boolean',
            'question_id' => 'required|exists:questions,id', // Ensure question_id is valid
        ]);

        // If validation fails, return an error response
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 400);
        }

        // Create a new choice
        $choice = Choice::create([
            'choice' => $request->input('choice'),
            'is_correct' => $request->input('is_correct'),
            'question_id' => $request->input('question_id'),
        ]);

        // Return a success response with the newly created choice
        return response()->json([
            'success' => true,
            'data' => $choice,
            'message' => 'Choice created successfully!'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Find the choice by ID
        $choice = Choice::find($id);

        // Check if the choice exists
        if (!$choice) {
            return response()->json([
                'success' => false,
                'message' => 'Choice not found',
            ], 404);
        }

        // Return the choice data
        return response()->json([
            'success' => true,
            'data' => $choice,
        ], 200);
    }

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
    // 
    public function update(Request $request, $question_id, $choice_id)
{
    $choice = Choice::where('id', $choice_id)
                    ->where('question_id', $question_id)
                    ->first();

    if (!$choice) {
        return response()->json([
            'success' => false,
            'message' => 'Choice not found or does not belong to the specified question',
        ], 404);
    }

    $validator = Validator::make($request->all(), [
        'choice' => 'required|string|max:255',
        'is_correct' => 'required|boolean',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors(),
        ], 422);
    }

    $choice->update([
        'choice' => $request->input('choice'),
        'is_correct' => $request->input('is_correct'),
    ]);

    return response()->json([
        'success' => true,
        'data' => $choice,
    ], 200);

    }
//     public function update(Request $request, string $id)
// {
//     // Find the choice by ID
//     $choice = Choice::find($id);

//     // Check if the choice exists
//     if (!$choice) {
//         return response()->json([
//             'success' => false,
//             'message' => 'Choice not found',
//         ], 404);
//     }

//     // Validate the incoming request data
//     $validator = Validator::make($request->all(), [
//         'choice' => 'required|string|max:255',
//         'is_correct' => 'required|boolean',
//     ]);

//     if ($validator->fails()) {
//         return response()->json([
//             'success' => false,
//             'errors' => $validator->errors(),
//         ], 422);
//     }

//     // Update the choice with the validated data
//     $choice->choice = $request->input('choice');
//     $choice->is_correct = $request->input('is_correct');

//     // Save the changes to the database
//     if ($choice->save()) {
//         // Return the updated choice data
//         return response()->json([
//             'success' => true,
//             'data' => $choice,
//         ], 200);
//     } else {
//         return response()->json([
//             'success' => false,
//             'message' => 'Failed to update choice',
//         ], 500);
//     }
// }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Find the choice by ID
        $choice = Choice::find($id);

        // Check if the choice exists
        if (!$choice) {
            return response()->json([
                'success' => false,
                'message' => 'Choice not found',
            ], 404);
        }

        // Delete the choice
        $choice->delete();

        // Return a success response
        return response()->json([
            'success' => true,
            'message' => 'Choice deleted successfully',
        ], 200);
    }
     // Fetch choices by question ID
     public function getChoicesByQuestion($question_id)
     {
         $choices = Choice::where('question_id', $question_id)->get();
         return response()->json(['success' => true, 'data' => $choices], 200);
     }
}
