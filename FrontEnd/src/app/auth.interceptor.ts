import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
//import { SnackbarService } from './snackbar.service';
import { SnackbarService } from './shared/services/snackbar.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private snackbarService: SnackbarService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
            console.log("fmvkdfmv");
          this.snackbarService.showMessage('You must be logged in to access this resource.');
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}