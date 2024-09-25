import { AuthService } from './../../shared/services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registeration',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent {
  constructor(private _AuthService: AuthService ,private _Router:Router) { }
  msgErrorEmail:string='';
  msgErrorName:string='';
  isLoading:boolean=false;

  registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{10,15}$')]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    image: new FormControl(null),
  });

  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.registerForm.patchValue({ image: file.name });
    }
  }

  handleForm() {
    
    if (this.registerForm.valid && this.selectedFile) {
      this.isLoading=true;
      const formData = new FormData();
      formData.append('name', this.registerForm.get('name')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('phone', this.registerForm.get('phone')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('image', this.selectedFile);  // Make sure `selectedFile` is the actual file object
      

      this._AuthService.setRegister(formData).subscribe({
        next: (response) => {
          if (response.success=true){
            this.isLoading=false;
             this._Router.navigate(['/login'])
          }
          console.log(response);
          console.log(formData.get('image'));  
        },
        error: (err:HttpErrorResponse) => {
          this.isLoading=false;
          this.msgErrorEmail=err.error.message[0];
          this.msgErrorName=err.error.message[1];
        
          console.log(err.error);
        }
      });
    }
  }
}
