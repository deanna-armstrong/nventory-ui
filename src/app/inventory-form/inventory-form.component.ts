import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService, InventoryItem } from '../inventory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './inventory-form.component.html',
})
export class InventoryFormComponent implements OnInit {
  item: InventoryItem = { name: '', quantity: 0 };
  isEdit = false;

  constructor(
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.inventoryService.getItems().subscribe(items => {
        const found = items.find(i => i._id === id);
        if (found) this.item = found;
      });
    }
  }

  submit(): void {
    if (this.isEdit && this.item._id) {
      this.inventoryService.updateItem(this.item._id, this.item).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.inventoryService.addItem(this.item).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
