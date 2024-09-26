<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    /**
     * Create a new message instance.
     *
     * @param \App\Models\User $user
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verify Email',
        );
    }

    /**
     * Get the message content definition.
     */
    // public function content(): Content
    // {
    //     return new Content(
    //         view: 'view.name',
    //     );
    // }
    public function build()
    {
        $verificationLink = url(config('app.frontend_url').'/verify-email?token=' . $this->user->email_verification_token);

        return $this->subject('Verify Your Email Address')
        ->html('
                    <!DOCTYPE html>
<html>
<head>
    <title>Verify Your Email</title>
</head>
<body>
    <p>Hello '. $this->user->name.' </p>
    <p>Thank you for registering! Please click the link below to verify your email address:</p>
    <a href="' . $verificationLink . '">Verify Email</a>
    <p>This link will expire in 1 hour.</p>
</body>
</html>
')
;
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
