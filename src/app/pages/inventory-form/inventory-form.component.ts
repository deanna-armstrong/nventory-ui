// src/app/pages/inventory-form/inventory-form.component.ts

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// Component decorator, lifecycle interface, and encapsulation modes

import { ActivatedRoute, Router } from '@angular/router';
// ActivatedRoute to read route params, Router for navigation

import { CommonModule }            from '@angular/common';
// Provides common directives like *ngIf and *ngFor

import { FormsModule }             from '@angular/forms';
// Enables template-driven forms with ngModel

import { MatCardModule }           from '@angular/material/card';
// Material card container for the form

import { MatFormFieldModule }      from '@angular/material/form-field';
// Material form-field wrapper for inputs

import { MatInputModule }          from '@angular/material/input';
// Material-styled input controls

import { MatButtonModule }         from '@angular/material/button';
// Material-styled buttons

import { HeaderComponent }         from '../../layout/header/header.component';
// Reusable header UI component

import { FooterComponent }         from '../../layout/footer/footer.component';
// Reusable footer UI component

import {
  InventoryService,
  InventoryItem
} from '../../services/inventory.service';
// Service to fetch/create/update inventory items and InventoryItem interface

import { NotificationsService }    from '../../services/notifications.service';
// Service to send in-app notifications to the user

@Component({
  selector: 'app-inventory-form',
  standalone: true,                 // Declares this as standalone (no NgModule)
  encapsulation: ViewEncapsulation.None,
  // Disables style encapsulation so CSS in this component applies globally

  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HeaderComponent,
    FooterComponent,
  ],
  // HTML template defining the form layout
  templateUrl: './inventory-form.component.html',
})
export class InventoryFormComponent implements OnInit {
  /**
   * The inventory item bound to the form.
   * Initialized with default values for the "Add" scenario.
   */
  item: InventoryItem = {
    name: '',
    description: '',
    quantity: 0,
    reorderThreshold: 5,
    location: ''
  };

  /** Flag indicating whether we’re editing an existing item (true) or creating a new one (false). */
  isEdit = false;

  constructor(
    private inventorySvc: InventoryService,
    // Service dependency to load, create, and update inventory items

    private notifSvc: NotificationsService,
    // Service dependency to push notifications on success/failure

    private router: Router,
    // Router for programmatic navigation after save

    private route: ActivatedRoute
    // ActivatedRoute to inspect URL parameters for edit mode
  ) {}

  /**
   * Lifecycle hook that runs after component initialization.
   * Checks for an 'id' route parameter to switch into edit mode and load the item.
   */
  ngOnInit(): void {
    // Retrieve 'id' from the URL (e.g. /items/edit/:id)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true; // Switch to edit mode
      // Fetch existing item details for editing
      this.inventorySvc.getById(id).subscribe(
        data => (this.item = data),
        err => console.error('Failed to load item', err)
      );
    }
  }

  /**
   * Handler for the form submit event.
   * - If editing, calls updateInventory() and notifies on success.
   * - If creating, calls createInventory() and notifies on success.
   * - In both cases, navigates back to the items list on success.
   */
  saveItem() {
    if (this.isEdit && this.item._id) {
      // Update existing item
      this.inventorySvc.updateInventory(this.item._id, this.item).subscribe(
        updated => {
          // Notify user of successful update
          this.notifSvc.notify('Item updated', {
            body: `Updated ${updated.name} (Qty: ${updated.quantity})`
          });
          // Redirect back to the inventory list view
          this.router.navigate(['/items']);
        },
        err => console.error('Update failed', err)
      );
    } else {
      // Create a new item
      this.inventorySvc.createInventory(this.item).subscribe(
        created => {
          // Notify user of successful creation
          this.notifSvc.notify('Item created', {
            body: `${created.name} added to inventory`
          });
          // Redirect back to the inventory list view
          this.router.navigate(['/items']);
        },
        err => console.error('Create failed', err)
      );
    }
  }

  /**
   * Utility method used in the template to conditionally display
   * the form only to admin users.
   * Ideally, this logic would live in an AuthService or guard.
   */
  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role === 'admin';
  }
}
