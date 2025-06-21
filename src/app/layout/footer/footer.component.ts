import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';         // For routerLink directives in template
import { MatToolbarModule } from '@angular/material/toolbar'; // Angular Material toolbar component
import { MatButtonModule }  from '@angular/material/button';  // Angular Material button component
import { CommonModule }     from '@angular/common';      // Common directives (ngIf, ngFor, etc.)
import { AuthService, User } from '../../auth/auth.service'; // Service for auth state and User interface
import { Observable }       from 'rxjs';                 // Observable type for async data streams

@Component({
  selector: 'app-footer',           // Tag used to render this footer component
  standalone: true,                 // Allows use without declaring in an NgModule
  imports: [
    CommonModule,                   // Enables common Angular directives
    MatToolbarModule,               // Provides <mat-toolbar> for the footer bar
    MatButtonModule,                // Provides <button mat-button> styling
    RouterModule                    // Enables routerLink for navigation within toolbar
  ],
  templateUrl: './footer.component.html', // External HTML template file
  styleUrls: ['./footer.component.css'],  // External CSS file for styling
})
export class FooterComponent {
  /** Observable of the current user; emits null if not logged in */
  user$!: Observable<User | null>;

  constructor(private auth: AuthService) {
    // Initialize user$ to the currentUser$ BehaviorSubject from AuthService
    this.user$ = this.auth.currentUser$;
  }

  /**
   * Logs the user out by clearing session data and redirects to login.
   * Delegates to AuthService.logout() for the logic.
   */
  logout(): void {
    this.auth.logout();
  }
}
