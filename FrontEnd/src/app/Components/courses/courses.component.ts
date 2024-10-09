// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { RouterLink, RouterModule } from '@angular/router';
// import { CoursesService } from '../../shared/services/courses.service';
// import { LoaderComponent } from "../loader/loader.component";

// @Component({
//   selector: 'app-courses',
//   standalone: true,
//   imports: [CommonModule, RouterModule, LoaderComponent],
//   templateUrl: './courses.component.html',
//   styleUrls: ['./courses.component.css']  
// })
// export class CoursesComponent implements OnInit {
//   Courses: any[] = [];
//   // private baseUrl: string = ''; 

//   constructor(private courseserv: CoursesService) { }

//   ngOnInit(): void {
//     this.courseserv.GetAllCourses().subscribe({
//       next: (response) => {
//         console.log(response);
//         if (response.success) {
//           this.Courses = response.data;
//           // this.Courses.forEach(course => {
//           //   console.log(this.getImageUrl(course.image));
//           // });
//         }
//       },
//       error: (err) => {
//         console.log(err);  
//       }
//     });
//     }

//   // getImageUrl(imagePath: string): string {
//   //   return this.baseUrl + encodeURIComponent(imagePath);
//   // }
//   // getImageUrl(imagePath: string): string {
//   //   return this.baseUrl + imagePath; 
//   // }
//   // getImageUrl(imagePath: string): string {
//   //   return this.baseUrl + imagePath.replace(/ /g, '%20'); // Encode only spaces
//   // }
  

//   toggleHeart(event: Event): void {
//     const heartIcon = event.target as HTMLElement;
//     if (heartIcon.classList.contains('fa-regular')) {
//       heartIcon.classList.remove('fa-regular');
//       heartIcon.classList.add('fa-solid');
//     } else {
//       heartIcon.classList.remove('fa-solid');
//       heartIcon.classList.add('fa-regular');
//     }
//   }
// }
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule ,ActivatedRoute} from '@angular/router';
import { CoursesService } from '../../shared/services/courses.service';
import { LoaderComponent } from "../loader/loader.component";
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { ProfileDataService } from '../../shared/services/profile-data.service';
import { jwtDecode } from 'jwt-decode';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent , NgxPaginationModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  Courses: any[] = [];
  isLoggedIn: boolean = false;
  userProfileImage: string = 'images/user.jpeg'; 
  userRole: string | null = null;
  private authSubscription!: Subscription;
  profileData: any = null;
  decodedData: any = null;
  searchTerm: string = '';
  currentPage: number = 1;
