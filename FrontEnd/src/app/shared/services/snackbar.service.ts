// src/app/services/snackbar.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar,MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showMessage(message: string, duration: number = 10000) {
    console.log(message)
    const config: MatSnackBarConfig = {
        duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top', // Add custom class
    };
    this.snackBar.open(message, 'Close', config);

  }
}
