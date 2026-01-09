import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  private api = inject(ApiService);
  
  products: any[] = [];
  loading = true;

  // Filtros
  filterSku = '';
  filterMinPrice: number | null = null;
  filterMaxPrice: number | null = null;

  // Paginación
  currentPage = 1;
  nextUrl: string | null = null;
  previousUrl: string | null = null;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    const params: any = {
      page: this.currentPage,
      ordering: '-created_at' // Ordenar por más nuevo
    };

    if (this.filterSku) params.sku = this.filterSku;
    if (this.filterMinPrice) params.price_min = this.filterMinPrice;
    if (this.filterMaxPrice) params.price_max = this.filterMaxPrice;

    this.api.getProducts(params).subscribe({
      next: (data) => {
        this.products = data.results;
        this.nextUrl = data.next;
        this.previousUrl = data.previous;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  search() {
    this.currentPage = 1; // Reiniciar a pág 1 al filtrar
    this.loadProducts();
  }

  cleanFilters() {
    this.filterSku = '';
    this.filterMinPrice = null;
    this.filterMaxPrice = null;
    this.search();
  }

  nextPage() {
    if (this.nextUrl) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.previousUrl) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  deleteProduct(id: string) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',     // Rojo
      cancelButtonColor: '#3085d6',   // Azul
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      
      if (result.isConfirmed) {
        this.api.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El producto ha sido eliminado correctamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadProducts(); // Recargamos la lista
          },
          error: (err) => {
            console.error(err);
            Swal.fire(
              'Error',
              'No se pudo eliminar el producto.',
              'error'
            );
          }
        });
      }
    });
  }
}
