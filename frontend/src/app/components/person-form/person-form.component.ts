import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './person-form.component.html',
})
export class PersonFormComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  person: any = {
    first_name: '',
    last_name: '',
    email: ''
  };

  isEditing = false; // Bandera para saber si editamos o creamos
  id = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
      if (this.id) {
        this.isEditing = true;
        this.loadPerson();
      }
    });
  }

  loadPerson() {
    this.api.getPerson(this.id).subscribe({
      next: (data) => {
        this.person = data; // Llenamos el objeto con datos del backend
      },
      error: (err) => console.error(err)
    });
  }

  save() {
    Swal.fire({
      title: 'Guardando...',
      didOpen: () => Swal.showLoading()
    });

    const request = this.isEditing
      ? this.api.updatePerson(this.id, this.person)
      : this.api.createPerson(this.person);

    request.subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'La persona ha sido guardada correctamente',
        timer: 2000
      }).then(() => {
        this.router.navigate(['/persons']);
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
  });  }

}
