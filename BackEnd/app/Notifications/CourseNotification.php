<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;

class CourseNotification extends Notification 
{
   // use Queueable;

    /**
     * Create a new notification instance.
     */

   protected $course;
    protected $action;

    public function __construct($course, $action)
    {
       
        $this->course = $course;
        $this->action = $action; // 'added' or 'edited'
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    // public function toMail(object $notifiable): MailMessage
    // {
    //     return (new MailMessage)
    //                 ->line('The introduction to the notification.')
    //                 ->action('Notification Action', url('/'))
    //                 ->line('Thank you for using our application!');
    // }
    // public function toDatabase(object $notifiable)
    // {
    //     dd(11);
    //     $message = "A course '{$this->course->name}' was {$this->action} by the admin.";

    //     return [
    //         'message' => $message,
    //     ];
    // }

    // public function toBroadcast($notifiable)
    // {
    //     return new BroadcastMessage([
    //         'message' => "A course '{$this->course->name}' was {$this->action} by the admin.",
    //         'course_id' => $this->course->id,
    //     ]);
    // }
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
       // dd(11);

        $message = "A course '{$this->course->name}' was {$this->action} by the admin.";

         return [
             'message' => $message,
         ];
    }
}
