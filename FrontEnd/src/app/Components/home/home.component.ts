import { AfterViewInit, Component } from '@angular/core';
import Typed from 'typed.js';
import { AboutComponent } from "../about/about.component";
import { CoursesComponent } from '../courses/courses.component';
import { WorkPerviousComponent } from '../work-pervious/work-pervious.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutComponent,CoursesComponent,WorkPerviousComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    const options = {
      strings: ["Welcome to The HK Studio"],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true
    };

    new Typed('.auto-type', options);
  }
}
