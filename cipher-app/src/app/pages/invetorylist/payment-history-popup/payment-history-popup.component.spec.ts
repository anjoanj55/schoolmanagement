import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistoryPopupComponent } from './payment-history-popup.component';

describe('PaymentHistoryPopupComponent', () => {
  let component: PaymentHistoryPopupComponent;
  let fixture: ComponentFixture<PaymentHistoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentHistoryPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentHistoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
