import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CoursesService } from '../../shared/services/courses.service';

@Component({
  selector: 'app-view-admin-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-admin-course.component.html',
  styleUrl: './view-admin-course.component.css'
})
export class ViewAdminCourseComponent {
  course: any;

  constructor(private courseserv: CoursesService) {}

  ngOnInit(): void {
    this.course = this.courseserv.getCourse(); 
  }

 
  // makePayment(): void {
  //   if (this.course && this.course.id) {
  //     this.courseserv.payment(this.course.id).subscribe({
  //       next: (response) => {
  //         console.log('Payment Successful:', response);
  //         window.location.href = response.url;
  //       },
  //       error: (err) => {
  //         console.error('Payment Failed:', err);
  //         alert('Payment Failed: ' + err.message);
  //       }
  //     });
  //   } else {
  //     alert('Course ID is missing. Cannot process payment.');
  //   }
  // }
  
  
}



