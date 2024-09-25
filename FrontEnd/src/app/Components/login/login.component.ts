import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './../../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  msgError: string = '';
  isLoading: boolean = false;

  constructor(private _AuthService: AuthService, private _Router: Router) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
  });

  handleForm() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('email', this.loginForm.get('email')?.value);
      formData.append('password', this.loginForm.get('password')?.value);

      this._AuthService.setLogin(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response.success) {
            this.isLoading = false;

            // Save the raw token in localStorage
            localStorage.setItem('eToken', response.data);

            // Call saveUserData() to decode and store the access_token
            this._AuthService.saveUserData();

            // Navigate to home page
            this._Router.navigate(['/home']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.msgError = err.error.message;
          console.log(err.error.message);
        }
      });
    }
  }
}
