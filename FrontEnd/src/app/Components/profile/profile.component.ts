import { Component } from '@angular/core';
import { Router, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { ProfileDataService } from '../../shared/services/profile-data.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet, RouterModule, RouterLinkActive, CommonModule, LoaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileData: any = null;
  decodedData: any = null;
 
  constructor(private authService: AuthService, private profileDataService: ProfileDataService, private router: Router) {} // Inject the service

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { updatedProfileData: any };
  
    if (state && state.updatedProfileData) {
      // If there's updated profile data passed from the EditProfileComponent, use it
      this.profileData = state.updatedProfileData;
      this.profileDataService.setProfileData(this.profileData); // Optionally store it in service
    } else {
      // If no data is passed, fetch it from the API
      this.authService.getProfile().subscribe({
        next: (response) => {
          this.profileData = response;
  
          if (this.profileData?.data) {
            this.decodeProfileData(this.profileData.data);
          }
        },
        error: (err) => {
          console.error('Error fetching profile:', err);
        },
      });
    }
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
}