import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule,RouterModule,RouterLink,RouterLinkActive],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {
  verificationMessage: string = '';
  isVerified: boolean = false;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.verifyEmail(token);
    } else {
      this.verificationMessage = 'No token provided.';
      this.isLoading = false;
    }
  }

  verifyEmail(token: string): void {
    const url = `http://0.0.0.0:8000/api/verify-email?token=${token}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.verificationMessage = response.message || 'Email verified successfully!';
          this.isVerified = true;
        } else {
          this.verificationMessage = 'Email verification failed. Please try again.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.verificationMessage = 'An error occurred during email verification.';
        console.error('Verification error:', err);
      },
    });
  }
  goToLogin(): void {
    this.router.navigate(['/login']); 
  }
}
