import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviwes',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './reviwes.component.html',
  styleUrls: ['./reviwes.component.css'] // Corrected from styleUrl to styleUrls
})
export class ReviwesComponent implements OnInit {
  reviewForm: FormGroup;
  courseId: number | null = null; 
  reviews: any[] = []; 
  msgSuccess = '';
  msgErrors = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService
  ) {
    this.reviewForm = this.fb.group({
      name: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comments: ['', [Validators.required, Validators.maxLength(500)]],
    });
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

  onSubmit() {
    if (this.reviewForm.valid && this.courseId) {
      this.isLoading = true;
      const { name, rating, comments } = this.reviewForm.value;

      this.coursesService.submitReview(this.courseId, rating, comments).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.msgSuccess = 'Review submitted successfully';

          // Update the reviews array with the new review
          const newReview = {
            user: { name }, // Assuming user name comes from the form
            rating,
            comment: comments,
            created_at: new Date().toISOString(), // Add a timestamp for display
          };
          this.reviews.push(newReview); // Add the new review to the reviews array

          // Reset the form after submission
          this.reviewForm.reset();
          console.log('Review submitted successfully', response);
        },
        error: (error) => {
          this.isLoading = false;
          this.msgErrors = 'Error submitting review';
          console.error('Error submitting review', error);
        }
      });
    } else {
      console.error('Form is invalid or course ID is missing');
    }
  }
}

// export class ReviwesComponent implements OnInit {
//   reviewForm: FormGroup;
//   courseId: number | null = null; // Initially null

//   constructor(
//     private fb: FormBuilder,
//     private coursesService: CoursesService
//   ) {
//     this.reviewForm = this.fb.group({
//       name: ['', Validators.required],
//       rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
//       comments: ['', [Validators.required, Validators.maxLength(500)]],
//     });
//   }

//   ngOnInit(): void {
//     // Fetch the course data when the component initializes
//     const course = this.coursesService.getCourse();
//     if (course && course.id) {
//       this.courseId = course.id; // Set the course ID dynamically
//     } else {
//       console.error('Course data is not available');
//     }
//   }

//   onSubmit() {
//     if (this.reviewForm.valid && this.courseId) {
//       const rating = this.reviewForm.value.rating;
//       const comment = this.reviewForm.value.comments;

//       this.coursesService.submitReview(this.courseId, rating, comment).subscribe({
//         next: (response) => {
//           console.log('Review submitted successfully', response);
//         },
//         error: (error) => {
//           console.error('Error submitting review', error);
//         }
//       });
//     } else {
//       console.error('Form is invalid or course ID is missing');
//     }
//   }
// }
