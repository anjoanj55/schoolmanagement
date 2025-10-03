import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenManagementComponent } from './kitchen-management.component';

describe('KitchenManagementComponent', () => {
  let component: KitchenManagementComponent;
  let fixture: ComponentFixture<KitchenManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitchenManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitchenManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
