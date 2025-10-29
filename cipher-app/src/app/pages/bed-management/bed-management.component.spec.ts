import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedManagementComponent } from './bed-management.component';

describe('BedManagementComponent', () => {
  let component: BedManagementComponent;
  let fixture: ComponentFixture<BedManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BedManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
