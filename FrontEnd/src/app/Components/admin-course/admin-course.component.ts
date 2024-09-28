import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CoursesService } from '../../shared/services/courses.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-admin-course',
  standalone: true,
  imports: [RouterModule,CommonModule,LoaderComponent],
  templateUrl: './admin-course.component.html',
  styleUrl: './admin-course.component.css'
})
export class AdminCourseComponent {
  Courses: any[] = [];

  constructor(private courseserv: CoursesService, private router: Router) { }

  ngOnInit(): void {
    this.courseserv.GetAllCourses().subscribe({
      next: (response) => {
        console.log(response);
        if (response.success) {
          this.Courses = response.data;
        }
      },
      error: (err) => {
        console.log(err);  
      }
    });
  }
  deleteCourse(courseId: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseserv.deleteCourse(courseId).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Course deleted successfully!');
            this.router.navigate(['/adminCourses']); // Navigate to courses list
            // Optionally, reload the courses without a full page navigation
            this.loadCourses(); // Call the method to reload courses
          }
        },
        error: (err) => {
          console.error(err);
          alert('An error occurred while deleting the course.');
        }
      });
    }
  }
  
  loadCourses(): void {
    this.courseserv.GetAllCourses().subscribe({
      next: (response) => {
        if (response.success) {
          this.Courses = response.data;
        }
      },
      error: (err) => {
        console.log(err);  
      }
    });
  }

}
