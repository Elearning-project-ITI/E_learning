<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session; // Import the Stripe Checkout Session class
use Exception;
use App\Models\Course;  // Assuming courses are stored in a Course model
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
                'success_url' => route('success'), 
                'cancel_url' => route('cancel'),
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
    
}