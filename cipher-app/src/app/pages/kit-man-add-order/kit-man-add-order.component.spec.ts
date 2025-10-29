import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitManAddOrderComponent } from './kit-man-add-order.component';

describe('KitManAddOrderComponent', () => {
  let component: KitManAddOrderComponent;
  let fixture: ComponentFixture<KitManAddOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitManAddOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitManAddOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
