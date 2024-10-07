import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-add-admin-material',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,NgxPaginationModule],
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
  materials: any[] = [];
  p: number = 1;
  constructor(
    private fb: FormBuilder, 
    private coursesService: CoursesService, 
    private http: HttpClient,
    private router: Router
  ) {
    this.materialForm = this.fb.group({
      title: ['', [Validators.required]], 
      type: ['', [Validators.required, Validators.pattern('pdf|video|audio|text')]],
      file: [null, [this.fileValidator()]]  // File validator for custom validation
    });
  }

  ngOnInit(): void {
    const course = this.coursesService.getCourse();
    if (course) {
      this.courseId = course.id;
      this.getMaterialsForCourse();
    }
  }

 
  getMaterialsForCourse() {
    if (this.courseId) {
      this.coursesService.getMaterialsByCourseId(this.courseId).subscribe(
        (response) => {
          this.materials = response.data;  // Adjust if response structure differs
        },
        (error) => {
          console.error('Error fetching materials:', error);
          this.msgErrors.push("Could not load materials. Please try again.");
        }
      );
    }
  }
  deleteMaterial(materialId: number) {
    if (confirm('Are you sure you want to delete this material?')) {
      this.coursesService.deleteMaterial(materialId).subscribe(
        (response) => {
          console.log('Material deleted:', response);
          this.getMaterialsForCourse();  // Refresh the material list after deletion
        },
        (error) => {
          console.error('Error deleting material:', error);
        }
      );
    }
  }
  

  // Custom file validator
  fileValidator() {
    return (control: any) => {
      const file = control.value;
      if (file) {
        const allowedMimeTypes = ['application/pdf', 'video/mp4', 'video/mkv', 'video/x-msvideo', 'video/webm'];
        const maxSizeInBytes = 102400000;  // Max size 100MB

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

  // Handle file change event
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.materialForm.patchValue({ file: this.selectedFile });
    }
  }

  // Submit form data
  onSubmit() {
    this.isLoading = true;

    if (this.materialForm.invalid) {
      console.error("Form is invalid");
      this.isLoading = false;
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
        this.msgSuccess = "Material added Successfully";
        this.getMaterialsForCourse();  // Refresh the material list
      },
      (error) => {
        console.error('Error adding material:', error);
        this.isLoading = false;
        this.msgErrors = error.error.message;
      }
    );
  }

  // Reset form
  onCancel() {
    this.materialForm.reset();
    this.selectedFile = null;
  }
  navigateToUpdate(materialId: number) {
    if (this.courseId) {
      this.router.navigate([`/adminCourses/${this.courseId}/addmaterial/update/${materialId}`]);
    } else {
      console.error("Course ID is missing");
    }
  }
}
