import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../auth/auth.service';

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

  constructor(private authService: AuthService) {}

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
      error: () => alert('Registration failed. Try a different email or check your connection.')
    });
  }
}
