import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLinkActive, ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '../Components/loader/loader.component';
import { CoursesService } from '../shared/services/courses.service';

@Component({
  selector: 'app-course-details-admin',
  standalone: true,
  imports: [RouterOutlet, RouterModule, RouterLinkActive, CommonModule, LoaderComponent],
  templateUrl: './course-details-admin.component.html',
  styleUrl: './course-details-admin.component.css'
})
export class CourseDetailsAdminComponent {
  ID = 0;
  course: any;

  constructor(
    private myRoute: ActivatedRoute,
    private courseserve: CoursesService,
    private router: Router,
   
  ) { 
    this.ID = myRoute.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.courseserve.GetCoursetByID(this.ID).subscribe({
      next: (data) => {
        this.course = data.data;
        console.log(this.course);
        this.courseserve.setCourse(this.course); // Set the course in the service
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // getImageUrl(imagePath: string): string {
  //   return `${imagePath}`;
  // }

}
