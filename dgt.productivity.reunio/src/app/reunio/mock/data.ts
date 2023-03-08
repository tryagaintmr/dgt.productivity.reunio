import { Meeting } from "../models/meeting";


const mockSpService = {

  

  getMeetingProposalsInvitingUser: (email: string) => {
    return [
      {
        id: 1,
        title: 'Meeting 1',
        description: 'This is a meeting.',
        creator: {
          Id: 2,
          Email: 'creator@domain.com',
        },
        invitees: [
          {
            Id: 3,
            Email: 'invitee1@domain.com',
          },
          {
            Id: 4,
            Email: 'invitee2@domain.com',
          },
        ],
        slots: [
          {
            date: '2022-03-01',
            start: '08:00',
            end: '09:00',
            available: true,
            selected: false,
            invitees: ['invitee1@domain.com'],
          },
          {
            date: '2022-03-01',
            start: '09:00',
            end: '10:00',
            available: true,
            selected: false,
            invitees: ['invitee1@domain.com', 'invitee2@domain.com'],
          },
          {
            date: '2022-03-02',
            start: '08:00',
            end: '09:00',
            available: true,
            selected: false,
            invitees: [],
          },
        ],
        isCreator: false,
      },
      {
        id: 2,
        title: 'Meeting 2',
        description: 'This is another meeting.',
        creator: {
          Id: 2,
          Email: 'creator@domain.com',
        },
        invitees: [
          {
            Id: 4,
            Email: 'invitee2@domain.com',
          },
        ],
        slots: [
          {
            date: '2022-03-01',
            start: '08:00',
            end: '09:00',
            available: true,
            selected: false,
            invitees: [],
          },
        ],
        isCreator: false,
      },
    ] as Meeting[];
  },
};
