import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductrequestComponent } from './productrequest.component';

describe('ProductrequestComponent', () => {
  let component: ProductrequestComponent;
  let fixture: ComponentFixture<ProductrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductrequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
