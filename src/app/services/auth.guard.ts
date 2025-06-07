import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.auth.isLoggedIn()) {
      // send to login page
      return this.router.parseUrl('/login');
    }

    const adminOnly = route.data['adminOnly'] === true;
    if (adminOnly) {
      const role = localStorage.getItem('role');
      if (role !== 'admin') {
        return this.router.parseUrl('/not-authorized');
      }
    }

    // 3) All good!
    return true;
  }
}

