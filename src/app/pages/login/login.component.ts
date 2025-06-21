// src/app/pages/login/login.component.ts

import { Component }          from '@angular/core';
// Core Angular decorator for defining components

import { RouterModule }       from '@angular/router';
// Provides routerLink and navigation capabilities in the template

import { CommonModule }       from '@angular/common';
// Common directives like *ngIf and *ngFor

import { FormsModule }        from '@angular/forms';
// Enables template-driven forms and ngModel two-way binding

import { MatCardModule }      from '@angular/material/card';
// Material card container for the login form

import { MatFormFieldModule } from '@angular/material/form-field';
// Material form-field wrapper for inputs

import { MatInputModule }     from '@angular/material/input';
// Material-styled input controls

import { MatButtonModule }    from '@angular/material/button';
// Material-styled buttons

import { AuthService }        from '../../auth/auth.service';
// Centralized authentication service for login API calls

@Component({
  selector: 'app-login',               // Tag name to embed this component
  standalone: true,                    // Declares this as a standalone component
  imports: [
    RouterModule,                      // Enables routerLink usage
    CommonModule,                      // Common Angular directives
    FormsModule,                       // ngModel for form inputs
    MatCardModule,                     // <mat-card>
    MatFormFieldModule,                // <mat-form-field>
    MatInputModule,                    // <input matInput>
    MatButtonModule,                   // <button mat-raised-button>
  ],
  templateUrl: './login.component.html',
  // External HTML template defining form layout and bindings
})
export class LoginComponent {
  /** Bound to the email input field via [(ngModel)] */
  email = '';

  /** Bound to the password input field via [(ngModel)] */
  password = '';

  constructor(private auth: AuthService) {
    // Injects the AuthService for performing login operations
  }

  /**
   * Triggered when the user submits the login form.
   * - Validates that both email and password are provided.
   * - Calls AuthService.login() to authenticate.
   * - Handles errors by showing an alert with the failure message.
   */
  login() {
    // Simple front-end validation
    if (!this.email || !this.password) {
      alert('Email and password are required');
      return;
    }

    // Attempt to authenticate with the API
    this.auth.login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          // On success, AuthService will redirect (handled internally)
        },
        error: err => {
          // Show a descriptive error message to the user
          const msg = err.error?.message || err.statusText;
          alert('Login failed: ' + msg);
        }
      });
  }
}
