import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonFormComponent } from './person-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PersonFormComponent', () => {
  let component: PersonFormComponent;
  let fixture: ComponentFixture<PersonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PersonFormComponent, 
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
