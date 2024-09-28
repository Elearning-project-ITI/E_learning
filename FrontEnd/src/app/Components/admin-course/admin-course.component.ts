import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CoursesService } from '../../shared/services/courses.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-admin-course',
  standalone: true,
  imports: [RouterModule,CommonModule,LoaderComponent],
  templateUrl: './admin-course.component.html',
  styleUrl: './admin-course.component.css'
})
export class AdminCourseComponent {
  Courses: any[] = [];

  constructor(private courseserv: CoursesService, private router: Router) { }

  ngOnInit(): void {
    this.courseserv.GetAllCourses().subscribe({
      next: (response) => {
        console.log(response);
        if (response.success) {
          this.Courses = response.data;
        }
      },
      error: (err) => {
        console.log(err);  
      }
    });
  }


}
