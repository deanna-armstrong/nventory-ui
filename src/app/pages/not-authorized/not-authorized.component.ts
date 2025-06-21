// src/app/pages/not-authorized/not-authorized.component.ts

import { Component }        from '@angular/core';
// MatCardModule provides the Material card container for the message
import { MatCardModule }    from '@angular/material/card';
import { CommonModule }     from '@angular/common';
// CommonModule for common directives (e.g., ngIf, ngFor) if needed in template

@Component({
  selector: 'app-not-authorized',  // Tag to render this component
  standalone: true,                // Declares this as a standalone component
  imports: [
    CommonModule,                  // Enables common Angular directives
    MatCardModule,                 // Enables <mat-card> container
  ],
  templateUrl: './not-authorized.component.html',
  // External template file displaying the access-denied message
})
export class NotAuthorizedComponent {
  // This component is intentionally empty because it only renders static content.
}
