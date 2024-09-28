<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $table = 'material'; // Ensure this matches the table name in the database

    protected $fillable = [
        'url', 'type', 'course_id','file',
    ];

    // Relationships
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
