
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ProfileDataService } from '../../shared/services/profile-data.service'; 

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  isLoading = false;
  msgSuccess = '';
  msgErrors: string[] = [];
  profileData: any = null; 
  currentProfileImage: string | null = null; 

  editProfileForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{10,15}$')]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    image: new FormControl(null)
  });

  constructor(
    private _AuthService: AuthService, 
    private _Router: Router, 
    private profileDataService: ProfileDataService 
  ) {}

  ngOnInit(): void {
    this.profileData = this.profileDataService.getProfileData();

    if (this.profileData) {
      this.editProfileForm.patchValue({
        name: this.profileData.name,
        email: this.profileData.email,
        phone: this.profileData.phone,
      });
      this.currentProfileImage = this.profileData.image; 
    }
  }

  updateProfile() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('name', this.editProfileForm.get('name')?.value);
    formData.append('email', this.editProfileForm.get('email')?.value);
    formData.append('phone', this.editProfileForm.get('phone')?.value);
    formData.append('password', this.editProfileForm.get('password')?.value);
    formData.append('password_confirmation', this.editProfileForm.get('password_confirmation')?.value);
    if (this.editProfileForm.get('image')?.value) {
      formData.append('image', this.editProfileForm.get('image')?.value);
    }

    this._AuthService.updateProfile(formData).subscribe({
      next: (response) => {
        console.log(response);
        this.msgSuccess = 'Profile updated successfully!';
        this.isLoading = false;

        
        this.profileDataService.setProfileData({
          name: this.editProfileForm.get('name')?.value,
          email: this.editProfileForm.get('email')?.value,
          phone: this.editProfileForm.get('phone')?.value,
          image: this.currentProfileImage
        });

        this._Router.navigate(['/profile']); 
      },
      error: (err: HttpErrorResponse) => {
        this.msgErrors = err.error.message || ['An error occurred. Please try again later.'];
        this.isLoading = false;
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editProfileForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentProfileImage = e.target.result; 
      };
      reader.readAsDataURL(file);
    }
  }
}