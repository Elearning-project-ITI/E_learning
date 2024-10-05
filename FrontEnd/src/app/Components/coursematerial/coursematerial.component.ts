import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coursematerial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coursematerial.component.html',
  styleUrls: ['./coursematerial.component.css']
})
export class CoursematerialComponent implements OnInit {
  descriptionVisible = false; 
  descriptionCompleted = false; 
  videos: any[] = [];
  pdfs: any[] = []; 
  courseId: number | null = null;
  msgSuccess = '';
  msgErrors: string[] = [];
  isLoading: boolean = false;
  materials: any[] = [];
  coursedescription: any;
  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const course = this.coursesService.getCourse();
    if (course) {
      this.coursedescription=course.description
      this.courseId = course.id;
      this.getMaterialsForCourse();
    }

    // Disable text selection
    document.addEventListener('selectstart', (event) => event.preventDefault());

    // Disable screenshot key press
    this.preventScreenshots();
  }

  preventScreenshots() {
    // Disable PrintScreen key
    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Screenshots are disabled for this page.');
      }
    });
  }

  getMaterialsForCourse() {
    if (this.courseId) {
      this.coursesService.getMaterialsByCourseId(this.courseId).subscribe(
        (response) => {
          this.materials = response.data; 
          this.processMaterials();
        },
        (error) => {
          console.error('Error fetching materials:', error);
          this.msgErrors.push("Could not load materials. Please try again.");
        }
      );
    }
  }

  processMaterials() {
    this.materials.forEach(material => {
      if (material.type === 'video') {
        this.videos.push({ 
          title: material.url,
          url: material.file,
          visible: false,
          completed: false 
        });
      } else if (material.type === 'pdf') {
        this.pdfs.push({ 
          title: material.url,
          url: material.file,
          visible: false 
        });
      }
    });
  }

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
    // Implement hover functionality if needed
  }

  // Disable right-click
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  // Disable keyboard shortcuts like F12, Ctrl+Shift+I, Ctrl+U, Alt+PrintScreen
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I') || (event.ctrlKey && event.key === 'U') || (event.key === 'PrintScreen' && event.altKey)) {
      event.preventDefault();
    }
  }
}
