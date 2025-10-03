import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaundryManagementComponent } from './laundry-management.component';

describe('LaundryManagementComponent', () => {
  let component: LaundryManagementComponent;
  let fixture: ComponentFixture<LaundryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaundryManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaundryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
