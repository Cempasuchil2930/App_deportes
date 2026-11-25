import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroJugadora } from './registro-jugadora';

describe('RegistroJugadora', () => {
  let component: RegistroJugadora;
  let fixture: ComponentFixture<RegistroJugadora>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroJugadora],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroJugadora);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
