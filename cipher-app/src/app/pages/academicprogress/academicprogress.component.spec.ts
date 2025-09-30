import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicprogressComponent } from './academicprogress.component';

describe('AcademicprogressComponent', () => {
  let component: AcademicprogressComponent;
  let fixture: ComponentFixture<AcademicprogressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicprogressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
