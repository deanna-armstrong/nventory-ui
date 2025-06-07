import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NotificationsService,
  AppNotification,
  RestockPayload
} from '../services/notifications.service';
import { InventoryItem } from '../services/inventory.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: AppNotification[] = [];
  urgent: InventoryItem[] = [];
  warning: InventoryItem[] = [];

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    // Subscribe to local/browser notifications
    this.notificationsService.notifications$.subscribe(
      notes => (this.notifications = notes),
      err => console.error('Failed loading local notifications', err)
    );

    // Fetch API-driven restock suggestions
    this.notificationsService.getRestockSuggestions().subscribe(
      (data: RestockPayload) => {
        this.urgent = data.urgent;
        this.warning = data.warning;
      },
      err => console.error('Failed loading restock suggestions', err)
    );
  }
}
