  import { Injectable } from '@angular/core';
  import Echo from 'laravel-echo';  // Import Echo correctly
  import Pusher from 'pusher-js';   // Import Pusher correctly
  import { SnackbarService } from './snackbar.service';
  import { HttpClient } from '@angular/common/http';
  import { AuthService } from './auth.service'; // Import your AuthService

  @Injectable({
    providedIn: 'root',
  })
  export class PusherService {
    private pusher: Pusher | null = null;
    private echo: Echo | null = null;

    constructor(private snackbarService: SnackbarService, private http: HttpClient,
      private authService: AuthService // Inject AuthService

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
      this.authService.getUserRole().subscribe({
        next: (response) => {
          const userRole = response.role;

        // Subscribe to the admin notifications channel only if the user is an admin
        if (userRole === 'admin') {

          const adminchannel1 = pusher.subscribe('private-admin-notifications');

          adminchannel1.bind('NewUserRegistered', (data: { message: string }) => {
            console.log(data);
            this.snackbarService.showMessage(data.message);
          });

          adminchannel1.bind('CourseBookedEvent', (data: any) => {
            console.log(data);
            this.snackbarService.showMessage(data.adminMessage);
          });
          adminchannel1.bind('CourseAddedEvent', (data: any) => {
            console.log(data);
            this.snackbarService.showMessage(data.adminMessage);
          });
        }
        else{       
          const token = localStorage.getItem('access_token');
          const userChannel = pusher.subscribe('private-user-notifications');
          console.log(111)
          const personalChannel = pusher.subscribe(`private-user-notifications.${token}`);
      
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
  }
