import { TestBed } from '@angular/core/testing';

import { SettingsServiceTsService } from './settings.service';

describe('SettingsServiceTsService', () => {
  let service: SettingsServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
