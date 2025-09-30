import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiassesmentComponent } from './aiassesment.component';

describe('AiassesmentComponent', () => {
  let component: AiassesmentComponent;
  let fixture: ComponentFixture<AiassesmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiassesmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiassesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
