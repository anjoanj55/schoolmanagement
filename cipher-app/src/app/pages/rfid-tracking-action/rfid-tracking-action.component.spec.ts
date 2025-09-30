import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfidTrackingActionComponent } from './rfid-tracking-action.component';

describe('RfidTrackingActionComponent', () => {
  let component: RfidTrackingActionComponent;
  let fixture: ComponentFixture<RfidTrackingActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfidTrackingActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfidTrackingActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
