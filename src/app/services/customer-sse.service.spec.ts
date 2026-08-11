import { TestBed } from '@angular/core/testing';

import { CustomerSseService } from './customer-sse.service';

describe('CustomerSseService', () => {
  let service: CustomerSseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerSseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
