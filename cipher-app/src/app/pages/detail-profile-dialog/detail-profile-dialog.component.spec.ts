import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProfileDialogComponent } from './detail-profile-dialog.component';

describe('DetailProfileDialogComponent', () => {
  let component: DetailProfileDialogComponent;
  let fixture: ComponentFixture<DetailProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProfileDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
