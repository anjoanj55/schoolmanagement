import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiStudentReportComponent } from './ai-student-report.component';

describe('AiStudentReportComponent', () => {
  let component: AiStudentReportComponent;
  let fixture: ComponentFixture<AiStudentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiStudentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiStudentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
