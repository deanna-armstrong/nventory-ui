import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../../services/api-config';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.http
      .post<{ access_token: string; user: any }>(
        `${API_BASE_URL}/auth/login`,
        { email: this.email, password: this.password }
      )
      .subscribe({
        next: (response) => {
          const token = response.access_token;
          const user: User = {
            email: response.user.email,
            role: response.user.role,
          };
          this.authService.loginSuccess(user, token);

          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          alert('Login failed: ' + (err.error?.message || err.statusText));
        },
      });
  }
}
