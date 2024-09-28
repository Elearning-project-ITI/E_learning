
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
// import { environment } from '../../../environment/environment';
import { environment } from '../../environments/environment';
export interface Course {
  id: number;
  name: string;
  price: string;
  image: string;
  date: string;
  description: string;
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
  private readonly DB_URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  GetAllCourses(): Observable<GetAllCoursesResponse> {
    // const token = localStorage.getItem('access_token');

    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<GetAllCoursesResponse>(this.DB_URL +'/course');
  }
  // , { headers }).pipe(
  //   catchError(this.handleError)
  GetCoursetByID(id:any): Observable<GetCourseResponse>{
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<GetCourseResponse>(this.DB_URL+"/course/"+id, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  payment(courseId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
  
    if (!token) {
      return throwError(() => new Error('Token not found'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { id: courseId };  // Assuming 'course_id' is required by the API
  
    return this.http.post(this.DB_URL+`/payment`, body, { headers }).pipe(
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
  addCourse(courseData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post(this.DB_URL + '/course', courseData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  updateCourse(courseId: string, courseData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    courseData.append('_method', 'PUT');
    return this.http.post(`${this.DB_URL}/course/${courseId}`, courseData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  deleteCourse(courseId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.delete(`${this.DB_URL}/course/${courseId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
}
