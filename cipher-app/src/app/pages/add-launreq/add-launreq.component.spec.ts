import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLaunreqComponent } from './add-launreq.component';

describe('AddLaunreqComponent', () => {
  let component: AddLaunreqComponent;
  let fixture: ComponentFixture<AddLaunreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLaunreqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLaunreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
