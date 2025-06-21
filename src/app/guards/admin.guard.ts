import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  /**
   * Protects routes so only users with the 'admin' role can access them.
   * If the check fails, redirects the user to a “not-authorized” page.
   */
  constructor(
    private auth: AuthService,  // Service to check current user’s role
    private router: Router,      // Router for navigation/redirection
  ) {}

  /**
   * Called by the router to determine if navigation is allowed.
   * Returns `true` to allow activation, or a UrlTree to redirect otherwise.
   */
  canActivate(): boolean | UrlTree {
    // If the user’s role is 'admin', grant access
    if (this.auth.isAdmin()) {
      return true;
    }
    // Otherwise, redirect to the not-authorized page
    return this.router.parseUrl('/not-authorized');
  }
}
