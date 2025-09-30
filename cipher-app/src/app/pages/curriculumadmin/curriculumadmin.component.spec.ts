import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumadminComponent } from './curriculumadmin.component';

describe('CurriculumadminComponent', () => {
  let component: CurriculumadminComponent;
  let fixture: ComponentFixture<CurriculumadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
