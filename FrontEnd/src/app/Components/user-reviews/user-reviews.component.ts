import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-reviews.component.html',
  styleUrl: './user-reviews.component.css'
})
export class UserReviewsComponent implements OnInit {
 ;
  courseId: number | null = null; 
  reviews: any[] = []; 

  constructor(
   
    private coursesService: CoursesService
  ) {
   
  }

  ngOnInit(): void {
    
    const course = this.coursesService.getCourse();
    if (course && course.id) {
      this.courseId = course.id; 
      this.getReviewsForCourse(this.courseId); 
    } else {
      console.error('Course data is not available');
    }
  }

  
  getReviewsForCourse(courseId: number) {
    this.coursesService.getAllReviews().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.reviews = response.reviews.filter((review: any) => review.course.id === courseId);
        }
      },
      error: (error) => {
        console.error('Error fetching reviews', error);
      }
    });
  }

 
}
