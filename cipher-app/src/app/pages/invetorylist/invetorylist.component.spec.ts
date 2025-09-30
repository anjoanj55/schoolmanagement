import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvetorylistComponent } from './invetorylist.component';

describe('InvetorylistComponent', () => {
  let component: InvetorylistComponent;
  let fixture: ComponentFixture<InvetorylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvetorylistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvetorylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
