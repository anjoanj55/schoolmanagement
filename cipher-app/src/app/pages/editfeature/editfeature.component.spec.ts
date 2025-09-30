import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditfeatureComponent } from './editfeature.component';

describe('EditfeatureComponent', () => {
  let component: EditfeatureComponent;
  let fixture: ComponentFixture<EditfeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditfeatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditfeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
