import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverInformationActionComponent } from './driver-information-action.component';

describe('DriverInformationActionComponent', () => {
  let component: DriverInformationActionComponent;
  let fixture: ComponentFixture<DriverInformationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverInformationActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverInformationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
