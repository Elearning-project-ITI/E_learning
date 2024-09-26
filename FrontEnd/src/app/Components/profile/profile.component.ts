import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet,RouterModule,RouterLinkActive,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
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
