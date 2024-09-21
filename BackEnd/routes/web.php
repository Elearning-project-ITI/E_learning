<?php

use Illuminate\Support\Facades\Route;
Route::any('/{any}', function () {
    return response()->json([
        'message' => 'Route not found. Please check the URL and try again.'
    ], 404);
})->where('any', '.*');
