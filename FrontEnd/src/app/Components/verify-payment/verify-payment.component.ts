import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../shared/services/courses.service'; // Import the service

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

  constructor(private route: ActivatedRoute, private router: Router, private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.status = params['status'];
      this.courseId = +params['courseId']; 
      this.handlePaymentStatus(this.status);
    });
  }

  private handlePaymentStatus(status: string | null): void {
    if (status === 'success') {
      this.message = 'Payment was successful!';
    } else if (status === 'cancel') {
      this.message = 'Payment was canceled.';
    } else {
      this.message = 'No payment status provided.';
    }
  }

  goToCourses(): void {
    if (this.courseId) {
      this.router.navigate([`/courses/${this.courseId}/coursedetails`]); 
    } else {
      this.router.navigate(['/courses']); 
    }
  }
}