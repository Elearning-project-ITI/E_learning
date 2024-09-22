<?php

namespace App\Http\Controllers\Api;

//use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\BaseController;

use App\Models\User;
use Illuminate\Support\Facades\Password;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\LoginUserRequest;

class AuthController extends BaseController
{
    // Register a new user
    public function register(StoreUserRequest $request){
        // if ($request->bearerToken()) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'You are already logged in. Please log out first.'
        //     ], 403);
        // }
    //     $messages = [
    //         'name.required' => 'The name field is required.',
    //         'email.required' => 'The email field is required.',
    //         'email.unique' => 'This email is already registered.',
    //         'email.email' => 'Please provide a valid email address.',
    //         'password.required' => 'The password field is required.',
    //         'password.min' => 'The password must be at least 8 characters.',
    //         'password.confirmed' => 'Password confirmation does not match.',
    //         'phone.required' => 'The phone field is required.',
    //         'phone.regex' => 'Please provide a valid phone number with 10 to 15 digits.',
    //     ];
    //   //dd($request['email']);
    //   $rules = [
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|string|email|max:255|unique:users',
    //         'password' => 'required|string|min:8|confirmed',
    //         'phone' => 'required|string|regex:/^\+?[0-9]{10,15}$/', 

    //   ];
    //   //dd($request->all());

        // $input     = $request->all();

        // $validator = Validator::make($input, $rules);
        // // dd($request['name']);
        // if ($validator->fails()) {
        //     return $this->sendError('Validation Error.', $validator->errors());       
        // }
        // Create user
        $imagePath = $request->file('image')->store('user_images', 'public');

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' =>$request->phone,
            'role' => 'student', // Default role as 'student'
            'image' => $imagePath,  // Image is required and stored


        ]);

        // Generate token
        //$token['token'] = $user->createToken('auth_token')->plainTextToken;
        $token['name'] =  $user->name;

        return $this->sendResponse(
        [],
            'User register successfully.',
        );
    }

    // Login a user
    public function login(LoginUserRequest $request)
    {
        // Check if the user is already authenticated
       
            // // Check if the user already has an access token
            // if ($request->user()->currentAccessToken()) {
            //     return response()->json([
            //         'success' => false,
            //         'message' => 'You are already logged in. Please log out first.'
            //     ], 403);
            // }
        
    
        // Attempt to authenticate the user
        if (!Auth::attempt($request->only('email', 'password'))) {
            
            return $this->sendError('Invalid email or password.', [], 401);        

            
        }
    
        // Get the authenticated user
        $user = Auth::user();
        if ($user->tokens()->count() >= 2) {
            $oldestToken = $user->tokens()->orderBy('created_at')->first();
            $oldestToken->delete();
            $message = $user->name . ' login successfully. Logged out from one of the two devices.';
            }
        else {
                $message = $user->name . ' login successfully.';
            }
        // Generate a new token
        $token = $user->createToken('auth_token')->plainTextToken;
       
        $response = [
            'access_token' => $token,
            'message' => $message,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'image' => asset('storage/' . $user->image),  // Include the image URL
            ],
        ];

        return $this->sendResponse($response, $message);
    }

    // Logout user
    public function logout(Request $request)
    { 
        
        $request->user()->currentAccessToken()->delete();

        return $this->sendResponse([], 'Successfully logged out.');

    }

    // Get the authenticated user
    public function sendResetLinkEmail(Request $request)
    {
        // Validate the email input
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Return an error response if the email is not found
            return $this->sendError('Email does not exist in our records.', [], 404);        }
        // Send password reset link
        $status = Password::sendResetLink(
            $request->only('email')
        );
        // Return appropriate response based on the status
        if ($status === Password::RESET_LINK_SENT) {
            return $this->sendResponse([], 'Password reset link sent!');
        } elseif ($status === Password::RESET_THROTTLED) {
            return $this->sendResponse([], 'Password reset link sent!');
        } else {
            return $this->sendError('Unable to send reset link to the provided email.', [], 400);
        } 
    }
    public function resetPassword(Request $request)
    {
        // Validate the request data
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Attempt to reset the password
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                // Update user's password
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        // Return appropriate response based on the status
        if ($status === Password::PASSWORD_RESET) {
            return $this->sendResponse([], 'Password reset successful!');
        } else {
            return $this->sendError('Invalid token or email.', [], 400);
        }
    }


}