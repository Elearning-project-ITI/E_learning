import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coursematerial',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './coursematerial.component.html',
  styleUrls: ['./coursematerial.component.css']
})
export class CoursematerialComponent {
  videos = [
    { title: 'Video 1: Course Overview', url: 'images/video1.mp4', visible: false, completed: false },
    { title: 'Video 2: Introduction to Topic', url: 'images/video2.mp4', visible: false, completed: false }
  ];

  pdfs = [
    { title: 'PDF 1: Course Syllabus', url: 'images/lab1 Docker ..Marina Samir Atallah.pdf', visible: false },
    { title: 'PDF 2: Topic 1 Notes', url: 'images/lab1 Docker ..Marina Samir Atallah.pdf', visible: false }
  ];

  descriptionVisible = false; // Track visibility of the course description
  descriptionCompleted = false; // Track if the course description is completed

  toggleDescription() {
    this.descriptionVisible = !this.descriptionVisible; // Toggle description visibility
  }

  toggleVideo(index: number) {
    // Prevent opening the next video if the current one is not completed
    if (this.videos[index].visible && !this.videos[index].completed) {
      return; 
    }

    this.videos.forEach((video, i) => {
      video.visible = (i === index) ? !video.visible : false; // Toggle only the selected video
    });
  }

  togglePdf(index: number) {
    this.pdfs.forEach((pdf, i) => {
      pdf.visible = (i === index) ? !pdf.visible : false;
    });
  }

  // Method to mark the video as completed when it ends
  onVideoEnded(index: number) {
    this.videos[index].completed = true; // Mark the video as completed
  }

  // Method to handle completion of the course description
  onDescriptionCompleted() {
    this.descriptionCompleted = !this.descriptionCompleted; // Toggle completion state
  }
}
