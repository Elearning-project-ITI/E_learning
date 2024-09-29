<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session; // Import the Stripe Checkout Session class
use Exception;
use App\Models\Course;  // Assuming courses are stored in a Course model
use App\Models\Booking;  // Import the Booking model

use App\Http\Controllers\Api\BaseController;
use Google\Client as GoogleClient;
use Google\Service\Drive as GoogleDrive;
use Google\Service\Drive\Permission;
class PaymentController extends BaseController
{
    public function handlePayment(Request $request)
    {
        // Validate the request data
        $request->validate([
            'id' => 'required|exists:courses,id', // Ensure the course exists
        ]);

        try {
            // Set the Stripe secret key from the environment
            Stripe::setApiKey(env('STRIPE_SECRET'));
            $studentEmail = auth()->user()->email;

            // Find the course price based on the provided course ID
           //   dd( $studentEmail);
             $course = Course::find($request->id);
             $amount = $course->price * 100; // Stripe requires the amount in cents
            
            // Ensure that course is retrieved correctly
            if (!$course) {
                return response()->json(['success' => false, 'error' => 'Course not found'], 404);
            }

            $coursename = $course->name;
            $image =$course->drive_image;
            
           //dd($image);
            $price = $course->price * 100; // Stripe expects the amount in cents
            $session = Session::create([
                'payment_method_types' => ['card'],
                'customer_email' => $studentEmail, // Set student's email
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => 'USD',
                            'product_data' => [
                                'name' => $coursename,
                                'images' => $image ? [$image] : [], 
                            ],
                            'unit_amount' => $price,  // Price is already in cents
                        ],
                        'quantity' => 1,
                    ],
                ],
                'mode' => 'payment',
                'success_url' => config('app.frontend_url') . '/verifypayment?status=success&course=' . $course->id,
                'cancel_url' => config('app.frontend_url') . '/verifypayment?status=cancel&course=' . $course->id,
            ]);

            // Redirect to the Stripe Checkout session URL
            
            return response()->json(['url' => $session->url]);

        } catch (Exception $e) {
            // Handle any errors that occur during payment processing
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function success(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id', 
        ]);

        try {
            $user = auth()->user();
            $courseId = $request->course_id;

            // Find the course
            $course = Course::find($courseId);
            if (!$course) {
                return response()->json(['success' => false, 'error' => 'Course not found'], 404);
            }
            // Check if the user has already booked the course
            $existingBooking = Booking::where('user_id', $user->id)
                ->where('course_id', $courseId)
                ->first();

            if ($existingBooking) {
                return response()->json(['success' => false, 'error' => 'Already booked'], 400);
            }

            // Create the booking
            Booking::create([
                'user_id' => $user->id,
                'course_id' => $courseId,
                'date' => now(), // Store the current date and time
            ]);

            // Return success response with the course name
            return response()->json([
                'success' => true,
                'message' => 'Payment successful, '.$course->name.' booked!',
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function cancel()
    {
        return response()->json(['success' => false, 'message' => 'Payment was cancelled']);
    }
    public function checkBooking(Request $request)
{
    // Validate the request data
    $request->validate([
        'course_id' => 'required|exists:courses,id', // Ensure the course exists
    ]);

    $user = auth()->user(); // Get the authenticated user
    $courseId = $request->course_id; // Get the course ID from the request

    // Check if the user has already booked the course
    $booking = Booking::where('user_id', $user->id)
        ->where('course_id', $courseId)
        ->first();

    if ($booking) {
        return response()->json([
            'success' => true,
            'message' => 'Course already booked',
            'course_name' => $booking->course->name, // Return the course name
            'date' => $booking->date, // Return the booking date
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Course not booked yet',
    ]);
}
}