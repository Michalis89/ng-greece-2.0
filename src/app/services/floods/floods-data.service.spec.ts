import { TestBed } from '@angular/core/testing';

import { FloodsDataService } from './floods-data.service';

describe('FloodsDataService', () => {
  let service: FloodsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FloodsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
