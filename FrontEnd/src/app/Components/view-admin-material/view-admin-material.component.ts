import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-view-admin-material',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './view-admin-material.component.html',
  styleUrl: './view-admin-material.component.css'
})
export class ViewAdminMaterialComponent {
  videos = [
    { title: 'Video 1: Course Overview', url: 'images/video1.mp4', visible: false, completed: false },
    { title: 'Video 2: Introduction to Topic', url: 'images/video1.mp4', visible: false, completed: false }
  ];

  pdfs = [
    { title: 'PDF 1: Course Syllabus', url: 'images/lab1 Docker ..Marina Samir Atallah.pdf', visible: false },
    { title: 'PDF 2: Topic 1 Notes', url: 'images/lab1 Docker ..Marina Samir Atallah.pdf', visible: false }
  ];

  descriptionVisible = false; 
  descriptionCompleted = false; 
   toggleDescription() {
     this.descriptionVisible = !this.descriptionVisible; 
   }

   toggleVideo(index: number) {
   
     if (this.videos[index].visible && !this.videos[index].completed) {
       return; 
     }

     this.videos.forEach((video, i) => {
       video.visible = (i === index) ? !video.visible : false; 
     });
   }

   togglePdf(index: number) {
     this.pdfs.forEach((pdf, i) => {
       pdf.visible = (i === index) ? !pdf.visible : false;
     });
   }

   
   onVideoEnded(index: number) {
     this.videos[index].completed = true; 
   }

   onDescriptionCompleted() {
     this.descriptionCompleted = !this.descriptionCompleted; 
   }

   hoverVideo(index: number) {
    
   }


}
