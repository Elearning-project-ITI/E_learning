<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
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
        //
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
    public function getAllNotifications(Request $request)
    {
        $user = Auth::user();
        $notifications = $user->notifications()->get()->map(function ($notification) {
            return [
                'message' => $notification->data['message']
            ];
        });

        return response()->json([
            'status' => 'success',
            'notifications' => $notifications
        ], 200);
    }

    // Fetch unread notifications for the authenticated user
    public function getUnreadNotifications(Request $request)
    {
        $user = Auth::user();
        $unreadNotifications = $user->unreadNotifications()->get()->map(function ($notification) {
            return [
                'message' => $notification->data['message']
            ];
        });
        return response()->json([
            'status' => 'success',
            'unread_notifications' => $unreadNotifications
        ], 200);
    }
    public function markAllAsRead()
{
    $user = Auth::user();
    
    // Mark all unread notifications as read
    $user->unreadNotifications->markAsRead();

    return response()->json([
        'status' => 'success',
        'message' => 'All unread notifications marked as read'
    ]);
}
}
