// src/app/pages/inventory-list/inventory-list.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
// Core Angular decorators and lifecycle interfaces

import { HttpClient }                   from '@angular/common/http';
// For making HTTP requests to the API

import { Router, RouterModule }         from '@angular/router';
// Router for navigation and RouterModule for routerLink usage

import { CommonModule }                 from '@angular/common';
// Provides common directives (ngIf, ngFor, etc.)

import { FormsModule }                  from '@angular/forms';
// Enables template-driven forms (ngModel)

import { MatToolbarModule }             from '@angular/material/toolbar';
// Material toolbar for layout

import { MatButtonModule }              from '@angular/material/button';
// Material buttons

import { MatFormFieldModule }           from '@angular/material/form-field';
// Material form field wrapper

import { MatInputModule }               from '@angular/material/input';
// Material input controls

import { MatCardModule }                from '@angular/material/card';
// Material card container

import { Subject }                      from 'rxjs';
// RxJS Subject for managing component teardown

import { takeUntil }                    from 'rxjs/operators';
// Operator to auto-unsubscribe on destroy

import { API_BASE_URL }                 from '../../services/api-config';
// Base URL constant for API endpoints

import { AuthService }                  from '../../auth/auth.service';
// Centralized auth service for session and role

import { HeaderComponent }              from '../../layout/header/header.component';
// Reusable header component

import { FooterComponent }              from '../../layout/footer/footer.component';
// Reusable footer component

@Component({
  selector: 'app-inventory-list',
  standalone: true,      // Declares this as a standalone component
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './inventory-list.component.html',
})
export class InventoryListComponent implements OnInit, OnDestroy {
  /** Full list of inventory items returned from the API */
  inventoryList: any[] = [];

  /** Current filtered list based on the search query */
  filteredInventory: any[] = [];

  /** Bound to the search input for filtering by name/description */
  searchQuery = '';

  /** Stores the current user’s role; null until first auth emission */
  private role: string | null = null;

  /** Emits a value on component destroy to complete subscriptions */
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,       // For API calls
    private router: Router,         // For navigation if needed
    private auth: AuthService       // To retrieve user role and logout
  ) {}

  // -------------------------------------------------------------------------
  // Lifecycle hooks
  // -------------------------------------------------------------------------

  ngOnInit(): void {
    // Subscribe to auth state to track user role for admin-only actions
    this.auth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.role = user?.role ?? null;
      });

    // Fetch the inventory data on component init
    this.fetchInventory();
  }

  ngOnDestroy(): void {
    // Trigger completion of any active subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  // -------------------------------------------------------------------------
  // Data access methods
  // -------------------------------------------------------------------------

  /**
   * Fetches all inventory items from the API and initializes the lists.
   * Uses the API_BASE_URL constant and handles errors gracefully.
   */
  private fetchInventory(): void {
    this.http.get<any[]>(`${API_BASE_URL}/inventory`).subscribe({
      next: data => {
        this.inventoryList = data;
        // Initialize filtered list to show all on first load
        this.filteredInventory = [...data];
      },
      error: err => {
        console.error('Error fetching inventory:', err);
        // On error, clear any existing lists to avoid stale data
        this.inventoryList = [];
        this.filteredInventory = [];
      }
    });
  }

  // -------------------------------------------------------------------------
  // UI helper methods
  // -------------------------------------------------------------------------

  /**
   * Filters the inventoryList based on the searchQuery.
   * Performs a case-insensitive match on 'name' and 'description'.
   */
  searchInventory(): void {
    const q = this.searchQuery.trim().toLowerCase();
    this.filteredInventory = this.inventoryList.filter(item =>
      item.name?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }

  /**
   * Deletes an item by ID, only if the current user is admin and confirms the action.
   * Updates both the master and filtered lists on success.
   */
  deleteItem(id: string): void {
    // Prevent deletion if not admin or user cancels the confirmation dialog
    if (!this.isAdmin() || !confirm('Delete this item?')) {
      return;
    }

    // Call DELETE endpoint and update lists on success
    this.http.delete(`${API_BASE_URL}/inventory/${id}`).subscribe({
      next: () => {
        this.inventoryList = this.inventoryList.filter(i => i._id !== id);
        this.filteredInventory = this.filteredInventory.filter(i => i._id !== id);
      },
      error: err => console.error('Delete failed:', err)
    });
  }

  /** True if the current user has the 'admin' role */
  isAdmin(): boolean {
    return this.role === 'admin';
  }

  /** Logs out the user and redirects to the login page */
  logout(): void {
    this.auth.logout();
  }
}
