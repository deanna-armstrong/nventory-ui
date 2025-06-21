import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

/**
 * Represents a single inventory item as returned by the API.
 */
export interface InventoryItem {
  /** Optional MongoDB document ID */
  _id?: string;
  /** Human-readable name of the item */
  name: string;
  /** Detailed description or notes about the item */
  description: string;
  /** Current stock level (integer count) */
  quantity: number;
  /** Threshold at or below which an item should be reordered */
  reorderThreshold: number;
  /** Storage location identifier (e.g., shelf, room) */
  location: string;
}

@Injectable({
  providedIn: 'root' // Registers the service at the root injector
})
export class InventoryService {
  /** Base API endpoint for inventory operations */
  private base = `${API_BASE_URL}/inventory`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the full inventory list.
   * @returns An observable emitting an array of InventoryItem
   */
  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.base);
  }

  /**
   * Retrieves a single inventory item by its ID.
   * @param id The unique identifier of the item
   * @returns An observable emitting the requested InventoryItem
   */
  getById(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.base}/${id}`);
  }

  /**
   * Creates a new inventory item.
   * @param data Partial data for the new item
   * @returns An observable emitting the created InventoryItem
   */
  createInventory(data: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.base, data);
  }

  /**
   * Updates an existing inventory item.
   * @param id The ID of the item to update
   * @param data Partial fields to modify
   * @returns An observable emitting the updated InventoryItem
   */
  updateInventory(
    id: string,
    data: Partial<InventoryItem>
  ): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.base}/${id}`, data);
  }

  /**
   * Deletes an inventory item.
   * @param id The ID of the item to remove
   * @returns An observable that completes when deletion is done
   */
  deleteInventory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  /**
   * Fetches restock suggestions from the API.
   * Separates items into urgent (<= threshold) and warning (<= threshold + buffer).
   * @returns An observable emitting an object with `urgent` and `warning` arrays
   */
  getRestockSuggestions(): Observable<{
    urgent: InventoryItem[];
    warning: InventoryItem[];
  }> {
    return this.http.get<{
      urgent: InventoryItem[];
      warning: InventoryItem[];
    }>(`${this.base}/restock-suggestions`);
  }
}
