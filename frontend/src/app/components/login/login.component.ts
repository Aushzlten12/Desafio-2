import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para los inputs
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- Importamos módulos aquí
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  username = '';
  password = '';

  onLogin() {
    const creds = { username: this.username, password: this.password };

    this.api.login(creds).subscribe({
      next: (resp) => {
        console.log('Login OK:', resp);
        localStorage.setItem('token', resp.access); // Guardamos el token
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        // this.errorMsg = 'Usuario o contraseña incorrectos';
        //
        alert('Error: Usuario o contraseña incorrectos');
      }
    });
  }
}
