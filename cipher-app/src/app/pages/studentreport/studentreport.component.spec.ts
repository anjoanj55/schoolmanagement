import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentreportComponent } from './studentreport.component';

describe('StudentreportComponent', () => {
  let component: StudentreportComponent;
  let fixture: ComponentFixture<StudentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
