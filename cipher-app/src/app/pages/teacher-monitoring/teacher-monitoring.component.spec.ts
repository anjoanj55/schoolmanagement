import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherMonitoringComponent } from './teacher-monitoring.component';

describe('TeacherMonitoringComponent', () => {
  let component: TeacherMonitoringComponent;
  let fixture: ComponentFixture<TeacherMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherMonitoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
