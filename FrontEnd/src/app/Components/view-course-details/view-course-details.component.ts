// import { Component, Input } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CoursesService } from '../../shared/services/courses.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-view-course-details',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './view-course-details.component.html',
//   styleUrl: './view-course-details.component.css'
// })
// export class ViewCourseDetailsComponent {
//   course: any;

//   constructor(private courseserv: CoursesService) {}

//   ngOnInit(): void {
//     this.course = this.courseserv.getCourse(); // Get the course from the service
//   }

//   // getImageUrl(imagePath: string): string {
//   //   return `${imagePath}`;
//   // }
//   // ID=0;
//   // private baseUrl: string = 'http://localhost:8000/storage/'; 
//   // course:any
//   // myRoute: any;
//   // constructor(myRoute:ActivatedRoute,private courseserve:CoursesService, private router: Router ){ 
//   //   this.myRoute.params.subscribe((params: { [x: string]: string | number; }) => {
//   //     this.ID = +params['id'];
//   //   });
//   // }
//   // ngOnInit(): void {
//   //   this.courseserve.GetCoursetByID(this.ID).subscribe({
//   //     next:(data)=>{
//   //       this.course=data.data;
//   //       console.log(data.data)
//   //     },
//   //     error:(err)=>{
//   //       console.log(err)
//   //     }
//   //   })
  
//   // }
//   // getImageUrl(imagePath: string): string {
//   //   return this.baseUrl + imagePath; 
//   // }
// }
import { Component } from '@angular/core';
import { CoursesService } from '../../shared/services/courses.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-course-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-course-details.component.html',
  styleUrls: ['./view-course-details.component.css']
})
export class ViewCourseDetailsComponent {
  course: any;
  isBooked: boolean = false;
  constructor(private courseserv: CoursesService) {}

  ngOnInit(): void {
    this.course = this.courseserv.getCourse(); 
    this.courseserv.booking(this.course.id).subscribe({
      next: (data) => {
        console.log("booking data",data)
        this.isBooked = data.success;
        // this.course = data.data;
        // console.log(this.course);
        // this.courseserve.setCourse(this.course); // Set the course in the service
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

 
  makePayment(): void {
    if (this.course && this.course.id) {
      this.courseserv.payment(this.course.id).subscribe({
        next: (response) => {
          console.log('Payment Successful:', response);
          window.location.href = response.url;
          // window.location.href = `${response.url}?status=success`;
        },
        error: (err) => {
          // window.location.href = `http://localhost:4200/verifypayment?status=cancel`;
          console.error('Payment Failed:', err);
          alert('Payment Failed: ' + err.message);
        }
      });
    } else {
      alert('Course ID is missing. Cannot process payment.');
    }
  }
  
  
}

