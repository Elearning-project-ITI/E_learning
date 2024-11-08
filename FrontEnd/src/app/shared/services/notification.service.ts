  import { Injectable ,forwardRef, Inject } from '@angular/core';
  import { environment } from '../../environments/environment';
  import Echo from 'laravel-echo';  // Import Echo correctly
  import Pusher from 'pusher-js';   // Import Pusher correctly
  import { SnackbarService } from './snackbar.service';
  import { HttpClient,HttpHeaders } from '@angular/common/http';
  import { AuthService } from './auth.service'; // Import your AuthService
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';

//import { HeaderComponent } from '../../Components/header/header.component'; // Adjust the path as necessary
//import { BehaviorSubject } from 'rxjs';

  @Injectable({
    providedIn: 'root',
  })
  export class PusherService {
    
    private fetchUnreadNotificationsSubject = new BehaviorSubject<void>(undefined);
    fetchUnreadNotifications$ = this.fetchUnreadNotificationsSubject.asObservable();
  
    triggerFetchUnreadNotifications() {
      this.fetchUnreadNotificationsSubject.next();
    }
    private pusher: Pusher | null = null;
    private echo: Echo | null = null;
    private baseURL = environment.apiUrl;

    constructor(private snackbarService: SnackbarService, private _HttpClient: HttpClient,
       private toastr: ToastrService, 

    ) {
      this.initializePusher();
      
    }
    initializePusher(){ const token = localStorage.getItem('access_token');  // Get token from localStorage
    //  console.log('Token:', token);

      if (token) {
        // this.pusher = new Pusher('35a4e7c2c07082b5318d', {
        //   cluster: 'eu',
        // });

        // this.echo = new Echo({
        //   broadcaster: 'pusher',
        //   key: '35a4e7c2c07082b5318d',
        //   cluster: 'eu',
        //   authEndpoint: 'http://0.0.0.0:8000/api/broadcasting/auth', // Replace with your backend URL
        //   auth: {
        //     headers: {
        //       'Authorization': `Bearer ${token}`,  // Set Bearer token dynamically
        //       'Accept': 'application/vnd.api+json' 
        //     }
        //   },
        // });
        this.pusher = new Pusher('35a4e7c2c07082b5318d', {
          cluster: 'eu',
          authEndpoint: `http://0.0.0.0:8000/api/broadcasting/auth`,
          auth: {
              headers: {
                  'Authorization': `Bearer ${token}`,  // Set Bearer token dynamically
                  'Accept': 'application/vnd.api+json' 
              }
          }
      });
        // Subscribe to admin and user channels
        this.subscribeToChannels(this.pusher);
      }}
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
            this.toastr.success(data.message)
            this.triggerFetchUnreadNotifications(); // Fetch unread notifications
        
            // this.snackbarService.showMessage(data.message);
          });

          adminchannel1.bind('CourseBookedEvent', (data: any) => {
            console.log(data);
            // this.toastr.success(data.message)
            // this.snackbarService.showMessage(data.adminMessage);
            this.toastr.success(data.adminMessage)
            this.triggerFetchUnreadNotifications(); // Fetch unread notifications
          
          });
          adminchannel1.bind('CourseAddedEvent', (data: any) => {
            console.log(data);
            // this.snackbarService.showMessage(data.adminMessage);
            this.toastr.success(data.adminMessage)
            this.triggerFetchUnreadNotifications(); // Fetch unread notifications
          
          });
        }
        else {
          // Fetch user name from AuthService (assumes your AuthService provides user info)
        
        
              // Replace token with user name for the channel subscription
              let outputString: string = response.name.split(' ').join('');
              const personalChannel = pusher.subscribe(`private-user-notifications.${outputString}`);
              const userChannel = pusher.subscribe('private-user-notifications');
              console.log(personalChannel);

              userChannel.bind('CourseAddedEvent', (data: any) => {
                console.log('Course added:', data);
                //this.snackbarService.showMessage(data.studentMessage);
                this.toastr.success(data.studentMessage)
                this.triggerFetchUnreadNotifications(); // Fetch unread notifications
              

              });
        
              personalChannel.bind('CourseBookedEvent', (data: any) => {
                console.log('Course booked:', data);
                //this.snackbarService.showMessage(data.studentMessage);
                this.toastr.success(data.studentMessage)
                this.triggerFetchUnreadNotifications(); // Fetch unread notifications
              

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
  getUserInfo(): Observable<{name: string; role: string }> {
    const token = localStorage.getItem('access_token');
  
    if (!token) {
      console.error('No access token found.');
      return throwError(() => new Error('No access token found.'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get<{name: string;role: string }>(`${this.baseURL}/user/name`, { headers });
  }
  disconnectPusher() {
    console.log("logout form pusher" + this.pusher)

    if (this.pusher) {
      console.log("logout form pusher")
      this.pusher.disconnect();
      this.pusher = null;
    }
  }
  }
