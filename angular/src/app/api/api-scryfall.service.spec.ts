import { TestBed } from '@angular/core/testing';

import { ApiScryfallService } from './api-scryfall.service';

describe('ApiScryfallService', () => {
  let service: ApiScryfallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiScryfallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
