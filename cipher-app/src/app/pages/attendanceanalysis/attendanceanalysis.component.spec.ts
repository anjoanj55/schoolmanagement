import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceanalysisComponent } from './attendanceanalysis.component';

describe('AttendanceanalysisComponent', () => {
  let component: AttendanceanalysisComponent;
  let fixture: ComponentFixture<AttendanceanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceanalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
