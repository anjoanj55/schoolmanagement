import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunreqEditComponent } from './launreq-edit.component';

describe('LaunreqEditComponent', () => {
  let component: LaunreqEditComponent;
  let fixture: ComponentFixture<LaunreqEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunreqEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunreqEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
