import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AireportsComponent } from './aireports.component';

describe('AireportsComponent', () => {
  let component: AireportsComponent;
  let fixture: ComponentFixture<AireportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AireportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AireportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
