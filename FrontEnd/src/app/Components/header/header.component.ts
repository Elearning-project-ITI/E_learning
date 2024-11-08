// import { Component } from '@angular/core';
// import { RouterLinkActive, RouterModule } from '@angular/router';
// import { AuthService } from '../../shared/services/auth.service';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [RouterModule],
//   templateUrl: './header.component.html',
//   styleUrl: './header.component.css'
// })
// export class HeaderComponent {
//   constructor(private _AuthService: AuthService) {}
//   togglenotify(event: Event) {
//     const notifiaction = event.target as HTMLElement;
//     if (notifiaction.classList.contains('fa-regular')) {
//       notifiaction.classList.remove('fa-regular');
//       notifiaction.classList.add('fa-solid');
//     } else {
//       notifiaction.classList.remove('fa-solid');
//       notifiaction.classList.add('fa-regular');
//     }
//   }
 
//   logOutUser():void{
//  this._AuthService.logout();
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { AuthService } from '../../shared/services/auth.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [RouterModule,CommonModule],
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.css']
// })
// export class HeaderComponent implements OnInit {
//   isLoggedIn: boolean = false; // to track the login status
//   userProfileImage: string = 'images/registeration.jpg'; // default user image

//   constructor(private _AuthService: AuthService) {}

//   ngOnInit(): void {
//     this.checkUserStatus();
//   }

//   checkUserStatus(): void {
//     const token = localStorage.getItem('access_token'); // check if token exists
//     this.isLoggedIn = !!token; // set isLoggedIn to true if the token exists
//   }

//   togglenotify(event: Event) {
//     const notification = event.target as HTMLElement;
//     if (notification.classList.contains('fa-regular')) {
//       notification.classList.remove('fa-regular');
//       notification.classList.add('fa-solid');
//     } else {
//       notification.classList.remove('fa-solid');
//       notification.classList.add('fa-regular');
//     }
//   }

//   logOutUser(): void {
//     this._AuthService.logout();
//     this.isLoggedIn = false; // update login status
//   }
// }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ProfileDataService } from '../../shared/services/profile-data.service';
import { jwtDecode } from 'jwt-decode';
import { LoaderComponent } from "../loader/loader.component";
import { PusherService } from '../../shared/services/notification.service'; // Import the new service

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, LoaderComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userProfileImage: string = 'images/user.jpeg'; 
  userRole: string | null = null;
  private authSubscription!: Subscription;
  private pusherSubscription!: Subscription;

  profileData: any = null;
  decodedData: any = null;
  unreadNotifications: { message: string }[] = [];
  allNotifications: { message: string }[] = [];
  showNotifications: boolean = false;
  displayUnread: boolean = true;
  successMessage: string = '';  
  errorMessage: string = '';   
  constructor(     private pusherService: PusherService // Inject the new service
,    private _AuthService: AuthService, private profileDataService: ProfileDataService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this._AuthService.isAuthenticated$.subscribe(
      (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
        if (this.isLoggedIn) {
          this._AuthService.getProfile().subscribe({
            next: (response) => {
              this.profileData = response;
              if (this.profileData?.data) {
                this.decodeProfileData(this.profileData.data);
                this.fetchAllNotifications();
                this.fetchUnreadNotifications();
                // this.router.navigate(['/']); // Navigate to root to refresh and update role-specific UI
              }
            },
            error: (err) => {
              console.error('Error fetching profile:', err);
            },
          });
        }
      }
    );
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { updatedProfileData: any };
  
    if (state && state.updatedProfileData) {
      // If there's updated profile data passed from the EditProfileComponent, use it
      this.profileData = state.updatedProfileData;
      this.profileDataService.setProfileData(this.profileData); // Optionally store it in service
    } else {
      // If no data is passed, fetch it from the API
      this._AuthService.getProfile().subscribe({
        next: (response) => {
          this.profileData = response;
  
          if (this.profileData?.data) {
            this.decodeProfileData(this.profileData.data);
            this.fetchUnreadNotifications();
          }
        },
        error: (err) => {
          console.error('Error fetching profile:', err);
        },
      });
    }
    this.pusherSubscription = this.pusherService.fetchUnreadNotifications$.subscribe(() => {
      this.fetchUnreadNotifications();
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.pusherSubscription) {
      this.pusherSubscription.unsubscribe();
    }
  }

  // togglenotify(event: Event) {
  //   const notification = event.target as HTMLElement;
  //   if (notification.classList.contains('fa-regular')) {
  //     notification.classList.remove('fa-regular');
  //     notification.classList.add('fa-solid');
  //   } else {
  //     notification.classList.remove('fa-solid');
  //     notification.classList.add('fa-regular');
  //   }
  // }
  fetchUnreadNotifications(): void {
    this._AuthService.getUnreadNotifications().subscribe({
      next: (notifications) => {
        console.log(notifications)
        this.unreadNotifications = notifications; // Store notifications
        console.log('Unread notifications:', this.unreadNotifications);
      },
      error: (err) => {
        console.error('Error fetching unread notifications:', err);
      }
    });
  }
  fetchAllNotifications(): void {
    this._AuthService.viewAllNotifications().subscribe({
      next: (notifications) => {
        this.allNotifications = notifications;
      },
      error: (err) => {
        console.error('Error fetching all notifications:', err);
      }
    });
  }
  markAllAsRead(): void {
    this._AuthService.markAllNotificationsAsRead().subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.unreadNotifications = [];  // Clear unread notifications
        this.fetchAllNotifications();   // Refresh all notifications
      },
      error: (err) => {
        console.error('Error marking notifications as read:', err);
        this.errorMessage = 'Failed to mark notifications as read';
      }
    });
  }


  logOutUser(): void {
    this.pusherService.disconnectPusher();
    this._AuthService.logout();
    this.isLoggedIn = false;
     // Disconnect Pusher on logout

    this.router.navigate(['/login']);
    // this.userProfileImage = 'images/user.jpeg'; // reset to default after logout
  }
  decodeProfileData(token: string): void {
    try {
      this.decodedData = jwtDecode(token);
      console.log('Decoded Profile Data:', this.decodedData);
      this.profileDataService.setProfileData(this.decodedData[0]);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
  togglenotify(event: Event): void {
    event.preventDefault();
    this.showNotifications = !this.showNotifications;
  }


  // Show unread notifications
  showUnreadNotifications(): void {
    this.displayUnread = true;
  }

  // Show all notifications
  showAllNotifications(): void {
    this.displayUnread = false;
  }
}