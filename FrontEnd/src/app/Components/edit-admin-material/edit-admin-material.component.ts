import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../shared/services/courses.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-admin-material',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-admin-material.component.html',
  styleUrl: './edit-admin-material.component.css'
})
export class EditAdminMaterialComponent implements OnInit {
    materialForm: FormGroup;
    selectedFile: File | null = null;
    courseId: number | null = null;
    materialId: number | null = null;
    msgSuccess = '';
    msgErrors: string[] = [];
    isLoading: boolean = false;
  
    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private coursesService: CoursesService,
      private router: Router
    ) {
      this.materialForm = this.fb.group({
        title: ['', [Validators.required]],
        type: ['', [Validators.required, Validators.pattern('pdf|video|audio|text')]],
        file: [null]  
      });
    }
  
    ngOnInit(): void {
      this.courseId = +this.route.snapshot.paramMap.get('courseId')!;
      this.materialId = +this.route.snapshot.paramMap.get('materialId')!;
      
      if (this.courseId && this.materialId) {
        this.getMaterialById();
      }
    }
    
    getMaterialById() {
      this.coursesService.getMaterialById(this.materialId!).subscribe(
        (response: any) => {
          const material = response.data;
          this.materialForm.patchValue({
            title: material.url,
            type: material.type
          });
        },
        (error: any) => {  
          console.error('Error fetching material:', error);
          this.msgErrors.push('Could not load material data.');
        }
      );
    }
  
    onFileChange(event: any) {
      if (event.target.files.length > 0) {
        this.selectedFile = event.target.files[0];
        this.materialForm.patchValue({ file: this.selectedFile });
      }
    }
  
    onSubmit() {
      this.isLoading = true;
  
      if (this.materialForm.invalid) {
        console.error("Form is invalid");
        this.isLoading = false;
        return;
      }
  
      const formData = new FormData();
      formData.append('url', this.materialForm.get('title')?.value);
      formData.append('type', this.materialForm.get('type')?.value);
  
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
  
     
      this.coursesService.updateMaterial(this.materialId!, formData).subscribe(
        (response) => {
          this.isLoading = false;
          this.msgSuccess = 'Material updated successfully';
          console.log(response)
          this.router.navigate([`/adminCourses/${this.courseId}/addmaterial`]);
        },
        (error) => {
          console.error('Error updating material:', error);
          this.isLoading = false;
          this.msgErrors = error.error.message || ['Failed to update material'];
        }
      );
    }
  
    onCancel() {
      this.router.navigate([`/adminCourses/${this.courseId}/addmaterial`]);
    }
  }

