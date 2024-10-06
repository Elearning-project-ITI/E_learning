<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewUserRegistered implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }
    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {  
        
            return new PrivateChannel('admin-notifications'); // Channel to broadcast on

        
    }
    public function broadcastAs()
    {
        return 'NewUserRegistered'; // Event name to listen for
    }
    public function broadcastWith()
    {
        return [
            'message' => "A new user '{$this->user->name}' has registered.",
        ];
    }
}
