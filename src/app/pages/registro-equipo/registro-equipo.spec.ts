import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroEquipo } from './registro-equipo';

describe('RegistroEquipo', () => {
  let component: RegistroEquipo;
  let fixture: ComponentFixture<RegistroEquipo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroEquipo],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroEquipo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
