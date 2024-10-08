import { Component } from '@angular/core';
import { CoursesService } from '../../shared/services/courses.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css'
})
export class AddCourseComponent {
  constructor(private courseserv: CoursesService, private _Router: Router , private toastr: ToastrService) { }
  msgSuccess = '';
  msgErrors: string[] = [];
  isLoading: boolean = false;

 
  readonly maxImageSize = 2048 * 1024; 

  courseForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    price: new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]), // Validate numeric (price)
    // date: new FormControl(null, [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]), // Date format YYYY-MM-DD
    description: new FormControl(null, [Validators.required, Validators.maxLength(5000)]), // Optionally set max length
    image: new FormControl(null, [Validators.required, this.validateImage.bind(this)]), // Custom image validation
  });

  selectedFile: File | null = null;

 
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.courseForm.patchValue({ image: file });
    }
  }

 
  validateImage(control: AbstractControl): ValidationErrors | null {
    const file = this.selectedFile;
    if (file) {
      const fileType = file.type;
      const fileSize = file.size;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

      
      if (!allowedTypes.includes(fileType)) {
        return { invalidFileType: true };
      }

     
      if (fileSize > this.maxImageSize) {
        return { fileTooLarge: true };
      }
    }
    return null; 
  }

 
  handleForm() {
    if (this.courseForm.valid && this.selectedFile) {
      this.isLoading = true;

      const courseData = new FormData();
      courseData.append('name', this.courseForm.get('name')?.value);
      courseData.append('price', this.courseForm.get('price')?.value);
      // courseData.append('date', this.courseForm.get('date')?.value);
      courseData.append('description', this.courseForm.get('description')?.value);
      courseData.append('image', this.selectedFile); 

      this.courseserv.addCourse(courseData).subscribe({
        next: (response) => {
          if (response.success) {
            this.isLoading = false;
            console.log(response)
            this.msgSuccess = response.message;
            this.toastr.success("Course Created Successfully")
            setTimeout(() => {
              this._Router.navigate(['/adminCourses']);
            }, 2000);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          
          this.msgErrors = err.error.message;
          this.toastr.error("course faild created")
        }
      });
    }
  }
  onCancel(): void {
   
    this.courseForm.reset();
    this.selectedFile = null; 

   
  }
}