<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use Illuminate\Support\Facades\Validator;


class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5', 
            'comment' => 'required|string|max:500',
            'course_id' => 'required|exists:courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        
        $review = Review::create([
            'rating' => $request->rating,
            'comment' => $request->comment,
            'user_id' => auth()->id(),
            'course_id' => $request->course_id,
        ]);

        return response()->json([
            'success' => true,
            'review' => $review,
        ], 201);
    }

    public function getAllReviewsForStudent(Request $request)
    {
        $reviews = Review::with(['course']) 
            ->where('user_id', $request->user()->id) 
            ->get();

        return response()->json([
            'success' => true,
            'reviews' => $reviews,
        ]);
    }

    public function getAllReviewsForStudents()
{
    $reviews = Review::with(['user', 'course'])->get();
    
    return response()->json([
        'success' => true,
        'reviews' => $reviews,
    ]);
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getAllReviewsForAdmin()
    {
        $reviews = Review::with(['user', 'course'])->get();
    
        return response()->json([
            'success' => true,
            'reviews' => $reviews,
        ]);
    }
    
}


