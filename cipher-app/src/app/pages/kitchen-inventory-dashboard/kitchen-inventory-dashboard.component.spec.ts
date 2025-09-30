import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenInventoryDashboardComponent } from './kitchen-inventory-dashboard.component';

describe('KitchenInventoryDashboardComponent', () => {
  let component: KitchenInventoryDashboardComponent;
  let fixture: ComponentFixture<KitchenInventoryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitchenInventoryDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitchenInventoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
