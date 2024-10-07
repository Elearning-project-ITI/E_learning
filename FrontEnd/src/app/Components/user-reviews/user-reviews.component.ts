import { Component, OnInit } from '@angular/core';
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
  courseId: number | null = null;
  reviews: any[] = [];
  displayedReviews: any[] = []; // Reviews to display based on the current page
  currentPage: number = 1;
  reviewsPerPage: number = 3;
  totalPages: number = 1;

  constructor(private coursesService: CoursesService) {}

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

  // Update the displayed reviews based on the current page
  updateDisplayedReviews() {
    const startIndex = (this.currentPage - 1) * this.reviewsPerPage;
    const endIndex = startIndex + this.reviewsPerPage;
    this.displayedReviews = this.reviews.slice(startIndex, endIndex);
  }

  // Handle page change
  changePage(page: number) {
    this.currentPage = page;
    this.updateDisplayedReviews();
  }

  // Delete review method
  deleteReview(reviewId: number) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.coursesService.deleteReview(reviewId).subscribe({
        next: (response) => {
          if (response.success) {
            // Remove the deleted review from the list
            this.reviews = this.reviews.filter((review) => review.id !== reviewId);
            this.totalPages = Math.ceil(this.reviews.length / this.reviewsPerPage);
            this.updateDisplayedReviews();
          }
        },
        error: (error) => {
          console.error('Error deleting review', error);
        }
      });
    }
  }
}