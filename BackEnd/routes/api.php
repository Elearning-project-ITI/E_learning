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
use App\Http\Controllers\Api\QuestionController;









Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::resource('user', UserController::class);

Route::resource('course', CourseController::class);

Route::resource('wishlist', WishlistController::class);

Route::resource('review', ReviewController::class);

Route::resource('notification', NotificationController::class);

Route::resource('quiz', QuizController::class);

Route::resource('choice', ChoiceController::class);

Route::resource('material', MaterialController::class);

Route::resource('quizuser', QuizUserController::class);

Route::resource('question', QuestionController::class);

Route::get('/quiz/{quiz_id}/questions', [QuestionController::class, 'getByQuiz']); // Get questions by Quiz ID


