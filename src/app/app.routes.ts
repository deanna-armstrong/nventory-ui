import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InventoryListComponent } from './pages/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './pages/inventory-form/inventory-form.component';
import { LoginComponent } from './pages/login/login.component';
import { NotAuthorizedComponent } from './pages/not-authorized/not-authorized.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'items', component: InventoryListComponent },
  { path: 'add', component: InventoryFormComponent },
  { path: 'edit/:id', component: InventoryFormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  
];
