<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'url', 'type',
    ];

    // Relationships
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_material');
    }
}