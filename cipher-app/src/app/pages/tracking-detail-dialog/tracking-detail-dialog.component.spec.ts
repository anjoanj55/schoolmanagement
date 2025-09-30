import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingDetailDialogComponent } from './tracking-detail-dialog.component';

describe('TrackingDetailDialogComponent', () => {
  let component: TrackingDetailDialogComponent;
  let fixture: ComponentFixture<TrackingDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
