
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
export interface Answer {
  questionId: number; 
  selectedChoice: string; 
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
  GetMyCourses(): Observable<GetAllCoursesResponse> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<GetAllCoursesResponse>(this.DB_URL +'/my-courses', { headers }).pipe(
      catchError(this.handleError)
    );
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
  GetCoursesByName(searchTerm: string): Observable<GetAllCoursesResponse> {
    const url = `${this.DB_URL}/course?name=${searchTerm}`;
    return this.http.get<GetAllCoursesResponse>(url).pipe(
      catchError(this.handleError)
    );
  }
  payment(courseId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
  
    if (!token) {
      return throwError(() => new Error('Token not found'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { id: courseId };  
  
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

  getCourse(): Course | null {
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
  addMaterial(materialData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post(this.DB_URL + '/material', materialData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  getAllMaterials(): Observable<any> {
    return this.http.get(`${this.DB_URL}/material`).pipe(
      catchError(this.handleError)
    );
  }
  
  getMaterialsByCourseId(courseId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.DB_URL}/course/${courseId}/materials`, { headers });
  }
  deleteMaterial(materialId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.delete(`${this.DB_URL}/material/${materialId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  updateMaterial(materialId: number, materialData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Append '_method' with 'PUT' to make it work like an update.
    materialData.append('_method', 'PUT');
  
    return this.http.post(`${this.DB_URL}/material/${materialId}`, materialData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  getMaterialById(materialId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.DB_URL}/material/${materialId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  // addQuiz(quizData: any): Observable<any> {
  //   const token = localStorage.getItem('access_token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
  //   return this.http.post(this.DB_URL + '/quiz', quizData, { headers }).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  // addQuestion(quizData: any): Observable<any> {
  //   const token = localStorage.getItem('access_token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
  //   return this.http.post(this.DB_URL + '/quiz', quizData, { headers }).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  // addChoice(quizData: any): Observable<any> {
  //   const token = localStorage.getItem('access_token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
  //   return this.http.post(this.DB_URL + '/quiz', quizData, { headers }).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  addQuiz(quizData: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post(`${this.DB_URL}/quiz`, quizData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  addQuestion(questionData: any, quizId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post(`${this.DB_URL}/quiz/${quizId}/questions`, questionData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  addChoice(choiceData: any, quizId: number, questionId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post(`${this.DB_URL}/quiz/${quizId}/questions/${questionId}/choices`, choiceData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  getQuizzesByCourse(courseId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.DB_URL}/course/${courseId}/quizzes`, { headers }).pipe(
        catchError(this.handleError)
    );
}

// Fetch questions for a specific quiz
getQuestionsByQuiz(quiz_id: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.DB_URL}/quiz/${quiz_id}/questions`, { headers }).pipe(
        catchError(this.handleError)
    );
}
//Route::get('/quiz/{quiz_id}/questions', [QuestionController::class, 'getByQuiz'])
// Fetch choices for a specific question
getChoicesByQuestion(questionId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.DB_URL}/question/${questionId}/choices`, { headers }).pipe(
        catchError(this.handleError)
    );
}
submitQuiz(quizId: number, submission: any): Observable<any> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  return this.http.post(`${this.DB_URL}/quiz/${quizId}/submit`, submission, { headers }).pipe(
    catchError(this.handleError)
  );
}
updateQuiz(quizId: number, quizData: FormData): Observable<any> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  quizData.append('_method', 'PUT');
  return this.http.post(`${this.DB_URL}/quiz/${quizId}`, quizData, { headers }).pipe(
    catchError(this.handleError)
  );
}
deleteQuiz(quizId: number): Observable<any> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
 
  return this.http.delete(`${this.DB_URL}/quiz/${quizId}`,{ headers }).pipe(
    catchError(this.handleError)
  );
}

updateQuestion(questionId: number, questionData: FormData): Observable<any> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  questionData.append('_method', 'PUT');
  return this.http.post(`${this.DB_URL}/question/${questionId}`, questionData, { headers }).pipe(
    catchError(this.handleError)
  );
}

updateChoice(choiceId: number, choiceData: FormData, questionId: number): Observable<any> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  choiceData.append('_method', 'PUT');
  return this.http.post(`${this.DB_URL}/question/${questionId}/choices/${choiceId}`, choiceData, { headers }).pipe(
    catchError(this.handleError)
  );
}



// submitQuizAnswers(quizId: number, data: { answers: Answer[] }): Observable<any> {
//   const token = localStorage.getItem('access_token');
//   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//   // Use the data parameter here
//   const payload = { answers: data.answers };

//   return this.http.post(`http://localhost:8000/api/quizzes/${quizId}/submit`, payload, { headers }).pipe(
//       catchError(this.handleError)
//   );
// }
addToWishlist(courseId: number): Observable<any> {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return throwError(() => new Error('User not authenticated'));
  }
  
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const body = { course_id: courseId };
  
  return this.http.post(`${this.DB_URL}/wishlist`, body, { headers }).pipe(
    catchError(this.handleError)
  );
}

getWishlist(): Observable<any> {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return throwError(() => new Error('User not authenticated'));
  }
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get(`${this.DB_URL}/my-wishlist`, { headers }).pipe(
    catchError(this.handleError)
  );
}
removeFromWishlist(courseId: number): Observable<any> {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return throwError(() => new Error('User not authenticated'));
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete(`${this.DB_URL}/wishlist/${courseId}`, { headers }).pipe(
    catchError(this.handleError)
  );
}
submitReview(courseId: number, rating: number, comment: string): Observable<any> {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return throwError(() => new Error('Token not found'));
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const body = { course_id: courseId, rating: rating, comment: comment };

  return this.http.post(this.DB_URL + `/review`, body, { headers }).pipe(
    catchError(this.handleError)
  );
}
getAllReviews(): Observable<any> {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return throwError(() => new Error('Token not found'));
  }
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(this.DB_URL + '/reviews', { headers }).pipe(
    catchError(this.handleError)
  );
}
deleteReview(reviewId: number): Observable<any> {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return throwError(() => new Error('Token not found'));
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete(`${this.DB_URL}/review/${reviewId}`, { headers }).pipe(
    catchError(this.handleError)
  );
}
booking(courseId: number): Observable<any> {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return throwError(() => new Error('Token not found'));
  }
  const body = { course_id: courseId};
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<any>(`${this.DB_URL}/check-booking`,body, { headers }).pipe(
    catchError(this.handleError)
  );
}
paymentSuccess(courseId: number | null , sessionid: string |null): Observable<any> {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return throwError(() => new Error('Token not found'));
  }
  const body = { course_id: courseId , session_id:sessionid };
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<any>(`${this.DB_URL}/payment/success`, body, { headers }).pipe(
    catchError(this.handleError)
  );
}

// Method for payment cancel
paymentCancel(courseId: number): Observable<any> {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return throwError(() => new Error('Token not found'));
  }
  const body = { course_id: courseId };
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<any>(`${this.DB_URL}/payment/cancel`, body, { headers }).pipe(
    catchError(this.handleError)
  );
}
getMostBookedCourses(): Observable<GetAllCoursesResponse> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  return this.http.get<GetAllCoursesResponse>(`${this.DB_URL}/courses/most-booked`, { headers }).pipe(
    catchError(this.handleError)
  );
}

}

  

