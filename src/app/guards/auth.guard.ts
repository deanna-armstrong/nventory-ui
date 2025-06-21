import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   * Protects routes by ensuring the user is authenticated (and optionally an admin).
   * Redirects to /login if not logged in, preserving the returnUrl.
   * Redirects to /not-authorized if admin-only route is accessed by a non-admin.
   */
  constructor(
    private auth: AuthService,  // Service to check login status and role
    private router: Router,      // Router for navigation/redirection
  ) {}

  /**
   * Called by the router to determine if navigation to a route should be allowed.
   *
   * @param route - The target route snapshot, containing data and params
   * @param state - The current router state, used here to capture return URL
   * @returns `true` if allowed, `false` to cancel navigation (and redirect)
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree {
    // 1. Ensure the user is logged in
    if (!this.auth.isLoggedIn()) {
      // Not logged in → redirect to login, attach returnUrl for post-login redirect
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    // 2. Check for admin-only access if configured on the route's data
    const adminOnly = route.data['adminOnly'] === true;
    if (adminOnly && !this.auth.isAdmin()) {
      // Logged in but not an admin → redirect to not-authorized page
      this.router.navigate(['/not-authorized']);
      return false;
    }

    // 3. All checks passed → allow navigation
    return true;
  }
}
