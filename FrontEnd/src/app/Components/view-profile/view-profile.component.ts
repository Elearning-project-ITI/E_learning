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
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.css'
})
export class ViewProfileComponent {
  profileData: any = null; // Store the profile data
  decodedData: any= null; // Store decoded JWT data
  profileImage: any | null = null; // Store the profile image URL

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.profileData = response;

        if (this.profileData?.data) {
          this.decodeProfileData(this.profileData.data);
        }
        this.setProfileImage(); // Set the profile image based on the data
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      }
    });
  }

  decodeProfileData(token: string): void {
    try {
      this.decodedData = jwtDecode(token);
      console.log('Decoded Profile Data:', this.decodedData);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }

  setProfileImage(): void {
    this.profileImage = this.decodedData[0]?.profile_image || 'images/default-profile.jpg'; // Default image if none available
  }
}
