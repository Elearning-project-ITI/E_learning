<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApiPrefix
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (strpos($request->getRequestUri(), '/api') !== 0) {
            return response()->json([
                'message' => 'Route not found. Please check the URL and try again'
            ], 404);
        }
        return $next($request);
    }
}
