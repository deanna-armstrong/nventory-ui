import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';
import { InventoryItem } from './inventory.service';

export interface AppNotification {
  title:  string;
  body?:  string;
  timestamp: Date;
}

export interface RestockPayload {
  urgent: InventoryItem[];
  warning: InventoryItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  readonly notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  /** Push an in-browser notification and record it locally */
  notify(title: string, options?: NotificationOptions) {
    const note: AppNotification = {
      title,
      body: options?.body,
      timestamp: new Date()
    };

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }

    this.notificationsSubject.next([
      note,
      ...this.notificationsSubject.value
    ]);
  }

  /** Fetch restock suggestions from your backend */
  getRestockSuggestions(): Observable<RestockPayload> {
    const url = `${API_BASE_URL}/inventory/restock-suggestions`;
    return this.http.get<RestockPayload>(url);
  }
}
