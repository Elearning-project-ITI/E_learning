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



use App\Http\Controllers\Api\AuthController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\StudentMiddleware;

use App\Http\Controllers\Api\PaymentController;

// Public routes
Route::middleware('guest:sanctum')->group(function () {

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);    
Route::post('forgot-password', [AuthController::class, 'sendResetLinkEmail'])->name('password.email');
Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');;
});
Route::get('/verify-email', [AuthController::class, 'verifyEmail']);

// Protected routes that require authentication (using sanctum middleware)
Route::middleware(['auth:sanctum'])->group( function () {

    Route::post('/logout', [AuthController::class, 'logout']);
   // Route::get('/user', [AuthController::class, 'user']);




// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


// Route::resource('user', UserController::class);

// Route::resource('course', CourseController::class);

// Route::resource('wishlist', WishlistController::class);

// Route::resource('review', ReviewController::class);

// Route::resource('notification', NotificationController::class);

// Route::resource('quiz', QuizController::class);

// Route::resource('choice', ChoiceController::class);

// Route::resource('material', MaterialController::class);

// Route::resource('quizuser', QuizUserController::class);

// Route::resource('question', QuestionController::class);

// Route::get('/quiz/{quiz_id}/questions', [QuestionController::class, 'getByQuiz']);


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

    Route::get('/profile', [UserController::class, 'showProfile'])->name('profile.show');
    Route::put('/profile', [UserController::class, 'update'])->name('profile.update');
    
    Route::middleware(StudentMiddleware::class)->group(function () {

    Route::post('/payment', [PaymentController::class, 'handlePayment'])->name('payment.handle');
    });
    // Routes for admins only
    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::get('/students', [UserController::class, 'index'])->name('students.index');
        Route::get('/students/{id}/profile', [UserController::class, 'showStudentProfile'])->name('students.profile.show');
        Route::post('course', [ CourseController::class, 'store']);

    });
});
Route::any('/{any}', function () {
    return response()->json([
        'message' => 'Route not found. Please check the URL and try again.'
    ], 404);
})->where('any', '.*');
