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
  wishlistCourses: any[] = []; 

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
      alert('You need to log in before enrolling in a course.');
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/courses', courseId]);  // Fix the route here if necessary
    }
  }

  removeFromWishlist(courseId: number): void {
    this.coursesService.removeFromWishlist(courseId).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Course removed from wishlist!');
          
          this.wishlistCourses = this.wishlistCourses.filter(course => course.id !== courseId);
        }
      },
      error: (err) => {
        console.log('Error removing course from wishlist', err);
      }
    });
  }

  isInWishlist(courseId: number): boolean {
    return this.wishlistCourses.some(course => course.id === courseId);
  }
}