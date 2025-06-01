import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule
  ],
  templateUrl: './inventory-form.component.html',
})
export class InventoryFormComponent implements OnInit {
  item: any = {
    name: '',
    description: '',
    quantity: 0,
    location: ''
  };
  isEdit = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.http.get(`http://localhost:3000/inventory/${id}`).subscribe(data => {
        this.item = {
      ...data,
      reorderThreshold: (data as any).reorderThreshold ?? 5
    };
      });
    }
  }

  saveItem() {
    if (this.isEdit) {
      this.http.put(`http://localhost:3000/inventory/${this.item._id}`, this.item).subscribe(() => {
        this.router.navigate(['/items']);
      });
    } else {
      this.http.post('http://localhost:3000/inventory', this.item).subscribe(() => {
        this.router.navigate(['/items']);
      });
    }
  }
  isAdmin(): boolean {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.role === 'admin';
}
}
