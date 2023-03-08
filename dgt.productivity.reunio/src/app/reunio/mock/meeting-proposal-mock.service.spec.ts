import { TestBed } from '@angular/core/testing';

import { MeetingProposalMockService } from './meeting-proposal-mock.service';

describe('MeetingProposalMockService', () => {
  let service: MeetingProposalMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingProposalMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
