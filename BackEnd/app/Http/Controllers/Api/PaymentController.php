<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session; // Import the Stripe Checkout Session class
use Exception;
use App\Models\Course;  // Assuming courses are stored in a Course model

class PaymentController extends Controller
{
    public function handlePayment(Request $request)
    {
        // Validate the request data
        $request->validate([
            'course_id' => 'required|exists:courses,id', // Ensure the course exists
        ]);

        try {
            // Set the Stripe secret key from the environment
            Stripe::setApiKey(env('STRIPE_SECRET'));

            // Find the course price based on the provided course ID
             $course = Course::find($request->course_id);
             $course = Course::find($request->course_id);
             $amount = $course->price * 100; // Stripe requires the amount in cents
            $course = Course::find($request->course_id);
             $amount = $course->price * 100; // Stripe requires the amount in cents

            // Ensure that course is retrieved correctly
            if (!$course) {
                return response()->json(['success' => false, 'error' => 'Course not found'], 404);
            }

            $coursename = $course->name;
            $price = $course->price * 100; // Stripe expects the amount in cents

            // Create the Checkout Session
            $session = Session::create([
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => 'USD',
                            'product_data' => [
                                'name' => $coursename,
                            ],
                            'unit_amount' => $price,  // Price is already in cents
                        ],
                        'quantity' => 1,
                    ],
                ],
                'mode' => 'payment',
                'success_url' => route('success'), 
                'cancel_url' => route('cancel'),
            ]);

            // Redirect to the Stripe Checkout session URL
            return redirect()->away($session->url);

        } catch (Exception $e) {
            // Handle any errors that occur during payment processing
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
