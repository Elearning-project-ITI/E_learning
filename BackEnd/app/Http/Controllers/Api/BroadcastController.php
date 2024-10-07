<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Pusher\Pusher;

class BroadcastController extends Controller
{
    protected $pusher;

    public function __construct()
    {
        // Manually create an instance of Pusher
        $this->pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'useTLS' => true,
            ]
        );
    }

    public function authenticate(Request $request)
    {
        // Log the request data for debugging purposes
        \Log::info('Authenticating request', $request->all());

        // Ensure the user is authenticated
        if (!Auth::user()) {
            throw new AccessDeniedHttpException('User is not authenticated.');
        }

        // Continue with the broadcasting authentication logic
        $user = Auth::user();
        $pusherAuth = $this->pusher->socket_auth(
            $request->input('channel_name'),
            $request->input('socket_id')
        );

        // Return relevant authentication info to the client
        return response($pusherAuth, 200);
    }
}