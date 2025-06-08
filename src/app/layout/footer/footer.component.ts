import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule }  from '@angular/material/button';
import { CommonModule }     from '@angular/common';        // <-- add this
import { AuthService, User } from '../../services/auth.service';
import { Observable }       from 'rxjs';

@Component({
  selector: 'app-footer',
   standalone: true,
  imports: [
    CommonModule, 
    MatToolbarModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {  public user$!: Observable<User | null>;

  constructor(private auth: AuthService) {
    this.user$ = this.auth.currentUser$;
  }

  logout(): void {
    this.auth.logout();
  }
}