itemsPerPage: number = 6;
  searchTermSubject: Subject<string> = new Subject<string>();
  isMyCourses: boolean = false;

  constructor(    private route: ActivatedRoute
,    private courseserv: CoursesService, private router: Router, private toastr: ToastrService,private _AuthService: AuthService, private profileDataService: ProfileDataService,) { }

  ngOnInit(): void {
    this.isMyCourses = this.route.snapshot.data['type'] === 'my';
    console.log(this.isMyCourses);
    if (this.isMyCourses) {
      this.fetchMyCourses();
    } else {
      this.fetchAllCourses();
    }
    // this.courseserv.GetAllCourses().subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     if (response.success) {
          
    //       this.Courses = response.data;
    //     }
    //   },
    //   error: (err) => {
    //     console.log(err);  
    //   }
    // });
    this.authSubscription = this._AuthService.isAuthenticated$.subscribe(
      (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
        if (this.isLoggedIn) {
          this._AuthService.getProfile().subscribe({
            next: (response) => {
              this.profileData = response;
              if (this.profileData?.data) {
                this.decodeProfileData(this.profileData.data);
                // this.router.navigate(['/']); // Navigate to root to refresh and update role-specific UI
              }
            },
            error: (err) => {
              console.error('Error fetching profile:', err);
            },
          });
        }
      }
    );
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { updatedProfileData: any };
  
    if (state && state.updatedProfileData) {
      // If there's updated profile data passed from the EditProfileComponent, use it
      this.profileData = state.updatedProfileData;
      this.profileDataService.setProfileData(this.profileData); // Optionally store it in service
    } else {
      // If no data is passed, fetch it from the API
      this._AuthService.getProfile().subscribe({
        next: (response) => {
          this.profileData = response;
  
          if (this.profileData?.data) {
            this.decodeProfileData(this.profileData.data);
          }
        },
        error: (err) => {
          console.error('Error fetching profile:', err);
        },
      });
    }
    this.searchTermSubject.pipe(
      debounceTime(300),  // Wait 300ms before searching
      distinctUntilChanged()  // Only trigger if the search term changes
    ).subscribe(searchTerm => {
      this.searchCourses(searchTerm);
    });

  }
  fetchAllCourses(): void {
    this.courseserv.GetAllCourses().subscribe({
      next: (response) => {
        if (response.success) {
          this.Courses = response.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  fetchMyCourses(): void {
    this.courseserv.GetMyCourses().subscribe({
      next: (response) => {
        if (response.success) {
          this.Courses = response.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  onSearch(event: any): void {
    const searchTerm = event.target.value;
    this.searchTermSubject.next(searchTerm);  // Push the search term to the Subject
  }

  searchCourses(searchTerm: string): void {
    this.courseserv.GetCoursesByName(searchTerm).subscribe({
      next: (response) => {
        if (response.success) {
          this.Courses = response.data;
        }
      },
      error: (err) => {
        console.error('Error fetching courses by name:', err);
      }
    });
  }

  toggleHeart(event: Event, courseId: number): void {
    const heartIcon = event.target as HTMLElement;
    
    if (heartIcon.classList.contains('fa-regular')) {
      heartIcon.classList.remove('fa-regular');
      heartIcon.classList.add('fa-solid');
      
      // Call the wishlist API to add the course to the wishlist
      this.courseserv.addToWishlist(courseId).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success(response.message)
            console.log('Course added to wishlist!');
          }
        },
        error: (err) => {
          console.log('Error adding course to wishlist', err);
        }
      });
    } else {
      heartIcon.classList.remove('fa-solid');
      heartIcon.classList.add('fa-regular');
      
      // Call the wishlist API to remove the course from the wishlist
      this.courseserv.removeFromWishlist(courseId).subscribe({
        next: (response) => {
          if (response.success) {
            console.log(response)
            this.toastr.error(response.message)
            console.log('Course removed from wishlist!');
          }
        },
        error: (err) => {
          console.log('Error removing course from wishlist', err);
        }
      });
    }
  }
  

  enroll(courseId: number): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      // Show an alert or modal to the user
      // alert('You need to log in before enrolling in a course.');
      this.toastr.warning('You need to log in before enrolling in a course.')
      // Optionally, you can redirect to the login page
      setTimeout(() => {
        this.router.navigate(['/login']); 
      }, 2000);
      
    } else {
      // If the user is logged in, navigate to the course details or perform the enrollment
      this.router.navigate(['/cousres', courseId]);
    }
  }
  decodeProfileData(token: string): void {
    try {
      this.decodedData = jwtDecode(token);
      console.log('Decoded Profile Data:', this.decodedData);
      this.profileDataService.setProfileData(this.decodedData[0]);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
}
// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { CoursesService } from '../../shared/services/courses.service';
// import { LoaderComponent } from "../loader/loader.component";

// @Component({
//   selector: 'app-courses',
//   standalone: true,
//   imports: [CommonModule, RouterModule, LoaderComponent],
//   templateUrl: './courses.component.html',
//   styleUrls: ['./courses.component.css']
// })
// export class CoursesComponent implements OnInit {
//   Courses: any[] = [];
//   showModal: boolean = false;

//   constructor(private courseserv: CoursesService, private router: Router) { }

//   ngOnInit(): void {
//     this.courseserv.GetAllCourses().subscribe({
//       next: (response) => {
//         console.log(response);
//         if (response.success) {
//           this.Courses = response.data;
//         }
//       },
//       error: (err) => {
//         console.log(err);
//       }
//     });
//   }

//   toggleHeart(event: Event): void {
//     const heartIcon = event.target as HTMLElement;
//     if (heartIcon.classList.contains('fa-regular')) {
//       heartIcon.classList.remove('fa-regular');
//       heartIcon.classList.add('fa-solid');
//     } else {
//       heartIcon.classList.remove('fa-solid');
//       heartIcon.classList.add('fa-regular');
//     }
//   }

//   enroll(courseId: number): void {
//     const accessToken = localStorage.getItem('access_token');
//     if (!accessToken) {
//       this.showModal = true; // Show the modal
//     } else {
//       this.router.navigate(['/courses', courseId]);
//     }
//   }

//   closeModal(): void {
//     this.showModal = false; // Hide the modal
//   }

//   navigateToLogin(): void {
//     this.router.navigate(['/login']); // Navigate to login page
//     this.closeModal(); // Close the modal
//   }
// }