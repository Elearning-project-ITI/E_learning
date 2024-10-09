import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unreadnotification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unreadnotification.component.html',
  styleUrl: './unreadnotification.component.css'
})
export class UnreadnotificationComponent implements OnInit {
  unreadNotifications: { message: string }[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUnreadNotifications();
  }

  // Fetch all unread notifications
  fetchUnreadNotifications(): void {
    this.authService.getUnreadNotifications().subscribe({
      next: (notifications) => {
        this.unreadNotifications = notifications;
      },
      error: (err) => {
        console.error('Error fetching unread notifications:', err);
        this.errorMessage = 'Failed to load unread notifications';
      }
    });
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.authService.markAllNotificationsAsRead().subscribe({
      next: (response) => {
        this.successMessage = response.message;
        // Clear the unread notifications list after marking all as read
        this.unreadNotifications = [];
      },
      error: (err) => {
        console.error('Error marking notifications as read:', err);
        this.errorMessage = 'Failed to mark notifications as read';
      }
    });
  }
}
