import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CoursesService } from '../../shared/services/courses.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']  
})
export class CoursesComponent implements OnInit {
  Courses: any[] = [];
  // private baseUrl: string = ''; 

  constructor(private courseserv: CoursesService) { }

  ngOnInit(): void {
    this.courseserv.GetAllCourses().subscribe({
      next: (response) => {
        console.log(response);
        if (response.success) {
          this.Courses = response.data;
          // this.Courses.forEach(course => {
          //   console.log(this.getImageUrl(course.image));
          // });
        }
      },
      error: (err) => {
        console.log(err);  
      }
    });
    }

  // getImageUrl(imagePath: string): string {
  //   return this.baseUrl + encodeURIComponent(imagePath);
  // }
  // getImageUrl(imagePath: string): string {
  //   return this.baseUrl + imagePath; 
  // }
  // getImageUrl(imagePath: string): string {
  //   return this.baseUrl + imagePath.replace(/ /g, '%20'); // Encode only spaces
  // }
  

  toggleHeart(event: Event): void {
    const heartIcon = event.target as HTMLElement;
    if (heartIcon.classList.contains('fa-regular')) {
      heartIcon.classList.remove('fa-regular');
      heartIcon.classList.add('fa-solid');
    } else {
      heartIcon.classList.remove('fa-solid');
      heartIcon.classList.add('fa-regular');
    }
  }
}
