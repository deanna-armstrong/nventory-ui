import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  register(userData: { email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      tap((res: any) => {
        if (res?.access_token) {
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('userEmail', userData.email);
          localStorage.setItem('userRole', userData.role);
          this.currentUserSubject.next({ email: userData.email, role: userData.role });
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
          const email = credentials.email;
          const role = res.user?.role || 'user';

          localStorage.setItem('userEmail', email);
          localStorage.setItem('userRole', role);

          this.currentUserSubject.next({ email, role });
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private loadUserFromStorage() {
    const token = this.getToken();
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');

    if (token && email && role) {
      this.currentUserSubject.next({ email, role });
    }
  }
}
