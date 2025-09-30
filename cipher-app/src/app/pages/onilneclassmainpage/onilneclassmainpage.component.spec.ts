import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnilneclassmainpageComponent } from './onilneclassmainpage.component';

describe('OnilneclassmainpageComponent', () => {
  let component: OnilneclassmainpageComponent;
  let fixture: ComponentFixture<OnilneclassmainpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnilneclassmainpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnilneclassmainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
