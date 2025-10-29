import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWithFacultyComponent } from './chat-with-faculty.component';

describe('ChatWithFacultyComponent', () => {
  let component: ChatWithFacultyComponent;
  let fixture: ComponentFixture<ChatWithFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWithFacultyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatWithFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
