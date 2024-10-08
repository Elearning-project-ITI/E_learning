
 
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { jwtDecode } from 'jwt-decode';
// import { Observable } from 'rxjs';

// interface userAuth {
//   user: any;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   userData: any;
//   userToken: any;

  
//   private baseURL = 'http://0.0.0.0:8000/api';

//   constructor(private _HttpClient: HttpClient, private _Router: Router) {}

//   saveUserData() {
//     const token = localStorage.getItem('eToken');
//     if (token != null) {
//       const decodedToken: any = jwtDecode(token);
//       console.log('Decoded Token:', decodedToken);
//       this.userData = decodedToken;
//       const accessToken = decodedToken?.access_token;

//       if (accessToken) {
//         this.userToken = accessToken;
//         localStorage.setItem('access_token', this.userToken);
//         console.log('Access Token Saved:', this.userToken);
//       } else {
//         console.error('Access token not found in decoded JWT');
//       }
//     }
//   }

//   setRegister(userData: FormData): Observable<any> {
//     return this._HttpClient.post(`${this.baseURL}/register`, userData);
//   }

//   setLogin(userData: FormData): Observable<any> {
//     return this._HttpClient.post(`${this.baseURL}/login`, userData);
//   }

//   setforget(userData: FormData): Observable<any> {
//     return this._HttpClient.post(`${this.baseURL}/forgot-password`, userData);
//   }

//   setreset(userData: FormData): Observable<any> {
//     return this._HttpClient.post(`${this.baseURL}/reset-password`, userData);
//   }

//   logout(): void {
//     const token = localStorage.getItem('access_token');

//     if (!token) {
//       console.error('No access token found.');
//       return;
//     }

//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     this._HttpClient.post(`${this.baseURL}/logout`, {}, { headers }).subscribe({
//       next: (response) => {
//         console.log('Logout successful:', response);
//         localStorage.removeItem('eToken');
//         localStorage.removeItem('access_token');
//         this._Router.navigate(['/login']);
//       },
//       error: (err) => {
//         console.error('Logout failed:', err);
//       },
//     });
//   }
// }
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { SnackbarService } from './snackbar.service';
import { ToastrService } from 'ngx-toastr';

interface userAuth {
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  userToken: any;
  username:any;
  userRole: string | null = null;
  userimage:any;
  private pusher: Pusher | null = null;
  private echo: Echo | null = null;
  private baseURL = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  // private profileDataSubject = new BehaviorSubject<any>(null);
  // profileData$ = this.profileDataSubject.asObservable();
  constructor(private _HttpClient: HttpClient, private _Router: Router,private snackbarService: SnackbarService, private http: HttpClient , private toastr: ToastrService) {}

