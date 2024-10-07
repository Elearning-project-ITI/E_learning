<?php

// app/Events/CourseAddedEvent.php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use App\Models\Course;
use App\Models\User;

class CourseAddedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $adminMessage;
    public $studentMessage;
    public $course;

    public function __construct(Course $course, User $admin)
    {
        // Custom messages for admin and student
        $this->adminMessage = "You have added the course '{$course->name}'";
        $this->studentMessage = "Admin added a new course '{$course->name}'";
        $this->course = $course;
    }

      public function broadcastOn()
    {
        return [
            new PrivateChannel('user-notifications'), // For students
            new PrivateChannel('admin-notifications'), // For admin
        ];
    }

    public function broadcastAs()
    {
        return 'CourseAddedEvent';
    }
}
