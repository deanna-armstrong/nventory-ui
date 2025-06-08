import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatListModule }     from '@angular/material/list';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';
import { MatCardModule }     from '@angular/material/card';
import { MatDividerModule }  from '@angular/material/divider';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule }    from '@angular/material/input';
import { FormsModule }       from '@angular/forms';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';

import { InventoryService, InventoryItem } from '../../services/inventory.service';
import {
  NotificationsService,
  AppNotification
} from '../../services/notifications.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  searchQuery = '';
  filteredInventory: InventoryItem[] = [];
  allInventory: InventoryItem[] = [];
  searchPerformed = false; 

  notifications$: Observable<AppNotification[]>;
  urgentItems: InventoryItem[] = [];
  warningItems: InventoryItem[] = [];

  constructor(
    private notificationsService: NotificationsService,
    private inventoryService: InventoryService 
  ) {
    this.notifications$ = this.notificationsService.notifications$;
  }

  ngOnInit() {
    this.inventoryService.getInventory().subscribe(
      data => {
        this.allInventory = data;
        console.log('All Inventory:', this.allInventory);

        this.notificationsService.notify('Inventory loaded', {
          body: `Dashboard connected to ${this.allInventory.length} inventory items.`
        });
      },
      err => {
        console.error('Failed loading inventory', err);
        this.notificationsService.notify('Inventory load failed', {
          body: err.message || 'Unknown error'
        });
      }
    );

    this.inventoryService.getRestockSuggestions().subscribe(
      data => {
        this.urgentItems = data.urgent;
        this.warningItems = data.warning;
        console.log('Urgent:', this.urgentItems);
        console.log('Warning:', this.warningItems);
      },
      err => {
        console.error('Failed loading restock suggestions', err);
        this.notificationsService.notify('Restock suggestions failed', {
          body: err.message || 'Unknown error'
        });
      }
    );
  }

  searchInventory() {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredInventory = this.allInventory.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
    this.searchPerformed = true;
  }
}
