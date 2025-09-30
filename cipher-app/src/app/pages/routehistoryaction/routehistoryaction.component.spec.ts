import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutehistoryactionComponent } from './routehistoryaction.component';

describe('RoutehistoryactionComponent', () => {
  let component: RoutehistoryactionComponent;
  let fixture: ComponentFixture<RoutehistoryactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutehistoryactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutehistoryactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
