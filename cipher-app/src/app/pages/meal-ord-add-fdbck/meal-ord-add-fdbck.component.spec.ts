import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealOrdAddFdbckComponent } from './meal-ord-add-fdbck.component';

describe('MealOrdAddFdbckComponent', () => {
  let component: MealOrdAddFdbckComponent;
  let fixture: ComponentFixture<MealOrdAddFdbckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealOrdAddFdbckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealOrdAddFdbckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
