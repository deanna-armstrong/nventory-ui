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
    MatCardModule
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

  fetchInventory() {
    this.http.get<any[]>('http://localhost:3000/inventory').subscribe(data => {
      this.inventoryList = data;
      this.filteredInventory = data;
    });
  }

  searchInventory() {
    const query = this.searchQuery.toLowerCase();
    this.filteredInventory = this.inventoryList.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  }

  deleteItem(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    this.http.delete(`http://localhost:3000/inventory/${id}`).subscribe(() => {
      this.inventoryList = this.inventoryList.filter(item => item._id !== id);
      this.filteredInventory = this.filteredInventory.filter(item => item._id !== id);
    });
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}
