import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  register(userData: { email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      tap((res: any) => {
        if (res?.access_token) {
          localStorage.setItem('token', res.access_token);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        if (res?.access_token) {
          localStorage.setItem('token', res.access_token);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
