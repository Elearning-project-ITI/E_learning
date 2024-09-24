<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Firebase\JWT\JWT; // If you're using Firebase JWT package

class BaseController extends Controller
{
    /**
     * Success response method.
     *
     * @param array $result
     * @param string $message
     * @return \Illuminate\Http\Response
     */
    public function sendResponse($result, $message)
    {
        try {
            // Check if $result is not empty
            if (!empty($result)) {
                // Encode the $result into a JWT token using Firebase\JWT or JWTAuth
                $token = JWT::encode($result, env('JWT_SECRET'), 'HS256'); // Ensure JWT_SECRET is in your .env

                // Alternatively, using JWTAuth to generate token
                // $token = JWTAuth::claims($result)->attempt(['id' => 8]); // Adjust if you're using JWTAuth
            }

            // Create the response with the token
            $response = [
                'success' => true,
                'data'   => $token ?? $result,  // Return the token or result
                'message' => $message,
            ];

            return response()->json($response, 200);

        } catch (JWTException $e) {
            // Handle any errors with token creation
            return $this->sendError('Could not create token.', [], 500);
        }
    }

    /**
     * Return error response.
     *
     * @param string $error
     * @param array $errorMessages
     * @param int $code
     * @return \Illuminate\Http\Response
     */
    public function sendError($error, $errorMessages = [], $code = 422)
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];

        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }

        return response()->json($response, $code);
    }
}
