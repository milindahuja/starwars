import { TestBed } from '@angular/core/testing';

import { StarWarService } from './starwar.service';

describe('StarWarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StarWarService = TestBed.get(StarWarService);
    expect(service).toBeTruthy();
  });
});
