import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  let authReq = req;
  
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Si el error es 401 (No autorizado / Token vencido)
      if (error.status === 401) {
        localStorage.removeItem('token'); // Borramos el token viejo
        router.navigate(['/login']);      // Mandamos al login
      }

      // Propagamos el error para que el componente también se entere
      return throwError(() => error);
    })
  );
};
