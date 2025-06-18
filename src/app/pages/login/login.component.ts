import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/auth.service';

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
    MatButtonModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  login() {
    if (!this.email || !this.password) {
      alert('Email and password are required');
      return;
    }

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      error: (err) => {
        alert('Login failed: ' + (err.error?.message || err.statusText));
      }
    });
  }
}
