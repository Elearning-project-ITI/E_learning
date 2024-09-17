<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Choice extends Model
{
    use HasFactory;

    protected $fillable = [
        'choice', 'is_correct', 'question_id',
    ];

    // Relationships
    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}