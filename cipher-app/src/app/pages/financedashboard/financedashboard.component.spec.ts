import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancedashboardComponent } from './financedashboard.component';

describe('FinancedashboardComponent', () => {
  let component: FinancedashboardComponent;
  let fixture: ComponentFixture<FinancedashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancedashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
