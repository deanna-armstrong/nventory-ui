import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';
import { InventoryItem } from './inventory.service';

/**
 * Shape of an in-app notification.
 * - title: brief notification header
 * - body: optional detailed message
 * - timestamp: when the notification was created
 */
export interface AppNotification {
  title: string;
  body?: string;
  timestamp: Date;
}

/**
 * Payload returned by the restock-suggestions endpoint.
 * - urgent: items at or below their reorder threshold
 * - warning: items approaching their threshold
 */
export interface RestockPayload {
  urgent: InventoryItem[];
  warning: InventoryItem[];
}

@Injectable({
  providedIn: 'root' // Registers this service as a singleton for the whole app
})
export class NotificationsService {
  /**
   * Internal subject tracking the current list of notifications.
   * New notifications are prepended to the array.
   */
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);

  /**
   * Public observable that components can subscribe to
   * in order to reactively display notifications.
   */
  readonly notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Prompt the user for permission to display browser notifications
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  /**
   * Creates and emits a new notification.
   * - Displays a browser notification if permission has been granted.
   * - Updates the in-app notifications stream.
   *
   * @param title   The notification title
   * @param options Optional NotificationOptions (e.g. body, icon)
   */
  notify(title: string, options?: NotificationOptions) {
    // Build the in-app notification object
    const note: AppNotification = {
      title,
      body: options?.body,
      timestamp: new Date()
    };

    // Display a native browser notification if supported and permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }

    // Prepend the new notification to the current array
    this.notificationsSubject.next([
      note,
      ...this.notificationsSubject.value
    ]);
  }

  /**
   * Fetches restock suggestions from the API.
   * Delegates to the inventory service endpoint for urgent and warning items.
   *
   * @returns An observable emitting RestockPayload
   */
  getRestockSuggestions(): Observable<RestockPayload> {
    const url = `${API_BASE_URL}/inventory/restock-suggestions`;
    return this.http.get<RestockPayload>(url);
  }
}
