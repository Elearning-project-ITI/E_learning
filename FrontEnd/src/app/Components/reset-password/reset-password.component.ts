import { AuthService } from './../../shared/services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  constructor(private _AuthService: AuthService ,private _Router:Router) { }
  msgError:string='';
  isLoading:boolean=false;

  resetpassword: FormGroup = new FormGroup({
   
    newpassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    repassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
  });

 
  handleForm() {
    
    if (this.resetpassword.valid ) {
      this.isLoading=true;
      const formData = new FormData();
     
      formData.append('newpassword', this.resetpassword.get('newpassword')?.value);
      formData.append('repassword', this.resetpassword.get('repassword')?.value);
      this._AuthService.setreset(formData).subscribe({
        next: (response) => {
          console.log(response)
          if (response.success){
            this.isLoading=false;
            //  localStorage.setItem('eToken',response.access_token);
            //  this._AuthService.saveUserData();
            //  this._Router.navigate(['/home'])
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