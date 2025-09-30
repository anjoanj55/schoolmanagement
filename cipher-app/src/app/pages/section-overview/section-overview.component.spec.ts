import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionOverviewComponent } from './section-overview.component';

describe('SectionOverviewComponent', () => {
  let component: SectionOverviewComponent;
  let fixture: ComponentFixture<SectionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
