import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import {
  NotificationsService,
  AppNotification,
  RestockPayload,
} from '../../services/notifications.service';
import { InventoryItem }      from '../../services/inventory.service';

@Component({
  selector: 'app-notifications',
  standalone: true,            // Enables using this component without declaring it in a module
  imports: [CommonModule],     // Imports CommonModule for common directives (ngIf, ngFor, etc.)
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  /** Array of notification objects to display in the UI */
  notifications: AppNotification[] = [];

  /** Items requiring immediate restock (quantity <= threshold) */
  urgent: InventoryItem[] = [];

  /** Items at warning level (threshold < quantity <= threshold + offset) */
  warning: InventoryItem[] = [];

  constructor(
    // Injects the service responsible for fetching notifications and restock data
    private notificationsService: NotificationsService,
  ) {}

  /**
   * OnInit lifecycle hook:
   * - Subscribes to notifications$ to receive real-time notification updates
   * - Fetches initial restock suggestions for urgent and warning lists
   */
  ngOnInit() {
    // Subscribe to the BehaviorSubject in the service to get pushed notifications
    this.notificationsService.notifications$.subscribe(
      notes => (this.notifications = notes),
      err => console.error('Failed loading local notifications', err),
    );

    // Call the API service to get restock suggestions and populate lists
    this.notificationsService.getRestockSuggestions().subscribe(
      (data: RestockPayload) => {
        this.urgent  = data.urgent;
        this.warning = data.warning;
      },
      err => console.error('Failed loading restock suggestions', err),
    );
  }
}
