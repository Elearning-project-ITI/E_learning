import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, catchError } from 'rxjs';
interface userAuth {
  user :any
 }
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  userToken: any;
  constructor(private _HttpClient: HttpClient,private _Router:Router) {}
  saveUserData() {
    const token = localStorage.getItem('eToken');
    if (token != null) {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      this.userData = decodedToken;
      const accessToken = decodedToken?.access_token;
  
      if (accessToken) {
        this.userToken = accessToken;
        localStorage.setItem('access_token', this.userToken);
        console.log('Access Token Saved:', this.userToken);
      } else {
        console.error('Access token not found in decoded JWT');
      }
    }
  }
  setRegister(userData: FormData): Observable<any> {
    return this._HttpClient.post(`http://0.0.0.0:8000/api/register`, userData);
  }
  setLogin(userData: FormData): Observable<any> {
    return this._HttpClient.post(`http://0.0.0.0:8000/api/login`, userData);
  }
  setforget(userData: FormData): Observable<any> {
    return this._HttpClient.post(`http://0.0.0.0:8000/api/forgot-password`, userData);
  }
  setreset(userData:FormData): Observable<any> {
   
      return this._HttpClient.post(`http://0.0.0.0:8000/api/reset-password`, userData);
   
  }
  logOut():void{
   localStorage.removeItem("eToken");
   localStorage.removeItem("access_token");
   this._Router.navigate(['/login'])
  }

 
}
