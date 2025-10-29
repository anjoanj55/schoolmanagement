import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunScheduleComponent } from './laun-schedule.component';

describe('LaunScheduleComponent', () => {
  let component: LaunScheduleComponent;
  let fixture: ComponentFixture<LaunScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
