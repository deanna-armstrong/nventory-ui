import { Routes } from '@angular/router';

import { LandingComponent }        from './pages/landing/landing.component';
import { DashboardComponent }      from './pages/dashboard/dashboard.component';
import { InventoryListComponent }  from './pages/inventory-list/inventory-list.component';
import { InventoryFormComponent }  from './pages/inventory-form/inventory-form.component';
import { LoginComponent }          from './pages/login/login.component';
import { RegisterComponent }       from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NotAuthorizedComponent }  from './pages/not-authorized/not-authorized.component';

import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },

  { path: 'login',           component: LoginComponent },
  { path: 'register',        component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'not-authorized',  component: NotAuthorizedComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'items',
    component: InventoryListComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'add',
    component: InventoryFormComponent,
    canActivate: [AuthGuard],
    data: { adminOnly: true }
  },
  {
    path: 'edit/:id',
    component: InventoryFormComponent,
    canActivate: [AuthGuard],
    data: { adminOnly: true }
  },

  { path: '**', redirectTo: '' }
];
