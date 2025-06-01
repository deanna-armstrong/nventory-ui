import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppNotification {
  title:  string;
  body?:  string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  readonly notifications$: Observable<AppNotification[]> =
    this.notificationsSubject.asObservable();

  constructor() {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  notify(title: string, options?: NotificationOptions) {
    const note: AppNotification = {
      title,
      body:   options?.body,
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
}
