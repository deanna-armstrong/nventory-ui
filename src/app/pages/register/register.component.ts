import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  email = '';
  password = '';
  role = 'user';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    if (!this.email || !this.password) {
      alert('Email and password are required');
      return;
    }

    this.authService.register({
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: (response) => {
        alert('Registration successful! Redirecting to login...');
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 409 || (err.error?.message?.includes('exists') || err.error?.errmsg?.includes('duplicate key'))) {
          alert('This email is already registered.');
        } else {
          alert('Registration failed: ' + (err.error?.message || err.statusText));
        }
      }
    });
  }
}
