import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ApiService } from '../../services/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    // Mock del servicio
    const spy = jasmine.createSpyObj('ApiService', ['getProducts', 'deleteProduct']);

    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent, 
        HttpClientTestingModule, 
        FormsModule,
        RouterTestingModule
      ],
      providers: [{ provide: ApiService, useValue: spy }]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    
    apiServiceSpy.getProducts.and.returnValue(of({ results: [], count: 0 }));

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });
});
