import { TestBed } from '@angular/core/testing';

import { ParkingSignalrService } from './parking-signalr.service';

describe('ParkingSignalrService', () => {
  let service: ParkingSignalrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingSignalrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
