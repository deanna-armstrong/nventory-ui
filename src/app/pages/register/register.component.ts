import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

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

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('http://localhost:3000/auth/register', {
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => alert('Registration failed')
    });
  }
}
