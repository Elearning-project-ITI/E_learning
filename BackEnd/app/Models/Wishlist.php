<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Model;
class Wishlist extends Model
{
    // Specify the table name if it doesn't follow Laravel's naming convention
    protected $table = 'wishlist';

    // Define which fields are mass assignable
    protected $fillable = [
        'user_id',
        'course_id',
    ];

    // Optionally enable timestamps (created_at, updated_at)
    public $timestamps = true;

    /**
     * Relationship to the User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship to the Course model.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // You can add any custom methods or logic here if needed
}
