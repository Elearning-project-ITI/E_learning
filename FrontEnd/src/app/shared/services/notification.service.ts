  import { Injectable } from '@angular/core';
  import Echo from 'laravel-echo';  // Import Echo correctly
  import Pusher from 'pusher-js';   // Import Pusher correctly
  import { SnackbarService } from './snackbar.service';
  import { HttpClient } from '@angular/common/http';
  import { AuthService } from './auth.service'; // Import your AuthService
import { ToastrService } from 'ngx-toastr';

  @Injectable({
    providedIn: 'root',
  })
  export class PusherService {
    private pusher: Pusher | null = null;
    private echo: Echo | null = null;

    constructor(private snackbarService: SnackbarService, private http: HttpClient,
      private authService: AuthService // Inject AuthService
      , private toastr: ToastrService
    ) {
      const token = localStorage.getItem('access_token');  // Get token from localStorage
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
        var pusher = new Pusher('35a4e7c2c07082b5318d', {
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
        this.subscribeToChannels(pusher);
      }
    }

    subscribeToChannels(pusher: Pusher) {
      this.authService.getUserInfo().subscribe({
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
            // this.snackbarService.showMessage(data.message);
          });

          adminchannel1.bind('CourseBookedEvent', (data: any) => {
            console.log(data);
            // this.toastr.success(data.message)
            // this.snackbarService.showMessage(data.adminMessage);
            this.toastr.success(data.adminMessage)
          });
          adminchannel1.bind('CourseAddedEvent', (data: any) => {
            console.log(data);
            // this.snackbarService.showMessage(data.adminMessage);
            this.toastr.success(data.adminMessage)
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
                //this.snackbarService.showMessage(data.studentMessage);
                this.toastr.success(data.studentMessage)

              });
        
              personalChannel.bind('CourseBookedEvent', (data: any) => {
                console.log('Course booked:', data);
                //this.snackbarService.showMessage(data.studentMessage);
                this.toastr.success(data.studentMessage)

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
  }
