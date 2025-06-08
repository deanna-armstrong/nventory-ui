import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { API_BASE_URL } from '../../services/api-config';
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
    FooterComponent,
  ],
  templateUrl: './inventory-list.component.html',
})
export class InventoryListComponent implements OnInit {
  inventoryList: any[] = [];
  filteredInventory: any[] = [];
  searchQuery = '';
  role: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.fetchInventory();
  }

  fetchInventory(): void {
    this.http.get<any[]>(`${API_BASE_URL}/inventory`).subscribe({
      next: (data) => {
        this.inventoryList = data;
        this.filteredInventory = [...data];
      },
      error: (err) => {
        console.error('Error fetching inventory:', err);
        this.inventoryList = [];
        this.filteredInventory = [];
      }
    });
  }

  searchInventory(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredInventory = this.inventoryList.filter(item =>
      item.name?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  }

  deleteItem(id: string): void {
    if (!confirm('Are you sure you want to delete this item?')) return;

    this.http.delete(`${API_BASE_URL}/inventory/${id}`).subscribe({
      next: () => {
        this.inventoryList = this.inventoryList.filter(item => item._id !== id);
        this.filteredInventory = this.filteredInventory.filter(item => item._id !== id);
      },
      error: (err) => {
        console.error('Delete failed:', err);
      }
    });
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
