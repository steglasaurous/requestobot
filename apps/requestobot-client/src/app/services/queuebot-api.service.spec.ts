import { TestBed } from '@angular/core/testing';

import { QueuebotApiService } from './queuebot-api.service';

describe('QueuebotApiService', () => {
  let service: QueuebotApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueuebotApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
