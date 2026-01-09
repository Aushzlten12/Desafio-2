import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PersonListComponent } from './components/person-list/person-list.component';
import { PersonFormComponent } from './components/person-form/person-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { authGuard } from './guards/auth.guard';
import { authInterceptor } from './interceptors/auth.interceptor';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'persons', component: PersonListComponent },
      { path: 'persons/new', component: PersonFormComponent },
      { path: 'persons/:id/edit', component: PersonFormComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/new', component: ProductFormComponent },
      { path: 'products/:id/edit', component: ProductFormComponent },
      { path: '', redirectTo: 'persons', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'persons' }
];
