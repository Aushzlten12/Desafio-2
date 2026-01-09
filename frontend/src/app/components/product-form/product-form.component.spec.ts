import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ApiService } from '../../services/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getProduct', 'getPersons', 'createProduct', 'updateProduct']);
    
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [{ provide: ApiService, useValue: spy }]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    
    // Mock importante: Devuelve lista de personas para el Select
    apiServiceSpy.getPersons.and.returnValue(of({ results: [] }));
    
    // Mock para getProduct (en caso de editar)
    apiServiceSpy.getProduct.and.returnValue(of({}));

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });
});
