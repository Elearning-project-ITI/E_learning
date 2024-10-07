<?php
//use Illuminate\Support\Facades\Broadcast;

use App\Models\User;

//Broadcast::routes() ;

Broadcast::channel('private-admin-notifications', function ($user) {
    return $user->role === 'admin';
});

// User notifications channel
Broadcast::channel('private-user-notifications', function ($user) {
    return true; // All authenticated users can access this
});

// Personal user notifications channel
Broadcast::channel('private-user-notifications.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});