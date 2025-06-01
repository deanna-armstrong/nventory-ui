import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

export interface InventoryItem {
  name: string;
  description: string;
  quantity: number;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${API_BASE_URL}/inventory`;

  constructor(private http: HttpClient) {}

  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  getRestockSuggestions(): Observable<{ urgent: InventoryItem[], warning: InventoryItem[] }> {
    return this.http.get<{ urgent: InventoryItem[], warning: InventoryItem[] }>(`${this.apiUrl}/restock-suggestions`);
  }
}
