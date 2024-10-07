import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../shared/services/courses.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  mostBookedCourses: any[] = [];
  chart: any;

  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.fetchMostBookedCourses();
  }

  fetchMostBookedCourses() {
    this.coursesService.getMostBookedCourses().subscribe(response => {
      if (response.success) {
        this.mostBookedCourses = response.data;
        this.createChart();
      }
    });
  }

  createChart() {
    const courseNames = this.mostBookedCourses.map(course => course.name);
    const bookingCounts = this.mostBookedCourses.map(course => course.bookings_count);

    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: courseNames,
        datasets: [{
          label: 'Number of Bookings',
          data: bookingCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
