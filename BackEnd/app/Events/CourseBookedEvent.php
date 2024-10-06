<?php 
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class CourseBookedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $adminMessage;
    public $studentMessage;
    public $course;

    public function __construct(User $user, Course $course,$token)
    {
        $this->adminMessage = "Student {$user->name} booked the course '{$course->name}'";
        $this->studentMessage = "You have successfully booked the course '{$course->name}' and invoice sent to your mail";
        $this->course = $course;
    }

    public function broadcastOn()
    {
        return [
        new PrivateChannel('user-notifications.{$this->token}'), // For students
        new PrivateChannel('admin-notifications'),
        ];
    }

    public function broadcastAs()
    {
        return 'CourseBookedEvent';
    }
}
