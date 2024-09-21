<?php
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\ChoiceController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\QuizUserController;
use App\Http\Controllers\Api\AuthController;

// Public routes
Route::middleware('guest:sanctum')->group(function () {

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);    
Route::post('forgot-password', [AuthController::class, 'sendResetLinkEmail'])->name('password.email');
Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');;
});
// Protected routes that require authentication (using sanctum middleware)
Route::middleware(['auth:sanctum'])->group( function () {

    Route::post('/logout', [AuthController::class, 'logout']);
   // Route::get('/user', [AuthController::class, 'user']);

    // CRUD for resources, only accessible to authenticated users
    Route::resource('user', UserController::class);
    Route::resource('course', CourseController::class);
    Route::resource('wishlist', WishlistController::class);
    Route::resource('review', ReviewController::class);
    Route::resource('notification', NotificationController::class);
    Route::resource('quiz', QuizController::class);
    Route::resource('choice', ChoiceController::class);
    Route::resource('material', MaterialController::class);
    Route::resource('quizuser', QuizUserController::class);
});
Route::any('/{any}', function () {
    return response()->json([
        'message' => 'Route not found. Please check the URL and try again.'
    ], 404);
})->where('any', '.*');
