// src/app/shared/services/courses.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

interface Course {
  id: number;
  name: string;
  price: string;
  image: string;
  date: string;
}

interface GetAllCoursesResponse {
  success: boolean;
  data: Course[];
  message?: string;
}
interface GetCourseResponse {
  success: boolean;
  data: object;
  message?: string;
}
@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private readonly DB_URL = "http://localhost:8000/api/course";

  constructor(private readonly http: HttpClient) { }

  GetAllCourses(): Observable<GetAllCoursesResponse> {
    // const token = localStorage.getItem('access_token');

    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<GetAllCoursesResponse>(this.DB_URL );
  }
  // , { headers }).pipe(
  //   catchError(this.handleError)
  GetCoursetByID(id:any): Observable<GetCourseResponse>{
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<GetCourseResponse>(this.DB_URL+"/"+id, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  payment(courseId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
  
    if (!token) {
      return throwError(() => new Error('Token not found'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { course_id: courseId };  // Assuming 'course_id' is required by the API
  
    return this.http.post(`http://127.0.0.1:8000/api/payment`, body, { headers }).pipe(
   catchError(this.handleError)
    );
  }
  
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
     
      errorMessage = `Error: ${error.error.message}`;
    } else {
     
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
  private courseData: any;

  setCourse(course: any) {
    this.courseData = course;
  }

  getCourse() {
    return this.courseData;
  }
}
