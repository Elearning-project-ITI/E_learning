import { AuthService } from './../../shared/services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 constructor(private _AuthService: AuthService ,private _Router:Router) { }
  msgError:string='';
  isLoading:boolean=false;

  loginForm: FormGroup = new FormGroup({
   
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    
  });

 
  handleForm() {
    
    if (this.loginForm.valid ) {
      this.isLoading=true;
      const formData = new FormData();
      formData.append('email', this.loginForm.get('email')?.value);
      formData.append('password', this.loginForm.get('password')?.value);
 
      this._AuthService.setLogin(formData).subscribe({
        next: (response) => {
          console.log(response)
          if (response.success){
            this.isLoading=false;
             localStorage.setItem('eToken',response.data.access_token);
            //  this._AuthService.saveUserData();
             this._Router.navigate(['/home'])
          } 
        },
        error: (err:HttpErrorResponse) => {
          this.isLoading=false;
          this.msgError=err.error.message
          console.log(err.error.message);
        }
      });
    }
}
}