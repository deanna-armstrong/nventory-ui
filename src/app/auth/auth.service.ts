import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router }     from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap }        from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Shape of the authenticated user object stored in this service.
 */
export interface User {
  email: string;
  role: string;
}

/**
 * AuthService
 *
 * Manages user authentication state and interacts with the API for
 * registration, login, and logout flows. Exposes an observable for
 * components to react to user state changes.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Base URL for API endpoints, from environment config */
  private apiUrl = environment.apiUrl;

  /**
   * Internal subject holding the current user, or null if not logged in.
   * BehaviorSubject replays the last value to new subscribers.
   */
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  /**
   * Public observable for other parts of the app to subscribe to
   * and react when the user logs in or out.
   */
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // On service init, attempt to hydrate user state from localStorage
    this.loadUserFromStorage();
  }

  /**
   * Registers a new user via POST /auth/register.
   * On success, stores the session and navigates to the dashboard.
   *
   * @param userData - email, password, and role for the new account
   */
  register(userData: { email: string; password: string; role: string }): Observable<any> {
    return this.http
      .post<{ access_token: string }>(
        `${this.apiUrl}/auth/register`,
        userData,
      )
      .pipe(
        tap(res => {
          if (res.access_token) {
            // Persist session and update internal state
            this.setSession(userData.email, userData.role, res.access_token);
            // Redirect to the main application page
            this.router.navigate(['/dashboard']);
          }
        }),
      );
  }

  /**
   * Logs in an existing user via POST /auth/login.
   * On success, stores the session and navigates to the dashboard.
   *
   * @param credentials - email and password for authentication
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post<{ access_token: string; user: User }>(
        `${this.apiUrl}/auth/login`,
        credentials,
      )
      .pipe(
        tap(res => {
          if (res.access_token && res.user) {
            // Persist session and update internal state
            this.setSession(res.user.email, res.user.role, res.access_token);
            // Redirect to the main application page
            this.router.navigate(['/dashboard']);
          }
        }),
      );
  }

  /**
   * Clears session data from storage and subject, then navigates
   * the user back to the login page.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    // Emit null to signal logged-out state
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Checks whether a valid token exists in localStorage.
   * @returns true if logged in, false otherwise
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  /** Alias for isAuthenticated, used by route guards */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Determines if the current user has an admin role.
   * @returns true if user's role is 'admin'
   */
  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  /**
   * Internal helper to persist session details to localStorage
   * and update the currentUserSubject.
   */
  private setSession(email: string, role: string, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    this.currentUserSubject.next({ email, role });
  }

  /**
   * Attempts to load an existing session from localStorage on startup.
   * If all pieces are present, updates the BehaviorSubject accordingly.
   */
  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const role  = localStorage.getItem('userRole');
    if (token && email && role) {
      this.currentUserSubject.next({ email, role });
    }
  }
}
