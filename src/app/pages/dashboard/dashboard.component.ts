// src/app/pages/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';  
import { CommonModule }      from '@angular/common';  
import { RouterModule }      from '@angular/router';  
import { MatSidenavModule }  from '@angular/material/sidenav';  
import { MatToolbarModule }  from '@angular/material/toolbar';  
import { MatListModule }     from '@angular/material/list';  
import { MatIconModule }     from '@angular/material/icon';  
import { MatButtonModule }   from '@angular/material/button';  
import { MatCardModule }     from '@angular/material/card';  
import { MatDividerModule }  from '@angular/material/divider';  
import { MatFormFieldModule} from '@angular/material/form-field';  
import { MatInputModule }    from '@angular/material/input';  
import { FormsModule }       from '@angular/forms';  

import { HeaderComponent } from '../../layout/header/header.component';  
import { FooterComponent } from '../../layout/footer/footer.component';  

import { InventoryService, InventoryItem } from '../../services/inventory.service';  
import {  
  NotificationsService,  
  AppNotification  
} from '../../services/notifications.service';  
import { Observable } from 'rxjs';  

/**
 * DashboardComponent
 * 
 * Displays summary cards for urgent & warning restock items,
 * recent notifications, and allows searching the inventory.
 * Integrates HeaderComponent and FooterComponent for consistent layout.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,         // For common directives (ngIf, ngFor)
    RouterModule,         // Enables routerLink in template
    MatSidenavModule,     // Material side nav (if used in future)
    MatToolbarModule,     // For toolbar layout
    MatListModule,        // For list styling
    MatIconModule,        // For icons in lists/buttons
    MatButtonModule,      // For Material buttons
    MatCardModule,        // For summary cards
    MatDividerModule,     // For <mat-divider> separators
    MatFormFieldModule,   // For input form fields
    MatInputModule,       // For <input matInput>
    FormsModule,          // For ngModel two-way binding
    HeaderComponent,      // App header for navigation
    FooterComponent,      // App footer for navigation
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  /** Search input model for inventory search */
  searchQuery = '';

  /** Filtered results after performing a search */
  filteredInventory: InventoryItem[] = [];

  /** All inventory items loaded on init */
  allInventory: InventoryItem[] = [];

  /** Flag to show/hide search results section */
  searchPerformed = false;  

  /** Stream of notifications to display */
  notifications$: Observable<AppNotification[]>;

  /** Lists for restock suggestion cards */
  urgentItems: InventoryItem[] = [];
  warningItems: InventoryItem[] = [];

  constructor(
    private notificationsService: NotificationsService,  // To push/read notifications
    private inventoryService: InventoryService           // To fetch inventory data
  ) {
    // Subscribe to the notifications BehaviorSubject
    this.notifications$ = this.notificationsService.notifications$;
  }

  /**
   * OnInit lifecycle hook:
   * - Loads full inventory list and triggers a notification
   * - Loads restock suggestions (urgent & warning) and logs them
   */
  ngOnInit() {
    // Fetch all inventory items from API
    this.inventoryService.getInventory().subscribe(
      data => {
        this.allInventory = data;
        console.log('All Inventory:', this.allInventory);

        // Notify that inventory has been loaded successfully
        this.notificationsService.notify('Inventory loaded', {
          body: `Dashboard connected to ${this.allInventory.length} inventory items.`
        });
      },
      err => {
        console.error('Failed loading inventory', err);
        // Notify about the failure
        this.notificationsService.notify('Inventory load failed', {
          body: err.message || 'Unknown error'
        });
      }
    );

    // Fetch restock suggestions for summary cards
    this.inventoryService.getRestockSuggestions().subscribe(
      data => {
        this.urgentItems = data.urgent;
        this.warningItems = data.warning;
        console.log('Urgent:', this.urgentItems);
        console.log('Warning:', this.warningItems);
      },
      err => {
        console.error('Failed loading restock suggestions', err);
        // Notify about the failure
        this.notificationsService.notify('Restock suggestions failed', {
          body: err.message || 'Unknown error'
        });
      }
    );
  }

  /**
   * Filters the allInventory array based on the search query.
   * Performs a case-insensitive substring match on name & description.
   * Sets searchPerformed to true to reveal the results section.
   */
  searchInventory() {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredInventory = this.allInventory.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
    this.searchPerformed = true;
  }
}
