// src/app/app.routes.ts

import { Routes } from '@angular/router';

import { LandingComponent }        from './pages/landing/landing.component';
import { DashboardComponent }      from './pages/dashboard/dashboard.component';
import { InventoryListComponent }  from './pages/inventory-list/inventory-list.component';
import { InventoryFormComponent }  from './pages/inventory-form/inventory-form.component';
import { LoginComponent }          from './pages/login/login.component';
import { RegisterComponent }       from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NotAuthorizedComponent }  from './pages/not-authorized/not-authorized.component';

import { AuthGuard }  from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

/**
 * Application route definitions.
 * Each route maps a URL path to a standalone component, with optional guards for access control.
 */
export const routes: Routes = [
  // Public landing page
  { path: '', component: LandingComponent },

  // Authentication-related pages (public)
  { path: 'login',           component: LoginComponent },
  { path: 'register',        component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'not-authorized',  component: NotAuthorizedComponent },

  // Protected dashboard: requires user to be logged in
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  // Protected inventory list: requires authentication
  {
    path: 'items',
    component: InventoryListComponent,
    canActivate: [AuthGuard],
  },

  // Add item form: only accessible to authenticated admins
  {
    path: 'add',
    component: InventoryFormComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Edit item form: requires an item ID param and admin privileges
  {
    path: 'edit/:id',
    component: InventoryFormComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Wildcard route: redirects any unknown paths to the landing page
  { path: '**', redirectTo: '' },
];
