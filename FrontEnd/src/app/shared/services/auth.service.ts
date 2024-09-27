
 
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { jwtDecode } from 'jwt-decode';
// import { Observable } from 'rxjs';

// interface userAuth {
//   user: any;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   userData: any;
//   userToken: any;

  
//   private baseURL = 'http://0.0.0.0:8000/api';

//   constructor(private _HttpClient: HttpClient, private _Router: Router) {}

//   saveUserData() {
//     const token = localStorage.getItem('eToken');
//     if (token != null) {
//       const decodedToken: any = jwtDecode(token);
//       console.log('Decoded Token:', decodedToken);
//       this.userData = decodedToken;
//       const accessToken = decodedToken?.access_token;

//       if (accessToken) {
//         this.userToken = accessToken;
//         localStorage.setItem('access_token', this.userToken);
//         console.log('Access Token Saved:', this.userToken);
//       } else {
//         console.error('Access token not found in decoded JWT');
//       }
//     }
//   }

//   setRegister(userData: FormData): Observable<any> {
//     return this._HttpClient.post(`${this.baseURL}/register`, userData);
//   }

//   setLogin(userData: FormData): Observable<any> {
//     return this._HttpClient.post(`${this.baseURL}/login`, userData);
//   }

//   setforget(userData: FormData): Observable<any> {
//     return this._HttpClient.post(`${this.baseURL}/forgot-password`, userData);
//   }

//   setreset(userData: FormData): Observable<any> {
//     return this._HttpClient.post(`${this.baseURL}/reset-password`, userData);
//   }

//   logout(): void {
//     const token = localStorage.getItem('access_token');

//     if (!token) {
//       console.error('No access token found.');
//       return;
//     }

//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     this._HttpClient.post(`${this.baseURL}/logout`, {}, { headers }).subscribe({
//       next: (response) => {
//         console.log('Logout successful:', response);
//         localStorage.removeItem('eToken');
//         localStorage.removeItem('access_token');
//         this._Router.navigate(['/login']);
//       },
//       error: (err) => {
//         console.error('Logout failed:', err);
//       },
//     });
//   }
// }
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

interface userAuth {
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  userToken: any;
  userRole:any;
  userimage:any;
  private baseURL = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  // private profileDataSubject = new BehaviorSubject<any>(null);
  // profileData$ = this.profileDataSubject.asObservable();
  constructor(private _HttpClient: HttpClient, private _Router: Router) {}

  saveUserData() {
    const token = localStorage.getItem('eToken');
    if (token != null) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
  
        // Assuming user is an object, not an array
        this.userData = decodedToken;
        const accessToken = decodedToken?.access_token;
        const myRole = decodedToken?.user.role; // Corrected to access role from user object
        const myimage=decodedToken?.user.image;
        if (accessToken) {
          this.userToken = accessToken;
          this.userRole = myRole; // Save user role
          this.userimage=myimage;
          console.log("user image",this.userimage)
          console.log('User Role:', this.userRole);
          localStorage.setItem('access_token', this.userToken);
          console.log('Access Token Saved:', this.userToken);
          localStorage.removeItem('eToken');
          this.isAuthenticatedSubject.next(true); // Emit true when token is saved
        } else {
          console.error('Access token not found in decoded JWT');
        }
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }
  }
  getUserImage(): string {
    if (this.userimage) {
      const imageUrlParts = this.userimage.split('/storage/');
      return imageUrlParts.length > 1 ? imageUrlParts[1] : this.userimage;
    }
    return 'images/user.jpeg'; 
  }
  

  setRegister(userData: FormData): Observable<any> {
    return this._HttpClient.post(`${this.baseURL}/register`, userData);
  }

  setLogin(userData: FormData): Observable<any> {
    return this._HttpClient.post(`${this.baseURL}/login`, userData);
  }

  setforget(userData: FormData): Observable<any> {
    return this._HttpClient.post(`${this.baseURL}/forgot-password`, userData);
  }

  setreset(userData: FormData): Observable<any> {
    return this._HttpClient.post(`${this.baseURL}/reset-password`, userData);
  }

  logout(): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No access token found.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this._HttpClient.post(`${this.baseURL}/logout`, {}, { headers }).subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        // localStorage.removeItem('eToken');
        localStorage.removeItem('access_token');
        this.isAuthenticatedSubject.next(false); // Emit false on logout
        this._Router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }

  // private checkToken(): boolean {
  //   return !!localStorage.getItem('access_token');
  // }
  getProfile(): Observable<any> {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.error('No access token found.');
    
      return throwError(() => new Error('No access token found.'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/profile`, { headers });
  }

  private checkToken(): boolean {
    return !!localStorage.getItem('access_token');
  }
  updateProfile(userData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError(() => new Error('No access token found.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    
    userData.append('_method', 'PUT');

    return this._HttpClient.post(`${this.baseURL}/profile`, userData, { headers });
  }
}

