import { TestBed } from '@angular/core/testing';

import { AppUtil.BaseService } from './app-util.base.service';

describe('AppUtil.BaseService', () => {
  let service: AppUtil.BaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUtil.BaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
