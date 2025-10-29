import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitManAddInventoryComponent } from './kit-man-add-inventory.component';

describe('KitManAddInventoryComponent', () => {
  let component: KitManAddInventoryComponent;
  let fixture: ComponentFixture<KitManAddInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitManAddInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitManAddInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
