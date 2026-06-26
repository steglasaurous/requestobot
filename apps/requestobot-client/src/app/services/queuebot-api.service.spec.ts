import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { QUEUEBOT_API_BASE_URL } from '../app.config';
import { QueuebotApiService } from './queuebot-api.service';

describe('QueuebotApiService', () => {
  let service: QueuebotApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: QUEUEBOT_API_BASE_URL, useValue: 'http://localhost:3000' },
      ],
    });
    service = TestBed.inject(QueuebotApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
