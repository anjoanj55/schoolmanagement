import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitmanAddmenuComponent } from './kitman-addmenu.component';

describe('KitmanAddmenuComponent', () => {
  let component: KitmanAddmenuComponent;
  let fixture: ComponentFixture<KitmanAddmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitmanAddmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitmanAddmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
