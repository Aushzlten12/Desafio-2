import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './person-list.component.html',
})
export class PersonListComponent implements OnInit {
  private api = inject(ApiService);

  persons: any[] = []; // Aquí guardaremos los datos
  loading = true;      // Para mostrar "Cargando..."

  filterEmail = '';
  filterLastName = '';
  sortOrder = '-created_at';

  currentPage = 1;
  nextUrl: string | null = null;      // Para saber si hay página siguiente
  previousUrl: string | null = null;  // Para saber si hay página anterior

  ngOnInit() {
    this.loadPersons();
  }

  loadPersons() {
    this.loading = true;

    const params: any = {
      page: this.currentPage,
      ordering: this.sortOrder
    }

    if (this.filterEmail) params.email = this.filterEmail;
    if (this.filterLastName) params.last_name = this.filterLastName;

    console.log("Enviando filtros:", params);


    this.api.getPersons(params).subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        // Django manda paginación: { count: 10, next: "...", results: [...] }
        // Nosotros queremos el array "results"
        this.persons = data.results;
        this.nextUrl = data.next;
        this.previousUrl = data.previous;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando personas:', err);
        this.loading = false;
      }
    });
  }

  nextPage() {
    if (this.nextUrl) {
      this.currentPage++;
      this.loadPersons();
    }
  }

  prevPage() {
    if (this.previousUrl) {
      this.currentPage--;
      this.loadPersons();
    }
  }

  search() {
    this.currentPage = 1; // Importante: Si filtro, vuelvo al inicio
    this.loadPersons();
  }

  cleanFilters() {
    this.filterEmail = '';
    this.filterLastName = '';
    this.sortOrder = '-created_at';
    this.currentPage = 1;
    this.loadPersons();
  }

  toggleSort() {
    // Si ya es descendente, lo pasamos a ascendente, y viceversa
    this.sortOrder = this.sortOrder === '-created_at' ? 'created_at' : '-created_at';
    this.loadPersons();
  }

  deletePerson(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',     // Rojo para indicar peligro
      cancelButtonColor: '#3085d6',   // Azul para cancelar
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      
      if (result.isConfirmed) {
        
        this.api.deletePerson(id).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La persona ha sido eliminada.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadPersons();
          },
          error: (err) => {
            console.error(err);
            Swal.fire(
              'Error',
              'Hubo un problema al intentar eliminar.',
              'error'
            );
          }
        });
      }
    });
  }
}
