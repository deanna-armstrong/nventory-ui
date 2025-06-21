import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';         // Enables routerLink directives
import { MatToolbarModule } from '@angular/material/toolbar'; // Provides <mat-toolbar>
import { MatButtonModule }  from '@angular/material/button';  // Provides <button mat-button>
import { CommonModule }     from '@angular/common';      // Common directives (ngIf, ngFor)
import { AuthService, User } from '../../auth/auth.service'; // Auth state & User interface
import { Observable }       from 'rxjs';                 // Observable type for async streams

@Component({
  selector: 'app-header',          // Tag to embed this header component
  standalone: true,                // Uses standalone component API instead of NgModule
  imports: [
    CommonModule,                  // Needed for structural directives
    MatToolbarModule,              // Material toolbar styling
    MatButtonModule,               // Material button styling
    RouterModule,                  // For navigation via routerLink
  ],
  templateUrl: './header.component.html', // External HTML template
  styleUrls: ['./header.component.css'],  // External CSS styles
})
export class HeaderComponent {
  /** Observable emitting the current authenticated user or null */
  user$!: Observable<User | null>;

  constructor(private auth: AuthService) {
    // Initialize user$ by subscribing to the AuthService’s BehaviorSubject
    this.user$ = this.auth.currentUser$;
  }

  /**
   * Invoked by the Logout button.
   * Delegates session clearing and redirection to AuthService.
   */
  logout(): void {
    this.auth.logout();
  }
}
