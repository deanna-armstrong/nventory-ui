import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './not-authorized.component.html',
})
export class NotAuthorizedComponent {}
