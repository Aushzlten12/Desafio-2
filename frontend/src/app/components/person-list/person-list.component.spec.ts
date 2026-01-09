import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonListComponent } from './person-list.component';
import { ApiService } from '../../services/api.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

describe('PersonListComponent', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockResponse = {
    count: 2,
    next: 'http://api.com/?page=2',
    previous: null,
    results: [
      { id: '1', first_name: 'Juan', last_name: 'Perez', email: 'juan@test.com', created_at: '2026-01-01' },
      { id: '2', first_name: 'Ana', last_name: 'Gomez', email: 'ana@test.com', created_at: '2026-01-02' }
    ]
  };

  beforeEach(async () => {
    // Creamos un espía (Spy) del servicio
    const spy = jasmine.createSpyObj('ApiService', ['getPersons', 'deletePerson']);

    await TestBed.configureTestingModule({
      imports: [ 
        PersonListComponent, 
        HttpClientTestingModule, 
        FormsModule 
      ],
      providers: [
        { provide: ApiService, useValue: spy }, // Usamos el espía en vez del real
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { paramMap: { get: () => null } } } // Mock de rutas
        }
      ]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    
    apiServiceSpy.getPersons.and.returnValue(of(mockResponse));

    fixture = TestBed.createComponent(PersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Esto dispara ngOnInit
  });

  it('debería crearse y cargar personas al inicio', () => {
    expect(component).toBeTruthy();
    expect(apiServiceSpy.getPersons).toHaveBeenCalled(); // Se llamó al servicio?
    expect(component.persons.length).toBe(2); // Se llenó el array?
    expect(component.persons[0].first_name).toBe('Juan'); // El dato es correcto?
  });

  it('debería filtrar y reiniciar a la página 1', () => {
    // Simulamos que el usuario escribe en el input
    component.filterLastName = 'Perez';
    component.currentPage = 5; // Supongamos que estaba en la página 5
    
    // Ejecutamos la búsqueda
    component.search();

    // Validamos
    expect(component.currentPage).toBe(1); // Debe volver a 1
    
    // Verificamos con qué argumentos se llamó al servicio
    const args = apiServiceSpy.getPersons.calls.mostRecent().args[0];
    expect(args.last_name).toBe('Perez');
    expect(args.page).toBe(1);
  });

  it('debería avanzar de página (Paginación)', () => {
    component.nextUrl = 'si-hay-siguiente'; // Forzamos que haya siguiente
    component.currentPage = 1;

    component.nextPage();

    expect(component.currentPage).toBe(2);
    
    const args = apiServiceSpy.getPersons.calls.mostRecent().args[0];
    expect(args.page).toBe(2);
  });

  it('debería eliminar una persona si el usuario confirma', () => {
    // Simulamos que window.confirm devuelve TRUE
    spyOn(window, 'confirm').and.returnValue(true);
    apiServiceSpy.deletePerson.and.returnValue(of({})); // Respuesta vacía exitosa

    component.deletePerson('1');

    expect(window.confirm).toHaveBeenCalled();
    expect(apiServiceSpy.deletePerson).toHaveBeenCalledWith('1');
    // Debería recargar la lista después de borrar
    expect(apiServiceSpy.getPersons).toHaveBeenCalledTimes(2); // 1 al inicio + 1 al borrar
  });
});
