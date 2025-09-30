import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackPersonComponent } from './track-person.component';

describe('TrackPersonComponent', () => {
  let component: TrackPersonComponent;
  let fixture: ComponentFixture<TrackPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackPersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
