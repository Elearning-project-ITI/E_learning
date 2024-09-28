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
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userProfileImage: string = 'images/user.jpeg'; 
  userRole: string | null = null;
  private authSubscription!: Subscription;

  constructor(private _AuthService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this._AuthService.isAuthenticated$.subscribe(
      (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
        if (this.isLoggedIn) {
          this.userProfileImage = this._AuthService.getUserImage();
          this.userRole = this._AuthService.userRole; // Get the user role
        } else {
          this.userRole = null; // Reset user role when logged out
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  togglenotify(event: Event) {
    const notification = event.target as HTMLElement;
    if (notification.classList.contains('fa-regular')) {
      notification.classList.remove('fa-regular');
      notification.classList.add('fa-solid');
    } else {
      notification.classList.remove('fa-solid');
      notification.classList.add('fa-regular');
    }
  }

  logOutUser(): void {
    this._AuthService.logout();
    this.isLoggedIn = false;
    this.userProfileImage = 'images/user.jpeg'; // reset to default after logout
  }
}
