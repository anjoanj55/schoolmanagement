import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaundAddmachineComponent } from './laund-addmachine.component';

describe('LaundAddmachineComponent', () => {
  let component: LaundAddmachineComponent;
  let fixture: ComponentFixture<LaundAddmachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaundAddmachineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaundAddmachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
