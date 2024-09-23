import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient: HttpClient) {}
  userData:any;
  saveUserData() {
    if(localStorage.getItem('eToken')!=null){
      let encodeToken:any =localStorage.getItem('eToken');
     let decodeToken= jwtDecode(encodeToken);
     this.userData=decodeToken;
     console.log(decodeToken)
    }
    
  }
  setRegister(userData: FormData): Observable<any> {
    return this._HttpClient.post(`http://0.0.0.0:8000/api/register`, userData);
  }
  setLogin(userData: FormData): Observable<any> {
    return this._HttpClient.post(`http://0.0.0.0:8000/api/login`, userData);
  }
  setforget(userData: FormData): Observable<any> {
    return this._HttpClient.post(`http://0.0.0.0:8000/api/forgetpassword`, userData);
  }
  setreset(userData: FormData): Observable<any> {
    return this._HttpClient.post(`http://0.0.0.0:8000/api/resetpassword`, userData);
  }
}


