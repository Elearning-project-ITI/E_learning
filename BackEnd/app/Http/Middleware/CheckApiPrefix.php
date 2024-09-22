<?php

namespace App\Http\Middleware;
use App\Http\Controllers\Api\BaseController;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApiPrefix extends BaseController
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (strpos($request->getRequestUri(), '/api') !== 0) {
            
            return $this->sendError('Route not found. Please check the URL and try again .', [], 404);        

        }
        return $next($request);
    }
}
