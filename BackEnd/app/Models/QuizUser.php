<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class QuizUser extends Pivot
{
    // Specify the table name if it doesn't follow Laravel's naming convention
    protected $table = 'quiz_user';

    // Define which fields are mass assignable
    protected $fillable = [
        'user_id',
        'quiz_id',
        'final_result',
    ];

    // Optionally, disable timestamps if not needed
    public $timestamps = true;

    /**
     * Relationship to the User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship to the Quiz model.
     */
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    // You can also define additional methods if needed
}
