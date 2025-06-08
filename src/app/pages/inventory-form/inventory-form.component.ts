import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule }    from '@angular/material/input';
import { MatButtonModule }   from '@angular/material/button';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';

import { InventoryService, InventoryItem } from '../../services/inventory.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css']
})
export class InventoryFormComponent implements OnInit {
  item: InventoryItem = {
    name: '',
    description: '',
    quantity: 0,
    reorderThreshold: 5,
    location: ''
  };
  isEdit = false;

  constructor(
    private inventorySvc: InventoryService,
    private notifSvc: NotificationsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.inventorySvc.getById(id).subscribe(
        data => (this.item = data),
        err => console.error('Failed to load item', err)
      );
    }
  }

  saveItem() {
    if (this.isEdit && this.item._id) {
      this.inventorySvc.updateInventory(this.item._id, this.item).subscribe(
        updated => {
          this.notifSvc.notify('Item updated', {
            body: `Updated ${updated.name} (Qty: ${updated.quantity})`
          });
          this.router.navigate(['/items']);
        },
        err => console.error('Update failed', err)
      );
    } else {
      this.inventorySvc.createInventory(this.item).subscribe(
        created => {
          this.notifSvc.notify('Item created', {
            body: `${created.name} added to inventory`
          });
          this.router.navigate(['/items']);
        },
        err => console.error('Create failed', err)
      );
    }
  }

  /** Only show form if user is admin */
  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role === 'admin';
  }
}
