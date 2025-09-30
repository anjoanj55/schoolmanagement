import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelInventoryDashboardComponent } from './hostel-inventory-dashboard.component';

describe('HostelInventoryDashboardComponent', () => {
  let component: HostelInventoryDashboardComponent;
  let fixture: ComponentFixture<HostelInventoryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelInventoryDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelInventoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
