import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

export interface InventoryItem {
  _id?: string;               // Mongo ID
  name: string;
  description: string;
  quantity: number;
  reorderThreshold: number;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private base = `${API_BASE_URL}/inventory`;

  constructor(private http: HttpClient) {}

  /** Fetch all inventory items */
  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.base);
  }

  /** Fetch one item by ID */
  getById(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.base}/${id}`);
  }

  /** Create a brand-new item */
  createInventory(data: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.base, data);
  }

  /** Update an existing item */
  updateInventory(id: string, data: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.base}/${id}`, data);
  }

  /** Delete an item */
  deleteInventory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  /** Get urgent & warning restock suggestions */
  getRestockSuggestions(): Observable<{ urgent: InventoryItem[]; warning: InventoryItem[] }> {
    return this.http.get<{ urgent: InventoryItem[]; warning: InventoryItem[] }>(
      `${this.base}/restock-suggestions`
    );
  }
}
