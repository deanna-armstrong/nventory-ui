import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://localhost:3000/auth/login', {
      email: this.email,
      password: this.password,
    }).subscribe(response => {
      const token = response.access_token;
      localStorage.setItem('token', token);

      const decoded: any = jwtDecode(token);
      const role = decoded.role;
      localStorage.setItem('role', role);

      this.router.navigate(['/']);
    }, error => {
      alert('Login failed');
    });
  }
}
