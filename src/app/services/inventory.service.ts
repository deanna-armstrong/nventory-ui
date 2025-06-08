import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

export interface InventoryItem {
  _id?: string;
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

  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.base);
  }

  getById(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.base}/${id}`);
  }

  createInventory(data: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.base, data);
  }

  updateInventory(id: string, data: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.base}/${id}`, data);
  }

  deleteInventory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getRestockSuggestions(): Observable<{ urgent: InventoryItem[]; warning: InventoryItem[] }> {
    return this.http.get<{ urgent: InventoryItem[]; warning: InventoryItem[] }>(
      `${this.base}/restock-suggestions`
    );
  }
}
