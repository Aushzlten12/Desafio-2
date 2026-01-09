import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);

  totalPersons: number = 0;
  totalProducts: number = 0;
  isLoading: boolean = true;

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    
    
    this.api.getPersons({ page_size: 1 }).subscribe({
      next: (res: any) => {
        this.totalPersons = res.count;
        
        this.api.getProducts({ page_size: 1 }).subscribe({
          next: (resProd: any) => {
            this.totalProducts = resProd.count;
            this.isLoading = false;
          }
        });
      },
      error: () => this.isLoading = false
    });
  }
}
