// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { AuthService } from '../../shared/services/auth.service';
// import { jwtDecode } from 'jwt-decode';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-view-profile',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './view-profile.component.html',
//   styleUrl: './view-profile.component.css'
// })
// export class ViewProfileComponent {
//   profileData: any = null; 
//   decodedData: any= null; 
//   profileImage: any | null = null; 

//   constructor(private authService: AuthService) {}

//   ngOnInit(): void {
//     this.authService.getProfile().subscribe({
//       next: (response) => {
//         console.log('Response:', response);
//         this.profileData = response;

//         if (this.profileData?.data) {
//           this.decodeProfileData(this.profileData.data);
//         }
//         this.setProfileImage(); 
//       },
//       error: (err) => {
//         console.error('Error fetching profile:', err);
//       }
//     });
//   }

//   decodeProfileData(token: string): any {
//     try {
//         this.decodedData = jwtDecode(token);
//         console.log('Decoded Profile Data:', this.decodedData);
//         return this.decodedData; // Ensure this returns the decoded data
//     } catch (error) {
//         console.error('Failed to decode token:', error);
//         return null; // Return null if there’s an error
//     }
// }

//   setProfileImage(): void {
//     this.profileImage = this.decodedData[0]?.profile_image || 'images/default-profile.jpg'; // Default image if none available
//   }
// }
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { ProfileDataService } from '../../shared/services/profile-data.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.css'
})
 export class ViewProfileComponent  implements OnInit {
    profileData: any = null;
  
    constructor(private profileDataService: ProfileDataService) {} // Inject the service
  
    ngOnInit(): void {
      // Retrieve the profile data from the service
      this.profileData = this.profileDataService.getProfileData();
      console.log('Profile Data in view Component:', this.profileData);
    }
  }
//   profileData: any = null; // Store the profile data
//   decodedData: any= null; // Store decoded JWT data
//   profileImage: any | null = null; // Store the profile image URL

//   constructor(private authService: AuthService) {}

//   ngOnInit(): void {
//     this.authService.getProfile().subscribe({
//       next: (response) => {
//         console.log('Response:', response);
//         this.profileData = response;

//         if (this.profileData?.data) {
//           this.decodeProfileData(this.profileData.data);
//         }
//         this.setProfileImage(); // Set the profile image based on the data
//       },
//       error: (err) => {
//         console.error('Error fetching profile:', err);
//       }
//     });
//   }

//   decodeProfileData(token: string): void {
//     try {
//       this.decodedData = jwtDecode(token);
//       console.log('Decoded Profile Data:', this.decodedData);
//     } catch (error) {
//       console.error('Failed to decode token:', error);
//     }
//   }

//   setProfileImage(): void {
//     this.profileImage = this.decodedData[0]?.profile_image || 'images/default-profile.jpg'; // Default image if none available
//   }
// }
