<?php

namespace App\Http\Middleware;
use App\Http\Controllers\Api\BaseController;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware extends BaseController
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the authenticated user is an admin
        if (auth()->check() && auth()->user()->role === 'admin') {
            return $next($request);
        }

        // If not admin, return unauthorized response
        return $this->sendError('you are not admin.', [], 403);        

    }
}
