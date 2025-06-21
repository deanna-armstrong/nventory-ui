// src/app/pages/landing/landing.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
// Component decorator and lifecycle interfaces

import { RouterModule, Router }         from '@angular/router';
// RouterModule for routerLink in template, Router for navigation

import { CommonModule }                 from '@angular/common';
// Provides common directives like *ngIf, *ngFor

import { MatButtonModule }              from '@angular/material/button';
// Material-styled buttons

import { AuthService, User }            from '../../auth/auth.service';
// AuthService for current user stream, User interface for typing

import { Subscription }                 from 'rxjs';
// Subscription to manage observable teardown

@Component({
  selector: 'app-landing',              // Tag used to embed this component
  standalone: true,                     // Declares this as a standalone component
  imports: [
    CommonModule,                       // Enables common Angular directives
    RouterModule,                       // Enables navigation via routerLink & Router
    MatButtonModule                     // Enables Material buttons
  ],
  templateUrl: './landing.component.html',  // External HTML template
  styleUrls: ['./landing.component.css']    // External CSS styles
})
export class LandingComponent implements OnInit, OnDestroy {
  /** Subscription to redirect logged-in users away from landing page */
  private sub!: Subscription;

  constructor(
    public auth: AuthService,           // Exposes auth state to template if needed
    private router: Router              // Router for programmatic navigation
  ) {}

  /**
   * OnInit lifecycle hook:
   * Subscribes to the currentUser$ stream and auto-navigates
   * to '/dashboard' if a user is already logged in.
   */
  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe(user => {
      if (user) {
        // Redirect authenticated users to the dashboard
        this.router.navigate(['/dashboard']);
      }
    });
  }

  /** Navigate to the login page when invoked from the template */
  goLogin(): void {
    this.router.navigate(['/login']);
  }

  /** Navigate to the registration page when invoked from the template */
  goRegister(): void {
    this.router.navigate(['/register']);
  }

  /**
   * OnDestroy lifecycle hook:
   * Unsubscribes from the currentUser$ observable to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
