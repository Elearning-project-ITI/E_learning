import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';

@Component({
  selector: 'app-add-admin-material',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-admin-material.component.html',
  styleUrls: ['./add-admin-material.component.css']
})
export class AddAdminMaterialComponent implements OnInit {
  materialForm: FormGroup;
  selectedFile: File | null = null;
  courseId: number | null = null;
  msgSuccess = '';
  msgErrors: string[] = [];
  isLoading: boolean = false;
  constructor(
    private fb: FormBuilder, 
    private coursesService: CoursesService, 
    private http: HttpClient
  ) {
    this.materialForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern('https?://.+')]], 
      type: ['', [Validators.required, Validators.pattern('pdf|video|audio|text')]], 
    });
  }

  ngOnInit(): void {
    const course = this.coursesService.getCourse();
    if (course) {
      this.courseId = course.id;
    }
  }
  fileValidator() {
    return (control: any) => {
      const file = control.value;
      if (file) {
        const allowedMimeTypes = ['application/pdf', 'video/mp4', 'video/mkv', 'video/x-msvideo', 'video/webm'];
        const maxSizeInBytes = 102400000; 

        if (!allowedMimeTypes.includes(file.type)) {
          return { invalidFileType: true };
        }

        if (file.size > maxSizeInBytes) {
          return { maxFileSizeExceeded: true };
        }
      }
      return null;
    };
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.materialForm.patchValue({ file: this.selectedFile });
    }
  }

  onSubmit() {
  
    console.log("Form status:", this.materialForm.status);
    console.log("Form value:", this.materialForm.value);
    this.isLoading = true;
   
    if (this.materialForm.invalid) {
      console.error("Form is invalid");
      this.isLoading = true;
      
      Object.keys(this.materialForm.controls).forEach(key => {
        const controlErrors = this.materialForm.get(key)?.errors;
        if (controlErrors) {
          console.error(`Validation errors in ${key}:`, controlErrors);
        }
      });
  
      return;
    }
  
    if (!this.courseId) {
      console.error("Course ID is missing");
      return;
    }
  
    const formData = new FormData();
    formData.append('url', this.materialForm.get('title')?.value);
    formData.append('type', this.materialForm.get('type')?.value);
    formData.append('course_id', this.courseId.toString());
  
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
  
    this.coursesService.addMaterial(formData).subscribe(
      (response) => {
        this.isLoading = false;
        console.log(response)
        this.msgSuccess = "Material added Successfully";
        console.log('Material added:', response);
      },
      (error) => {
        console.error('Error adding material:', error);
        this.isLoading = false;
        this.msgErrors = error.error.message;
      }
    );
  }
  

  onCancel() {
    this.materialForm.reset();
  }
}
