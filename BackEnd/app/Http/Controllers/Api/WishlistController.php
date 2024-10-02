<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $user = Auth::user();

    //     $wishlistItems = Wishlist::with('course')
    //         ->where('user_id', $user->id)
    //         ->get();

    //     return response()->json([
    //         'success' => true,
    //         'wishlist' => $wishlistItems,
    //     ]);
    // }
    public function index()
{
    $user = Auth::user();
    
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not authenticated'
        ], 401);
    }

    $wishlistItems = Wishlist::with('course')
        ->where('user_id', $user->id)
        ->get();

    return response()->json([
        'success' => true,
        'wishlist' => $wishlistItems,
    ]);
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
        $request->validate([
            'course_id' => 'required|exists:courses,id', 
        ]);

        $user = Auth::user();

        $wishlist = Wishlist::create([
            'user_id' => $user->id,
            'course_id' => $request->course_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Course added to wishlist successfully!',
            'wishlist_item' => $wishlist,
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
    // public function destroy(string $id)
    // {
    //     //
    // }
    public function destroy(string $id)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not authenticated'
        ], 401);
    }

    // Find the wishlist item by course_id and user_id
    $wishlistItem = Wishlist::where('user_id', $user->id)->where('course_id', $id)->first();

    if (!$wishlistItem) {
        return response()->json([
            'success' => false,
            'message' => 'Wishlist item not found'
        ], 404);
    }

    // Delete the wishlist item
    $wishlistItem->delete();

    return response()->json([
        'success' => true,
        'message' => 'Course removed from wishlist successfully!'
    ]);
}

}
