import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { CoursesService } from '../../shared/services/courses.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";


@Component({
  selector: 'app-cousre-details',
  standalone: true,
  imports: [RouterOutlet, RouterModule, RouterLinkActive, CommonModule, LoaderComponent],
  templateUrl: './cousre-details.component.html',
  styleUrls: ['./cousre-details.component.css']
})
export class CousreDetailsComponent {
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