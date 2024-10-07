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
  displayedReviews: any[] = []; // Reviews to display based on the current page
  currentPage: number = 1; // The current page
  reviewsPerPage: number = 3; // Number of reviews per page
  totalPages: number = 1;

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
          this.totalPages = Math.ceil(this.reviews.length / this.reviewsPerPage);
          this.updateDisplayedReviews();
        }
      },
      error: (error) => {
        console.error('Error fetching reviews', error);
      }
    });
  }
   // Method to update the displayed reviews based on the current page
   updateDisplayedReviews() {
    const startIndex = (this.currentPage - 1) * this.reviewsPerPage;
    const endIndex = startIndex + this.reviewsPerPage;
    this.displayedReviews = this.reviews.slice(startIndex, endIndex);
  }

  // Method to handle page change
  changePage(page: number) {
    this.currentPage = page;
    this.updateDisplayedReviews();
  }

 
}
