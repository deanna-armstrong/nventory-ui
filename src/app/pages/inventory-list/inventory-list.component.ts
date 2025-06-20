import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { API_BASE_URL } from '../../services/api-config';       // keep if this constant exists
import { AuthService } from '../../auth/auth.service';          // unified AuthService
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
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
    FooterComponent
  ],
  templateUrl: './inventory-list.component.html'
})
export class InventoryListComponent implements OnInit, OnDestroy {
  inventoryList: any[] = [];
  filteredInventory: any[] = [];
  searchQuery = '';

  /** Current user role (null until first emission) */
  private role: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  // -------------------------------------------------------------------------
  //  Lifecycle
  // -------------------------------------------------------------------------
  ngOnInit(): void {
    /* Reactively track the logged‑in user */
    this.auth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => (this.role = user?.role ?? null));

    this.fetchInventory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // -------------------------------------------------------------------------
  //  Data access
  // -------------------------------------------------------------------------
  private fetchInventory(): void {
    this.http.get<any[]>(`${API_BASE_URL}/inventory`).subscribe({
      next: data => {
        this.inventoryList = data;
        this.filteredInventory = [...data];
      },
      error: err => {
        console.error('Error fetching inventory:', err);
        this.inventoryList = [];
        this.filteredInventory = [];
      }
    });
  }

  // -------------------------------------------------------------------------
  //  UI helpers
  // -------------------------------------------------------------------------
  searchInventory(): void {
    const q = this.searchQuery.trim().toLowerCase();
    this.filteredInventory = this.inventoryList.filter(
      item =>
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }

  deleteItem(id: string): void {
    if (!this.isAdmin() || !confirm('Delete this item?')) return;

    this.http.delete(`${API_BASE_URL}/inventory/${id}`).subscribe({
      next: () => {
        this.inventoryList = this.inventoryList.filter(i => i._id !== id);
        this.filteredInventory = this.filteredInventory.filter(i => i._id !== id);
      },
      error: err => console.error('Delete failed:', err)
    });
  }

  /** True when the current user has the admin role */
  isAdmin(): boolean {
    return this.role === 'admin';
  }

  logout(): void {
    this.auth.logout();
  }
}
