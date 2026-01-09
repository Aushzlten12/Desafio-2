import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.component.html',
  styles: [`
    .status-dot {
      height: 12px;
      width: 12px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;
    }
    .online { background-color: #28a745; box-shadow: 0 0 8px #28a745; }
    .offline { background-color: #dc3545; box-shadow: 0 0 8px #dc3545; }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private router = inject(Router);

  isBackendOnline = false;
  private intervalId: any;

  currentUser: string = '';

  ngOnInit() {
    this.checkStatus();
    // Revisar cada 30 segundos
    this.intervalId = setInterval(() => this.checkStatus(), 30000);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Lo de decoded ",decoded);
        this.currentUser = decoded.username || decoded.email || 'Usuario';
      } catch (e) {
        console.error('Token inválido');
      }
    }
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  checkStatus() {
    this.api.getPersons({ page: 1 }).subscribe({
      next: () => this.isBackendOnline = true,
      error: () => this.isBackendOnline = false
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
