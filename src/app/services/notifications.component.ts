import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService, AppNotification } from '../services/notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: AppNotification[] = [];

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.notificationsService.notifications$
      .subscribe(notes => this.notifications = notes);
  }
}
