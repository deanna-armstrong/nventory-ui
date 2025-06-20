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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  register(userData: { email: string; password: string; role: string }): Observable<any> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap(res => {
        if (res.access_token) {
          this.setSession(userData.email, userData.role, res.access_token);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ access_token: string; user: User }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (res.access_token && res.user) {
          this.setSession(res.user.email, res.user.role, res.access_token);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  // alias for your guard
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  private setSession(email: string, role: string, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    this.currentUserSubject.next({ email, role });
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const role  = localStorage.getItem('userRole');
    if (token && email && role) {
      this.currentUserSubject.next({ email, role });
    }
  }
}
