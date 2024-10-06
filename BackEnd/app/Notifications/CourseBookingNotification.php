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
    protected $session;

    public function __construct($course, $user, $session = null)
    {
        $this->course = $course;
        $this->user = $user;
        $this->session = $session;
    }

    public function via($notifiable): array
    {
        return $this->session ? ['database', 'mail'] : ['database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->greeting("Hello, {$this->user->name}!")
            ->line("You have successfully booked the course: {$this->session->line_items->data[0]->description}")
            ->line("Amount Paid: $" . number_format($this->session->amount_total / 100, 2))
            ->action('View Invoice', $this->session->invoice_url)
            ->line('Thank you for booking with us!');
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => "The course '{$this->course->name}' has been booked by '{$this->user->name}'.",
        ];
    }
}
