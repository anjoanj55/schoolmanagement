import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentalertsComponent } from './sentalerts.component';

describe('SentalertsComponent', () => {
  let component: SentalertsComponent;
  let fixture: ComponentFixture<SentalertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentalertsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentalertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
