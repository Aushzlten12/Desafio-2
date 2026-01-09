import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Simulamos el módulo HTTP
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no queden peticiones pendientes
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('getPersons debería enviar parámetros de paginación y filtros', () => {
    const dummyResponse = { results: [], count: 0 };
    const params = { page: 2, last_name: 'Perez', ordering: '-created_at' };

    service.getPersons(params).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(req => req.url.includes('/persons/'));
    
    expect(req.request.method).toBe('GET');
    
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('last_name')).toBe('Perez');
    expect(req.request.params.get('ordering')).toBe('-created_at');

    req.flush(dummyResponse);
  });
});
