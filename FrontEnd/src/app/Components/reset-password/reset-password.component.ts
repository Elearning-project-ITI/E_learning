// // import { AuthService } from './../../shared/services/auth.service';
// // import { Component, OnInit } from '@angular/core';
// // import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { CommonModule } from '@angular/common';
// // import { Router, RouterModule, ActivatedRoute } from '@angular/router';
// // import { HttpErrorResponse } from '@angular/common/http';

// // @Component({
// //   selector: 'app-reset-password',
// //   standalone: true,
// //   imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
// //   templateUrl: './reset-password.component.html',
// //   styleUrl: './reset-password.component.css'
// // })
// // export class ResetPasswordComponent implements OnInit {
// //   msgError: string = '';
// //   isLoading: boolean = false;
// //   email: string = '';
// //   token: string = '';

// //   resetpassword: FormGroup = new FormGroup({
// //     newpassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
// //     repassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
// //   });

// //   constructor(
// //     private _AuthService: AuthService,
// //     private _Router: Router,
// //     private _ActivatedRoute: ActivatedRoute
// //   ) {}

// //   ngOnInit(): void {
// //     // Extract email and token from the URL
// //     this._ActivatedRoute.queryParams.subscribe(params => {
// //       this.email = params['email'] || '';
// //       this.token = params['token'] || '';
// //     });
// //   }

// //   handleForm() {
// //     if (this.resetpassword.valid) {
// //       this.isLoading = true;
// //       const formData = new FormData();
// //       formData.append('newpassword', this.resetpassword.get('newpassword')?.value);
// //       formData.append('repassword', this.resetpassword.get('repassword')?.value);
// //       formData.append('email', this.email);
// //       formData.append('token', this.token);

// //       this._AuthService.setreset(formData).subscribe({
// //         next: (response) => {
// //           console.log(response);
// //           if (response.success) {
// //             this.isLoading = false;
// //             // Uncomment if redirection is needed
// //             // localStorage.setItem('eToken', response.access_token);
// //             // this._AuthService.saveUserData();
// //             // this._Router.navigate(['/home']);
// //           }
// //         },
// //         error: (err: HttpErrorResponse) => {
// //           this.isLoading = false;
// //           this.msgError = err.error.message;
// //           console.log(err.error.message);
// //         }
// //       });
// //     }
// //   }
// // }
// // reset-password.component.ts
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-reset-password',
//   standalone: true,
//   imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './reset-password.component.html',
//   styleUrls: ['./reset-password.component.css']
// })
// export class ResetPasswordComponent implements OnInit {
//   resetPasswordForm: FormGroup;
//   token: string | null = null;
//   email: string | null = null;
//   isLoading = false;
//   msgError: string | null = null;
//   msgsuccess:string='';
//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private router: Router
//   ) {
//     // Form initialization with validators
//     this.resetPasswordForm = this.fb.group({
//       newpassword: ['', [Validators.required, Validators.minLength(8)]],
//       repassword: ['', [Validators.required, Validators.minLength(8)]]
//     });
//   }

//   ngOnInit(): void {
//     // Capture token and email from query parameters
//     this.route.queryParams.subscribe(params => {
//       this.token = params['token'];
//       this.email = params['email'];
//     });
//   }

//   // Handle form submission
//   handleForm(): void {
//     if (this.resetPasswordForm.invalid || this.resetPasswordForm.value.newpassword !== this.resetPasswordForm.value.repassword) {
//       this.msgError = 'Passwords do not match or are invalid.';
//       return;
//     }

//     this.isLoading = true;
//     const payload = {
//       token: this.token,
//       email: this.email,
//       password: this.resetPasswordForm.value.newpassword,
//       password_confirmation: this.resetPasswordForm.value.repassword
//     };

//     // Send data to backend to reset the password
//     this.http.post('http://0.0.0.0:8000/api/reset-password', payload)
//       .subscribe({
//         next: (response) => {
//           console.log(response)
//             // this.msgsuccess=response.message;
//           // alert('Password reset successful!');
//           this.router.navigate(['/login']);
//           this.isLoading = false;
//         },
//         error: (err: HttpErrorResponse) => {
//           this.msgError = err.error.message || 'Failed to reset password. Please try again.';
//           console.error('Error:', err);
//           this.isLoading = false;
//         }
//       });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../shared/services/auth.service'; // Import AuthService

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = null;
  email: string | null = null;
  isLoading = false;
  msgError: string | null = null;
  msgsuccess: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _AuthService: AuthService // Correctly inject AuthService here
  ) {
    // Form initialization with validators
    this.resetPasswordForm = this.fb.group({
      newpassword: ['', [Validators.required, Validators.minLength(8)]],
      repassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    // Capture token and email from query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  // Handle form submission
  handleForm(): void {
    if (this.resetPasswordForm.invalid || this.resetPasswordForm.value.newpassword !== this.resetPasswordForm.value.repassword) {
      this.msgError = 'Passwords do not match or are invalid.';
      return;
    }
  
    this.isLoading = true;
    
    // Create a new FormData object
    const formData = new FormData();
    formData.append('token', this.token as string); // Ensure token is a string
    formData.append('email', this.email as string); // Ensure email is a string
    formData.append('password', this.resetPasswordForm.value.newpassword);
    formData.append('password_confirmation', this.resetPasswordForm.value.repassword);
  
    // Send data to backend to reset the password
    this._AuthService.setreset(formData).subscribe({
        next: (response: any) => {
          console.log(response);
            alert('Password reset successful!');
          // this.msgsuccess = response.message;
          // console.log(this.msgsuccess )
          this.router.navigate(['/login']);
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.msgError = err.error.message || 'Failed to reset password. Please try again.';
          console.error('Error:', err);
          this.isLoading = false;
        }
      });
  }
}