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
use App\Http\Controllers\Api\BroadcastController;



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
Route::post('/broadcasting/auth', [BroadcastController::class, 'authenticate']);
Route::get('/user/name', [UserController::class, 'getRole']);

Route::get('/notifications', [NotificationController::class, 'getAllNotifications']);
Route::get('/notifications/unread', [NotificationController::class, 'getUnreadNotifications']);
Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

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
    Route::resource('question', QuestionController::class);
    Route::get('/quiz/{quiz_id}/questions', [QuestionController::class, 'getByQuiz']);
    Route::post('/quiz/{quiz_id}/questions', [QuestionController::class, 'store']);
    Route::get('/course/{id}/materials', [MaterialController::class, 'getMaterialsByCourseId']);
    Route::get('/profile', [UserController::class, 'showProfile'])->name('profile.show');
    Route::put('/profile', [UserController::class, 'update'])->name('profile.update');
    Route::post('/quiz/{quiz_id}/questions/{question_id}/choices', [ChoiceController::class, 'store']);
    Route::get('/courses/most-booked', [CourseController::class, 'mostBookedCourses']);
    //////////////////////////////////////////////////////////////////////////
    // Fetch all quizzes for a specific course
Route::get('/course/{course_id}/quizzes', [QuizController::class, 'getQuizzesByCourse']);

// Fetch all questions for a specific quiz
//Route::get('/quiz/{quiz_id}/questions', [QuestionController::class, 'getQuestionsByQuiz']);

// Fetch all choices for a specific question
Route::get('/question/{question_id}/choices', [ChoiceController::class, 'getChoicesByQuestion']);
//////////////////////////////////////////////////////////////////////////////////
// Route::post('/quizzes/{quiz}/submit', [QuizController::class, 'submitAnswers']);
//////////////////////////////////////////////////////////////////////////////////
    Route::get('/my-reviews', [ReviewController::class, 'getAllReviewsForStudent'])->name('reviews.myReviews'); // add my-review 
    Route::get('/reviews', [ReviewController::class, 'getAllReviewsForStudents'])->name('reviews.all'); // add yours reviews


    
    
    Route::middleware(StudentMiddleware::class)->group(function () {    
        Route::get('/my-courses', [CourseController::class, 'myCourses'])->name('student.myCourses');

    // Route to get courses in the student's wishlist
    // Route::get('/my-wishlist', [WishlistController::class, 'myWishlist'])->name('student.myWishlist');
    Route::middleware('auth:api')->get('/my-wishlist', [WishlistController::class, 'index']);


    Route::post('/check-booking', [PaymentController::class, 'checkBooking']);
    Route::post('/payment', [PaymentController::class, 'handlePayment'])->name('payment.handle');
    Route::post('/payment/success', [PaymentController::class, 'success'])->name('success');
    Route::post('/payment/cancel', [PaymentController::class, 'cancel'])->name('cancel');
    Route::post('/quiz/{quiz}/submit', [QuizController::class, 'submit'])->name('quiz.submit');


    });
    // Routes for admins only
    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::get('/students', [UserController::class, 'index'])->name('students.index');
        Route::get('/students/{id}/profile', [UserController::class, 'showStudentProfile'])->name('students.profile.show');
        Route::post('course', [ CourseController::class, 'store']);
        Route::put('/question/{question_id}/choices/{choice_id}', [ChoiceController::class, 'update']);


        Route::put('/quiz/{quiz_id}', [QuizController::class, 'update']);
        Route::put('/question/{question_id}', [QuestionController::class, 'update']);
        Route::put('/question/{question_id}/choices/{choice_id}', [ChoiceController::class, 'update']);

        Route::get('/admin/reviews', [ReviewController::class, 'getAllReviewsForAdmin']); // add review by david
        Route::post('/trigger-user-registered', function (Request $request) {
            // Ensure the user is authenticated
            $user = User::find($request->input('user_id'));
        
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }
        
            // Trigger the UserRegistered event
            event(new UserRegistered($user));
        
            return response()->json(['message' => 'UserRegistered event triggered']);
        });

    });
});
Route::get('/course', [CourseController::class, 'index'])->name('course.index');

Route::any('/{any}', function () {
    return response()->json([
        'message' => 'Route not found. Please check the URL and try again.'
    ], 404);
})->where('any', '.*');
