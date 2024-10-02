// import { Component, OnInit } from '@angular/core';
// import { CoursesService } from '../../shared/services/courses.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-wishlist',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './wishlist.component.html',
//   styleUrl: './wishlist.component.css'
// })
// export class WishlistComponent implements OnInit {
//   wishlistCourses: any[] = [];

//   constructor(private coursesService: CoursesService) {}

//   ngOnInit(): void {
//     this.coursesService.getWishlist().subscribe({
//       next: (response) => {
//         console.log(response)
//         if (response.success) {
          
//           this.wishlistCourses = response.data;
//         }
//       },
//       error: (err) => {
//         console.log('Error fetching wishlist', err);
//       }
//     });
//   }
  
// }
import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../shared/services/courses.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistCourses: any[] = [];  // Initialize to an empty array

  constructor(private coursesService: CoursesService, private router: Router) {}

  ngOnInit(): void {
    this.coursesService.getWishlist().subscribe({
      next: (response) => {
        console.log(response);  
        if (response.success) {
        
          this.wishlistCourses = response.wishlist.map((item: { course: any; }) => item.course);
        }
      },
      error: (err) => {
        console.log('Error fetching wishlist', err);
      }
    });
  }
  enroll(courseId: number): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      // Show an alert or modal to the user
      alert('You need to log in before enrolling in a course.');
      // Optionally, you can redirect to the login page
      this.router.navigate(['/login']);
    } else {
      // If the user is logged in, navigate to the course details or perform the enrollment
      this.router.navigate(['/cousres', courseId]);
    }
  }
}
