import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../shared/services/courses.service'; // Import the service
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-payment',
  standalone: true,
  imports: [],
  templateUrl: './verify-payment.component.html',
  styleUrls: ['./verify-payment.component.css']
})
export class VerifyPaymentComponent implements OnInit {
  message: string = '';
  status: string | null = null;
  courseId: number | null = null; 

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private coursesService: CoursesService 
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.status = params['status'];
      this.courseId = +params['course']; 
      this.handlePaymentStatus(this.status);
    });
  }

  private handlePaymentStatus(status: string | null): void {
    if (status === 'success') {
      
      this.callPaymentSuccessApi();
    
    } else if (status === 'cancel') {
    
      this.callPaymentCancelApi();
    
    } else {
      this.message = 'No payment status provided.';
     
    }
  }


  private callPaymentSuccessApi(): void {
    
    if (this.courseId) {
      this.message = 'Payment was successful!';
      this.coursesService.paymentSuccess(this.courseId).subscribe({
        next: (response) => {
          console.log('Success API called:', response);
          this.router.navigate([`/cousres/${this.courseId}/cousrematerial`]); 
        },
        error: (error) => {
          console.error('Error calling success API:', error);
        }
      });
    }
  }

 
  private callPaymentCancelApi(): void {
    
    if (this.courseId) {
      this.message = 'Payment was canceled.';
      this.coursesService.paymentCancel(this.courseId).subscribe({
        next: (response) => {
          console.log('Cancel API called:', response);
          this.router.navigate([`/cousres/${this.courseId}`]); 
        },
        error: (error) => {
          console.error('Error calling cancel API:', error);
        }
      });
    }
  }

  goToCourses(): void {
    if (this.courseId) {
      this.router.navigate([`/cousres/${this.courseId}/cousrematerial`]); 
    } else {
      this.router.navigate(['/courses']); 
    }
  }
}