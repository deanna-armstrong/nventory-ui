import { Routes } from '@angular/router';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryFormComponent } from './inventory-form/inventory-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'items', component: InventoryListComponent },
  { path: 'add', component: InventoryFormComponent },
  { path: 'edit/:id', component: InventoryFormComponent }
];
