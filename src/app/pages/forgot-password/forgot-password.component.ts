import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';              // Provides common directives like ngIf, ngFor
import { FormsModule } from '@angular/forms';                // Enables template-driven forms (ngModel)
import { MatCardModule } from '@angular/material/card';      // Material card container
import { MatFormFieldModule } from '@angular/material/form-field'; // Material form field styling
import { MatInputModule } from '@angular/material/input';    // Material input controls
import { MatButtonModule } from '@angular/material/button';  // Material buttons

@Component({
  selector: 'app-forgot-password',
  standalone: true, // Allows this component to be bootstrapped without an NgModule
  imports: [
    CommonModule,        // Common Angular directives
    FormsModule,         // ngModel two-way binding for form inputs
    MatCardModule,       // <mat-card> container
    MatFormFieldModule,  // <mat-form-field> wrapper for inputs
    MatInputModule,      // <input matInput> directive
    MatButtonModule,     // <button mat-raised-button>
  ],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  /** Bound to the email input for password recovery */
  email = '';

  /**
   * Handler for form submission.
   * In a real app, this would call an API endpoint to send recovery instructions.
   * Here it simply displays a confirmation alert with the user’s email.
   */
  recoverPassword() {
    alert(`Recovery instructions sent to ${this.email}`);
  }
}
