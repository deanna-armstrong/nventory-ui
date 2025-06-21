// src/app/pages/register/register.component.ts

import { Component }             from '@angular/core';
// Common directives like ngIf, ngFor
import { CommonModule }          from '@angular/common';
// Enables template-driven forms with ngModel
import { FormsModule }           from '@angular/forms';
// Material card container for the form
import { MatCardModule }         from '@angular/material/card';
// Material form-field wrapper
import { MatFormFieldModule }    from '@angular/material/form-field';
// Material-styled input controls
import { MatInputModule }        from '@angular/material/input';
// Material-styled buttons
import { MatButtonModule }       from '@angular/material/button';
// Material select dropdown for roles
import { MatSelectModule }       from '@angular/material/select';

import { AuthService }           from '../../auth/auth.service';
// Authentication service to call the register endpoint

@Component({
  selector: 'app-register',       // Tag name to use this component
  standalone: true,               // Declares this as a standalone component
  imports: [
    CommonModule,                 // Common Angular directives
    FormsModule,                  // ngModel two-way binding
    MatCardModule,                // <mat-card> container
    MatFormFieldModule,           // <mat-form-field> wrapper
    MatInputModule,               // <input matInput>
    MatButtonModule,              // <button mat-raised-button>
    MatSelectModule,              // <mat-select> dropdown
  ],
  templateUrl: './register.component.html',
  // External template file containing the form markup
})
export class RegisterComponent {
  /** Bound to the email input field via [(ngModel)] */
  email = '';

  /** Bound to the password input field via [(ngModel)] */
  password = '';

  /** Bound to the role selection; defaults to 'user' */
  role = 'user';

  constructor(private auth: AuthService) {
    // Injects the AuthService to perform registration API calls
  }

  /**
   * Called when the registration form is submitted.
   * - Validates required fields (email & password).
   * - Calls AuthService.register() with the form data.
   * - Handles HTTP 409 conflict for existing email.
   */
  register() {
    // Front-end validation: ensure required fields are populated
    if (!this.email || !this.password) {
      alert('Email and password are required');
      return;
    }

    // Invoke the register API call
    this.auth
      .register({ email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: () => {
          // On success, AuthService navigates to dashboard internally
        },
        error: err => {
          // Show conflict message if the email is already registered
          if (err.status === 409) {
            alert('This email is already registered.');
          } else {
            // Generic error fallback
            const msg = err.error?.message || err.statusText;
            alert('Registration failed: ' + msg);
          }
        },
      });
  }
}
