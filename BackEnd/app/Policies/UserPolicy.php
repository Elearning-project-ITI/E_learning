<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    public function update(User $user, User $model)
    {
        // Allow users to update their own profile
        return $user->id === $model->id;
    }

    public function isAdmin(User $user)
    {
        // Admin check logic (e.g., check role or isAdmin flag)
        return $user->role === 'admin';
    }
}
