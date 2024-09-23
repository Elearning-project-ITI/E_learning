<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Exception;
use App\Models\Course;  // Assuming courses are stored in a Course model

class PaymentController extends Controller
{
    public function handlePayment(Request $request)
    {
        // Validate the request data
        // $request->validate([
        //     'course_id' => 'required|exists:courses,id', // Make sure the course exists
        //     'payment_method_id' => 'required|string', // Stripe payment method ID from frontend
        // ]);

        try {
            // Set the Stripe secret key from the environment
            Stripe::setApiKey(env('STRIPE_SECRET'));

            // Find the course price based on the provided course ID
            // $course = Course::findOrFail($request->course_id);
            // $amount = $course->price * 100; // Stripe requires the amount in cents

            // Create a new PaymentIntent
            $paymentIntent = PaymentIntent::create([
                'amount' => 1000, // Amount in cents
                'currency' => 'usd', // or whatever currency you're using
                'payment_method' => 'pm_card_visa', // ID from frontend
               // 'confirmation_method' => 'manual',
                'confirm' => true,
        'automatic_payment_methods' => [
        'enabled' => true,
        'allow_redirects' => 'never'  // Disable redirects for simpler payment flows
    ],
            ]);

            // Return a successful response with the payment intent data
            return response()->json([
                'success' => true,
                'paymentIntent' => $paymentIntent
            ]);

        } catch (Exception $e) {
            // Handle any errors that occur during payment processing
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
