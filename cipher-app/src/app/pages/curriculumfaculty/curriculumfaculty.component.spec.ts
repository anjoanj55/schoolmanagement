import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumfacultyComponent } from './curriculumfaculty.component';

describe('CurriculumfacultyComponent', () => {
  let component: CurriculumfacultyComponent;
  let fixture: ComponentFixture<CurriculumfacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumfacultyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumfacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
