import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunManFeedbackComponent } from './laun-man-feedback.component';

describe('LaunManFeedbackComponent', () => {
  let component: LaunManFeedbackComponent;
  let fixture: ComponentFixture<LaunManFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunManFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunManFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
