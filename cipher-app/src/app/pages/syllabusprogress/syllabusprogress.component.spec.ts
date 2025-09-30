import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusprogressComponent } from './syllabusprogress.component';

describe('SyllabusprogressComponent', () => {
  let component: SyllabusprogressComponent;
  let fixture: ComponentFixture<SyllabusprogressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyllabusprogressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