  saveUserData() {
    const token = localStorage.getItem('eToken');
    if (token != null) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
  
        // Assuming user is an object, not an array
        this.userData = decodedToken;
        const accessToken = decodedToken?.access_token;
        const  username=decodedToken?.user.name
        const myRole = decodedToken?.user.role; // Corrected to access role from user object
        const myimage=decodedToken?.user.image;
        if (accessToken) {
          this.userToken = accessToken;
          this.userRole = myRole; // Save user role
          this.userimage=myimage;
          console.log("user image",this.userimage)
          console.log('User Role:', this.userRole);
          localStorage.setItem('access_token', this.userToken);
          console.log('Access Token Saved:', this.userToken);
          localStorage.removeItem('eToken');
          this.isAuthenticatedSubject.next(true); // Emit true when token is saved
          var pusher = new Pusher('35a4e7c2c07082b5318d', {
            cluster: 'eu',
            authEndpoint: `http://0.0.0.0:8000/api/broadcasting/auth`,
            auth: {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,  // Set Bearer token dynamically
                    'Accept': 'application/vnd.api+json' 
                }
            }
        });
          // Subscribe to admin and user channels
          this.subscribeToChannels(pusher);
        } else {
          console.error('Access token not found in decoded JWT');
        }
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }
  }
  subscribeToChannels(pusher: Pusher) {
    this.getUserInfo().subscribe({
      next: (response) => {
        const userName = response.name;
        const userRole = response.role;
       console.log(userName);
      // Subscribe to the admin notifications channel only if the user is an admin
      if (userRole === 'admin') {

        const adminchannel1 = pusher.subscribe('private-admin-notifications');
          
        adminchannel1.bind('NewUserRegistered', (data: { message: string }) => {
          console.log(data);
          this.snackbarService.showMessage(data.message);
          // this.toastr.success(data.message)
        });

        adminchannel1.bind('CourseBookedEvent', (data: any) => {
          console.log(data);
          this.snackbarService.showMessage(data.adminMessage);
          // this.toastr.success(data.message)
        });
        adminchannel1.bind('CourseAddedEvent', (data: any) => {
          console.log("ifthjitrir "+data);
          this.snackbarService.showMessage(data.adminMessage);
          // this.toastr.success(data.message)
        });
      }
      else {
        // Fetch user name from AuthService (assumes your AuthService provides user info)
      
      
            // Replace token with user name for the channel subscription
            const personalChannel = pusher.subscribe(`private-user-notifications.${response.name}`);
            const userChannel = pusher.subscribe('private-user-notifications');
            console.log(personalChannel);

            userChannel.bind('CourseAddedEvent', (data: any) => {
              console.log('Course added:', data);
              this.snackbarService.showMessage(data.studentMessage);
            });
      
            personalChannel.bind('CourseBookedEvent', (data: any) => {
              console.log('Course booked:', data);
              this.snackbarService.showMessage(data.studentMessage);
            });
        
         
      }
    },
      error: (err) => {
        console.error('Error:', err);
      },
    });
    
    // const adminchannel1 = pusher.subscribe('private-admin-notifications');

    //   adminchannel1.bind('NewUserRegistered', (data: { message: string }) => {
    //       console.log(data);
    //       this.snackbarService.showMessage(data.message);
    //   });
    // Subscribe to admin notifications (only admins can listen)
  //   if(this.echo){
  //     console.log("Subscribing to channels...");
  //   this.echo.private('admin-notifications')
  //     .listen('NewUserRegistered', (e) => {
  //       console.log("New user registered:", e);
  //       this.snackbarService.showMessage(e.message);
  //     });
  // }
}
  getUserImage(): string {
    if (this.userimage) {
      const imageUrlParts = this.userimage.split('/storage/');
      return imageUrlParts.length > 1 ? imageUrlParts[1] : this.userimage;
    }
    return 'images/user.jpeg'; 
  }
  

  setRegister(userData: FormData): Observable<any> {
    return this._HttpClient.post(`${this.baseURL}/register`, userData);
  }

  setLogin(userData: FormData): Observable<any> {
    return this._HttpClient.post(`${this.baseURL}/login`, userData);
  }

  setforget(userData: FormData): Observable<any> {
    return this._HttpClient.post(`${this.baseURL}/forgot-password`, userData);
  }

  setreset(userData: FormData): Observable<any> {
    return this._HttpClient.post(`${this.baseURL}/reset-password`, userData);
  }

  logout(): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No access token found.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this._HttpClient.post(`${this.baseURL}/logout`, {}, { headers }).subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        // localStorage.removeItem('eToken');
        localStorage.removeItem('access_token');
        localStorage.removeItem('pusherTransportTLS');
        this.userRole = null;
        this.isAuthenticatedSubject.next(false); // Emit false on logout
        this._Router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }

  // private checkToken(): boolean {
  //   return !!localStorage.getItem('access_token');
  // }
  getProfile(): Observable<any> {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.error('No access token found.');
    
      return throwError(() => new Error('No access token found.'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/profile`, { headers });
  }

  private checkToken(): boolean {
    return !!localStorage.getItem('access_token');
  }
  updateProfile(userData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError(() => new Error('No access token found.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    
    userData.append('_method', 'PUT');

    return this._HttpClient.post(`${this.baseURL}/profile`, userData, { headers });
  }
  getUserInfo(): Observable<{name: string; role: string }> {
    const token = localStorage.getItem('access_token');
  
    if (!token) {
      console.error('No access token found.');
      return throwError(() => new Error('No access token found.'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get<{name: string;role: string }>(`${this.baseURL}/user/name`, { headers });
  }
  getUnreadNotifications(): Observable<{ message: string }[]> {
    const token = localStorage.getItem('access_token');
  
    if (!token) {
      console.error('No access token found.');
      return throwError(() => new Error('No access token found.'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get<{ status: string, unread_notifications: { message: string }[] }>(
      `${this.baseURL}/notifications/unread`, 
      { headers }
    ).pipe(map(response => {
        if (response.status === 'success') {
          return response.unread_notifications;
        } else {
          console.error('Failed to fetch unread notifications.');
          return [];
        }
      }),
      catchError(err => {
        console.error('Error fetching unread notifications', err);
        return throwError(() => new Error('Error fetching unread notifications'));
      })
    );
  }
  viewAllNotifications(): Observable<{ message: string }[]> {
    const token = localStorage.getItem('access_token');
  
    if (!token) {
      console.error('No access token found.');
      return throwError(() => new Error('No access token found.'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get<{ status: string, notifications: { message: string }[] }>(
      `${this.baseURL}/notifications`, 
      { headers }
    ).pipe(
      map(response => {
        if (response.status === 'success') {
          return response.notifications;
        } else {
          console.error('Failed to fetch notifications.');
          return [];
        }
      }),
      catchError(err => {
        console.error('Error fetching notifications', err);
        return throwError(() => new Error('Error fetching notifications'));
      })
    );
  }
    
  
}

