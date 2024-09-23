import { AuthService } from './../../shared/services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  constructor(private _AuthService: AuthService ,private _Router:Router) { }
  msgError:string='';
  isLoading:boolean=false;

  forgetpassword: FormGroup = new FormGroup({
   
    email: new FormControl(null, [Validators.required, Validators.email]),
    
  });

 
  handleForm() {
    
    if (this.forgetpassword.valid ) {
      this.isLoading=true;
      const formData = new FormData();
      formData.append('email', this.forgetpassword.get('email')?.value);
      
 
      this._AuthService.setforget(formData).subscribe({
        next: (response) => {
          console.log(response)
          if (response.success){
            this.isLoading=false;
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