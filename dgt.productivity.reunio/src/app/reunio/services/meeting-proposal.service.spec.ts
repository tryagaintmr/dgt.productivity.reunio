import { TestBed } from '@angular/core/testing';
import { Web } from '@pnp/sp';
import { Meeting } from '../models/meeting';

import { MeetingProposalService } from './meeting-proposal.service';

describe('MeetingProposalService', () => {
  let service: MeetingProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingProposalService);
    const web = new Web('', '');
    service = new MeetingProposalService(web);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw an error if title is missing', async () => {
      const meeting: Meeting = {
        title: '',
        description: 'A test meeting proposal',
        creator: { Title: 'John Doe', EMail: 'johndoe@example.com' },
        invitees: [
          { Title: 'Jane Doe', Email: 'janedoe@example.com' },
          { Title: 'Bob Smith', Email: 'bobsmith@example.com' },
        ],
        slots: [
          { date: '2022-01-01', start: '08:00', end: '09:00', available: true, selected: true, invitees: [] },
        ],
      };
      await expectAsync(service.createMeetingProposal(meeting)).toBeRejectedWithError('Title is missing');
    });

    it('should throw an error if title is too long', async () => {
      const meeting = {
        title: 'A'.repeat(256),
        description: 'A test meeting proposal',
        creator: { Title: 'John Doe', EMail: 'johndoe@example.com' },
        invitees: [
          { Title: 'Jane Doe', EMail: 'janedoe@example.com' },
          { Title: 'Bob Smith', EMail: 'bobsmith@example.com' },
        ],
        slots: [
          {
            date: '2022-01-01',
            start: '08:00',
            end: '09:00',
            available: true,
            selected: true,
            invitees: [],
          },
        ],
      };
      await expectAsync(service.createMeetingProposal(meeting)).toBeRejectedWithError('Title is too long');
    });

    it('should throw an error if invitees is missing', async () => {
      const meeting = {
        title: 'Test Meeting',
        description: 'A test meeting proposal',
        creator: { Title: 'John Doe', EMail: 'johndoe@example.com' },
        invitees: [],
        slots: [
          { date: '2022-01-01', start: '08:00', end: '09:00', available: true, selected: true, invitees: [] },
        ],
      };
      await expectAsync(service.createMeetingProposal(meeting)).toBeRejectedWithError('Invitees are missing');
    });

    it('should throw an error if slots is missing', async () => {
      const meeting = {
        title: 'Test Meeting',
        description: 'A test meeting proposal',
        creator: { Title: 'John Doe', EMail: 'johndoe@example.com' },
        invitees: [
          { Title: 'Jane Doe', EMail: 'janedoe@example.com' },
          { Title: 'Bob Smith', EMail: 'bobsmith@example.com' },
        ],
        slots: [],
      };
      await expectAsync(service.createMeetingProposal(meeting)).toBeRejectedWithError('Slots are missing');
    });

    it('should create a meeting proposal', async () => {
      const meeting = {
        title: 'Test Meeting',
        creator: { Title: 'John Doe', EMail: 'johndoe@example.com' },
        invitees : [
          { Title: 'Jane Doe', EMail: 'janedoe@example.com' },
          { Title: 'Bob Smith', EMail: 'bobsmith@example.com' },
        ],
        slots: [
          { date: '2022-01-01', start: '08:00', end: '09:00', available: true, selected: true, invitees: [] },
        ],
      };
      const result = await service.createMeetingProposal(meeting);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.title).toBe(meeting.title);
      expect(result.description).toBe(undefined);
      expect(result.creator).toBeDefined();
      expect(result.creator.Title).toBe(meeting.creator.Title);
      expect(result.creator.EMail).toBe(meeting.creator.EMail);
      expect(result.invitees).toBeDefined();
      expect(result.invitees.length).toBe(meeting.invitees.length);
      expect(result.slots).toBeDefined();
      expect(result.slots.length).toBe(meeting.slots.length);
    });
});
