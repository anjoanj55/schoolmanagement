import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamdatesComponent } from './examdates.component';

describe('ExamdatesComponent', () => {
  let component: ExamdatesComponent;
  let fixture: ComponentFixture<ExamdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamdatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
