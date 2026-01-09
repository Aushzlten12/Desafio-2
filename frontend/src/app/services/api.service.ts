import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient); // Inyección moderna
  private baseUrl = environment.apiUrl; // http://localhost:8000/api/v1

  login(credentials: {username: string, password: string}) {
    return this.http.post<any>(`${this.baseUrl}/auth/login/`, credentials);
  }

  getPersons(params?: any) {
    return this.http.get<any>(`${this.baseUrl}/persons/`, { params: params });
  }

  // Crear Persona
  createPerson(data: any) {
    return this.http.post(`${this.baseUrl}/persons/`, data);
  }

  // Obtener Persona por su ID
  getPerson(id: string) {
    return this.http.get<any>(`${this.baseUrl}/persons/${id}/`);
  }

  // Actualizar Persona
  updatePerson(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/persons/${id}/`, data);
  }

  // Eliminar Persona
  deletePerson(id: string) {
    return this.http.delete(`${this.baseUrl}/persons/${id}/`);
  }


  getProducts(params?: any) {
    return this.http.get<any>(`${this.baseUrl}/products/`, { params: params });
  }

  getProduct(id: string) {
    return this.http.get<any>(`${this.baseUrl}/products/${id}/`);
  }

  createProduct(data: any) {
    return this.http.post(`${this.baseUrl}/products/`, data);
  }

  updateProduct(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/products/${id}/`, data);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.baseUrl}/products/${id}/`);
  }
}
