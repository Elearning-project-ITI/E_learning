<?php 
namespace App\Events;
use App\Models\Course; 
use App\Models\User;
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
    public $user;
    public function __construct( $user, $course)
    {
        $this->adminMessage = "Student {$user->name} booked the course '{$course->name}'";
        $this->studentMessage = "You have successfully booked the course '{$course->name}' and invoice sent to your mail";
        $this->course = $course;
        $this->user = $user;

    }

    public function broadcastOn()
    {      $userNameWithoutSpaces = str_replace(' ', '', $this->user->name);

        return [
        new PrivateChannel("user-notifications.{$userNameWithoutSpaces}"), // For students
        new PrivateChannel('admin-notifications'),
        ];
    }

    public function broadcastAs()
    {
        return 'CourseBookedEvent';
    }
}
