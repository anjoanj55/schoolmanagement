import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedmanagementPopupComponent } from './bedmanagement-popup.component';

describe('BedmanagementPopupComponent', () => {
  let component: BedmanagementPopupComponent;
  let fixture: ComponentFixture<BedmanagementPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedmanagementPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BedmanagementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
