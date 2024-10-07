<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
           // Fetch all students (assuming role 'student' exists in your User model or use another method to filter students)
    $students = User::where('role', 'student')->get(['id', 'name']);

    // Return view or JSON response with student data
    return $this->sendResponse($students, 'List of students.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request)
    {
        // Validate the request fields
        
        // dd($request->input('password'), $request->input('password_confirmation'));
        $user = $request->user();

        // Check if authenticated user can update the profile (or if admin is making the request)

        // Only update the fields that have changed
        $input = $request->only(['name', 'email', 'phone', 'password', 'image']);
 
        if ($request->has('password')) {
            $input['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($user->image && Storage::exists($user->image)) {
                Storage::delete($user->image);
            }

            // Save new image
            $input['image'] = $request->file('image')->store('user_images', 'uploads');
            $input['image']= asset('uploads/'.$input['image']);
        }

        // Only update the changed fields
        $user->fill($input)->save();

        // Send success response
        return $this->sendResponse([$user], 'Profile updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function showProfile(Request $request)
    {
        $user = $request->user();

        return $this->sendResponse([$user], 'Profile retrieved successfully.');// Return user profile as JSON or render a view
    }
    public function showStudentProfile($id)
    {
        // dd(111);
        // Find the user by ID
        $student = User::find($id);
        if (!$student) {
            return $this->sendError('Profile not found.', [], 404);
        }

        // Fetch courses with paid bookings for the student
    
        // Return the student's profile and their paid courses
        return $this->sendResponse([
            'profile' => $student,
            'courses' =>  $student->bookings()->where('is_payed', true)->with('course')->get()->pluck('course'),
        ], 'Student profile and paid courses retrieved successfully.');
    }
    public function getRole()
    {
        $user = Auth::user();
        return response()->json(['role' => $user->role]);
    }
}
