<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CourseBookingNotification extends Notification
{
    use Queueable;

    protected $course;
    protected $user;
    protected $invoice_url;

    public function __construct($course, $user, $invoice_url = null)
    {
        $this->course = $course;
        $this->user = $user;
        $this->invoice_url = $invoice_url;
    }

    public function via($notifiable): array
    {
        return $this->invoice_url !== null ? ['database', 'mail'] : ['database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->greeting("Hello, {$this->user->name}!")
            ->line("You have successfully booked the course: {$this->course->name}")
            ->action('View Invoice', $this->invoice_url)
            ->line('Thank you for booking with us!');
    }

    public function toArray($notifiable): array
    {
        if ($notifiable->role === 'admin') {
            return [
                'message' => "The course '{$this->course->name}' has been booked by '{$this->user->name}'.",
            ];
        }

        return [
            'message' => "You have successfully booked the course '{$this->course->name}' and the invoice has been sent to your email.",
        ];
    }
}
