import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-allnotification',
  standalone: true,
  imports: [LoaderComponent,CommonModule],
  templateUrl: './allnotification.component.html',
  styleUrl: './allnotification.component.css'
})
export class AllnotificationComponent implements OnInit, OnDestroy {
  notifications: { message: string }[] = [];
  private notificationsSubscription!: Subscription;
  loading: boolean = false;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchAllNotifications();
  }

  fetchAllNotifications(): void {
    this.loading = true;
    this.notificationsSubscription = this.authService.viewAllNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching notifications', err);
        this.error = 'Failed to load notifications.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }
}