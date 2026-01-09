import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  product: any = {
    name: '',
    sku: '',
    price: 0,
    owner: '' // ID de la persona
  };

  persons: any[] = []; 
  isEditing = false;
  id = '';

  ngOnInit() {
    this.loadOwners();

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
      if (this.id) {
        this.isEditing = true;
        this.loadProduct();
      }
    });
  }

  loadOwners() {
    this.api.getPersons().subscribe({
      next: (data) => this.persons = data.results,
      error: (e) => console.error('Error cargando dueños', e)
    });
  }

  loadProduct() {
    this.api.getProduct(this.id).subscribe({
      next: (data) => {
        this.product = data;
        if (data.owner && typeof data.owner === 'object') {
          this.product.owner = data.owner.id;
        }
      },
      error: (e) => console.error(e)
    });
  }

  save() {
    Swal.fire({
      title: 'Guardando...',
      didOpen: () => Swal.showLoading()
    });

    const request = this.isEditing
      ? this.api.updateProduct(this.id, this.product)
      :this.api.createProduct(this.product);

  request.subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'La persona ha sido guardada correctamente',
        timer: 2000
      }).then(() => {
        this.router.navigate(['/products']);
      });
    },
    error: (err) => {
      // Alerta de Error
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar. Revisa los datos.'
      });
    }
  });
  }
}
