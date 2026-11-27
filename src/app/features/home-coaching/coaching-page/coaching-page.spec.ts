import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoachingPage } from './coaching-page';

describe('CoachingPage', () => {
  let component: CoachingPage;
  let fixture: ComponentFixture<CoachingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachingPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CoachingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
