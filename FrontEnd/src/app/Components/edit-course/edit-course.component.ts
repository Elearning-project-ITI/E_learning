import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Course } from '../../shared/services/courses.service';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  readonly maxImageSize = 2048 * 1024; 
  courseForm: FormGroup;
  selectedFile: File | null = null;
  msgSuccess = '';
  msgErrors: string[] = [];
  isLoading: boolean = false;

  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.courseForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      price: new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]), // Validate numeric (price)
      // date: new FormControl(null, [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]), // Date format YYYY-MM-DD
      description: new FormControl(null, [Validators.required, Validators.maxLength(5000)]), // Optionally set max length
      image: new FormControl(null, [Validators.required, this.validateImage.bind(this)]) // Custom image validation
    });
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id'); 
    if (courseId) {
      this.fetchCourseData(courseId);
    }
  }

  fetchCourseData(courseId: string): void {
    this.coursesService.GetCoursetByID(courseId).subscribe({
      next: (response) => {
        if (response.success) {
          const course: Course = response.data as Course; 
          this.courseForm.patchValue({
            name: course.name,
            price: course.price,
            date: course.date,
            description: course.description,
            image: course.image 
          });
          this.selectedFile = null; 
        }
      },
      error: (err: HttpErrorResponse) => {
        this.msgErrors = [err.error.message];
      }
    });
  }
  

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.courseForm.patchValue({ image: file });
      this.courseForm.get('image')?.updateValueAndValidity(); 
    }
  }

 
  validateImage(control: AbstractControl): ValidationErrors | null {
    const file = this.selectedFile;
    if (file) {
      const fileType = file.type;
      const fileSize = file.size;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

      // Check file type
      if (!allowedTypes.includes(fileType)) {
        return { invalidFileType: true };
      }

      // Check file size
      if (fileSize > this.maxImageSize) {
        return { fileTooLarge: true };
      }
    }
    return null; 
  }

  handleForm(): void {
    if (this.courseForm.valid) {
      this.isLoading = true;
  
      const courseData = new FormData();
      courseData.append('name', this.courseForm.get('name')?.value);
      courseData.append('price', this.courseForm.get('price')?.value);
      // courseData.append('date', this.courseForm.get('date')?.value);
      courseData.append('description', this.courseForm.get('description')?.value);
      if (this.selectedFile) {
        courseData.append('image', this.selectedFile);
      }
  
      const courseId = this.route.snapshot.paramMap.get('id');
      
      if (courseId) {
        this.coursesService.updateCourse(courseId, courseData).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
              this.msgSuccess = response.message;
              setTimeout(() => {
                this.router.navigate(['/adminCourses']);
              }, 2000);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
            this.msgErrors = [err.error.message];
          }
        });
      } else {
        this.isLoading = false;
        this.msgErrors = ['Course ID is invalid.'];
      }
    }
  }
  

  onCancel(): void {
    this.courseForm.reset();
    this.selectedFile = null;
    this.router.navigate(['/adminCourses']); 
  }
}
