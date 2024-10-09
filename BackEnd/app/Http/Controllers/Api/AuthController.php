<?php

namespace App\Http\Controllers\Api;
use GuzzleHttp\Client;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Events\NewUserRegistered;

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
use App\Mail\VerifyEmail;  // Make sure this is at the top of your controller
use Illuminate\Support\Facades\Notification;
use App\Notifications\WelcomeNotification;
use App\Notifications\NewUserNotification;
use App\Notifications\VerificationNotification;

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
        // dd("hellooooooo");

        // if ($request->hasFile('image')) {
        //     $image = $request->file('image');
        //     $imagePath = $image->store('images', 'user_images');
        // }
        $isValidEmail = $this->checkEmailValidity($request->email);

        if (!$isValidEmail) {
            return $this->sendError(['The provided email does not real.'], [], 401);        

           // return $this->sendError('Invalid Email', ['error' => 'The provided email does not real.']);
        }
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('user_images', 'uploads');
            $imagePath = asset('uploads/'.$imagePath);

        }


        

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' =>$request->phone,
            'role' => 'student', // Default role as 'student'
            'image' => $imagePath,  // Image is required and stored
            'email_verification_token' => Str::random(60),
            'email_verified_at' => null,
            'verification_token_created_at' => now(),
            
        ]);
                    // return ["message"=>$request->all()];

//  return ["message"=>$request->all()];
        // Generate token
        //$token['token'] = $user->createToken('auth_token')->plainTextToken;
       // $token['name'] =  $user->name;
       Mail::to($user->email)->send(new VerifyEmail($user));
       
       $user->notify(new WelcomeNotification($user));
       $admins = User::where('role', 'admin')->get();
       Notification::send($admins, new NewUserNotification($user));
       broadcast(new NewUserRegistered($user));

       return $this->sendResponse(
        [],
            'Registration successful. Please verify your email.',
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
        
            $user = User::where('email', $request->email)->first();

        // Attempt to authenticate the user
        if (!Auth::attempt($request->only('email', 'password'))) {
            
            return $this->sendError(['Invalid email or password.'], [], 401);        

            
        }
        if (is_null($user->email_verified_at)) {
            if (now()->diffInMinutes($user->verification_token_created_at) < -60.0) {
                $user->email_verification_token = Str::random(60);
            $user->verification_token_created_at = now();
            $user->save();

            // Resend the email
            Mail::to($user->email)->send(new VerifyEmail($user));

            return $this->sendError(['Verification token has expired. A new verification email has been sent.'], [], 400);
            }
            return $this->sendError(['Please verify your email before logging in.'], [], 403);
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
            return $this->sendError(['Email does not exist in our records.'], [], 404);        }
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
            return $this->sendError(['Unable to send reset link to the provided email.'], [], 400);
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
            return $this->sendError(['Invalid token or email.'], [], 400);
        }
    }

    public function verifyEmail(Request $request) {
        $user = User::where('email_verification_token', $request->token)->first();
    
        if (!$user) {
            return $this->sendError (['Invalid verification token.'],[],400);
        }
    
        // Check if the token is expired (1 hour = 60 minutes)
      //  dd(now()->diffInMinutes($user->verification_token_created_at));
        if (now()->diffInMinutes($user->verification_token_created_at) < -60.0) {
            return $this->sendError (['Verification token has expired. must be login to resend Verification '],[],400);
            
        }
    
        // If the token is still valid, verify the user's email
        $user->email_verified_at = now();
        $user->email_verification_token = null; // Clear the token
        $user->verification_token_created_at = null; // Clear the timestamp
        $user->save();
     //   $user->notify(new VerificationNotification());

        return $this->sendResponse([], 'Your email has been verified.');
    }
    private function checkEmailValidity($email)
{
    $client = new Client();
    $apiKey = '799aafd5aeb2438fb0ef0e6b7b761b41';  // Use the API key provided by the service you're using
    
    try {
        $response = $client->request('GET', 'https://emailvalidation.abstractapi.com/v1/', [
            'query' => [
                'api_key' => $apiKey,
                'email' => $email,
            ]
        ]);

        $data = json_decode($response->getBody(), true);

        // Check if the response indicates success or failure
        if (isset($data['error'])) {
            if ($data['error']['message'] == "Invalid API key") {
                // Handle invalid API key case
                \Log::error('Invalid Abstract API key.');
               // return response()->json(['error' => 'Invalid API key. Please contact the admin.'], 400);
                return $this->sendError ('Invalid API key. Please contact the admin.',[],400);

            }

            if ($data['error']['message'] == "Account ran out of credits") {
                // Handle no credits case
                \Log::error('Abstract API account has run out of credits.');
               // return response()->json(['error' => 'Abstract API account ran out of credits.'], 400);
                return $this->sendError ('Abstract API account ran out of credits.',[],400);
            }
        }

        // Check if the email is valid based on the Abstract API response
        if (isset($data['quality_score'])) {
            $qualityScore = $data['quality_score'];
            // Define a threshold for what you consider a valid email
            $validThreshold = 0.7; // Adjust this threshold as needed

            return $qualityScore >= $validThreshold;
        }

        // If no quality score is found, return false
        return false;

    } catch (\Exception $e) {
        // Log and handle any other errors
        \Log::error('Abstract API request failed: ' . $e->getMessage());
     //   return response()->json(['error' => 'Failed to validate email. Please try again later.'], 500);
        return $this->sendError ('Failed to validate email. Please try again later.',[],400);

    }
}

}