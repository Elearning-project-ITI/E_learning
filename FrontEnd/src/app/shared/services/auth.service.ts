import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient: HttpClient) {}

  setRegister(userData: FormData): Observable<any> {
    return this._HttpClient.post(`http://0.0.0.0:8000/api/register`, userData);
  }
}
