import { Meeting } from './../models/meeting';
import { Injectable } from '@angular/core';
import { sp, Web } from '@pnp/sp';
import * as ics from 'ics';
import { Invitee } from '../models/invitee';

@Injectable({
  providedIn: 'root'
})
export class MeetingProposalService {
  private web: Web;
  currentUserEmail: string = '';

  constructor(web: Web) {
    if (!web) {
      web = sp.web;
    }
    this.web = web;
  }

  async createMeetingProposal(meeting: Meeting): Promise<Meeting> {
    if (!meeting.title) {
      throw new Error('Title is missing');
    } else if (meeting.title.length > 255) {
      throw new Error('Title is too long');
    } else if (meeting.invitees.length === 0) {
      throw new Error('Invitees are missing');
    } else if (meeting.slots.length === 0) {
      throw new Error('Slots are missing');
    }

    const createdMeeting = await this.web.lists.getByTitle('MeetingProposals').items.add({
      Title: meeting.title,
      Description: meeting.description,
      CreatorEmail: meeting.creator.EMail,
      InviteesEmail: meeting.invitees.map(invitee => invitee!.Email).join(';#'),
      Slots: JSON.stringify(meeting.slots),
    });

    return { id: createdMeeting.data.ID, ...meeting };
  }

  public async getMeetingProposalsInvitingUser(currentUserEmail: string): Promise<Meeting[]> {
    try {
      const currentUser = await sp.web.currentUser.get();
      const userEmail = currentUser.Email;
      const filter = `substringof('${userEmail}', Invitees)`;

      const items: any[] = await sp.web.lists.getByTitle('MeetingProposals').items.filter(filter).get();

      const meetings = items.map((item: any) => {
        const meeting: Meeting = {
          id: item.ID,
          title: item.Title,
          description: item.Description,
          creator: {
            Title: item.Author.Title,
            Email: item.Author.Email,
          },
          invitees: item.Invitees.map((invitee: any) => {
            return {
              title: invitee.Title,
              email: invitee.EMail,
            };
          }),
          slots: item.AvailableSlots.map((slot: any) => {
            return {
              date: slot.Date,
              start: slot.Start,
              end: slot.End,
              available: slot.Available,
              selected: slot.Selected,
              invitees: slot.Invitees,
            };
          }),
          status: item.Status,
          selectedSlot: item.SelectedSlot,
        };

        return meeting;
      });

      return meetings;
    } catch (error) {
      console.error('Error getting meeting proposals inviting the user: ', error);
      return [];
    }
  }

  async updateMeetingProposal(meeting: Meeting): Promise<Meeting> {
    if (!meeting.title) {
      throw new Error('Title is missing');
    } else if (meeting.title.length > 255) {
      throw new Error('Title is too long');
    } else if (meeting.invitees.length === 0) {
      throw new Error('Invitees are missing');
    } else if (meeting.slots.length === 0) {
      throw new Error('Slots are missing');
    }

    await this.web.lists.getByTitle('MeetingProposals').items.getById(meeting.id!).update({
      Title: meeting.title,
      Description: meeting.description,
      CreatorEmail: meeting.creator.EMail,
      InviteesEmail: meeting.invitees.map(invitee => invitee!.EMail).join(';#'),
      Slots: JSON.stringify(meeting.slots),
      Status: meeting.status,
      SelectedSlot: meeting.selectedSlot ? {
        date: meeting.selectedSlot.date,
        start: meeting.selectedSlot.start,
        end: meeting.selectedSlot.end,
      } : null,
    });

    return meeting;
  }

  deleteMeetingProposal(id: number): Promise<any> {
    return sp.web.lists.getByTitle('MeetingProposals').items.getById(id).delete();
  }

  getMeetingProposals(): Promise<any[]> {
    return sp.web.lists.getByTitle('MeetingProposals').items.select('Id,Title,Description,Invitees,Slots,Creator/Id,Creator/Title,Editor/Id,Editor/Title,Created,Modified').expand('Creator,Editor').get();
  }

  getMeetingProposal(id: number): Promise<any> {
    return sp.web.lists.getByTitle('MeetingProposals').items.getById(id).select('Id,Title,Description,Invitees,Slots,Creator/Id,Creator/Title,Editor/Id,Editor/Title,Created,Modified').expand('Creator,Editor').get();
  }

  public async getMeetingProposalICS(meeting: Meeting): Promise<string> {
    const attendees = meeting.invitees.map((invitee: any) => {
      return { name: invitee.title, email: invitee.email };
    });

    let startDates: ics.DateArray = [0, 0, 0];
    let endDates: ics.DateArray = [0, 0, 0];
    meeting.slots.forEach((slot) => {
      if (slot.selected) {
        const [year, month, day] = slot.date.split('-').map((x) => parseInt(x));
        const [hour, minute] = slot.start.split(':').map((x) => parseInt(x));
        startDates = [year, month - 1, day, hour, minute];
        const [endHour, endMinute] = slot.end.split(':').map((x) => parseInt(x));
        endDates = [year, month - 1, day, endHour, endMinute];
      }
    });

    if(!startDates || !endDates) {
      throw Error('no valid dates');
    }
    const event: ics.EventAttributes = {
      start: startDates,
      end: endDates,
      title: meeting.title,
      description: meeting.description,
      location: '',
      url: '',
      categories: ['Meeting'],
      organizer: { name: '', email: '' },
      attendees,
    };

    const { error, value } = ics.createEvent(event);
    if (error) {
      console.error('Error creating ICS file:', error);
      return '';
    } else {
      if(value)
        return value;
    }

    return '';
  }

  public async sendMeetingProposalEmail(meeting: Meeting, icsFile: string): Promise<void> {
    const subject = `Meeting Proposal: ${meeting.title}`;
    const emailProperties: any = {
      To: [meeting.creator.EMail],
      Subject: subject,
      Body: `Please find attached the meeting invitation.`,
      Attachments: {
        name: `${subject}.ics`,
        content: icsFile,
      },
    };
    await sp.utility.sendEmail(emailProperties);
  }

  async getCurrentUserEmail(): Promise<string> {
    if (!this.currentUserEmail) {
      const currentUser = await sp.web.currentUser.get();
      this.currentUserEmail = currentUser.Email;
    }
    return this.currentUserEmail;
  }

  async getMeetingProposalsCreatedByUser(currentUserEmail: string): Promise<Meeting[]> {
    const meetings = await sp.web.lists.getByTitle('MeetingProposals').items
      .select('ID', 'Title', 'Description', 'Creator/Id', 'Creator/EMail', 'Slots', 'InviteesAnswers')
      .expand('Creator', 'InviteesAnswers')
      .filter(`Creator/EMail eq '${currentUserEmail}'`)
      .get();

    return meetings.map(meeting => {
      const invitees: Invitee[] = meeting.InviteesAnswers.map((invitee: any) => {
        return {
          email: invitee.Email,
          name: invitee.Name,
          answer: invitee.Answer,
          slots: invitee.Slots
        };
      });

      return {
        id: meeting.ID,
        title: meeting.Title,
        description: meeting.Description,
        creator: {
          id: meeting.Creator.ID,
          email: meeting.Creator.Email,
        },
        invitees: invitees,
        slots: meeting.Slots,
        isCreator: true,
      } as Meeting;
    });
  }

  // async getMeetingProposalsInvitingUser(currentUserEmail: string): Promise<Meeting[]> {
  //   const meetings = await sp.web.lists.getByTitle('MeetingProposals').items
  //     .select('ID', 'Title', 'Description', 'Creator/Id', 'Creator/EMail', 'Invitees', 'Slots', 'InviteesAnswers')
  //     .expand('Creator', 'Invitees', 'InviteesAnswers')
  //     .filter(`Invitees/EMail eq '${currentUserEmail}'`)
  //     .get();

  //   return meetings.map(meeting => {
  //     const invitees: Invitee[] = meeting.InviteesAnswers.map((invitee: any) => {
  //       return {
  //         email: invitee.Email,
  //         name: invitee.Name,
  //         answer: invitee.Answer,
  //         slots: invitee.Slots
  //       };
  //     });

  //     const answeredInvitees = invitees.filter(invitee => invitee.answer !== null);
  //     const totalInvitees = meeting.Invitees.length;

  //     return {
  //       id: meeting.ID,
  //       title: meeting.Title,
  //       description: meeting.Description,
  //       creator: {
  //         id: meeting.Creator.Id,
  //         email: meeting.Creator.EMail
  //       },
  //       invitees: invitees,
  //       slots: meeting.Slots,
  //       answeredInvitees: answeredInvitees.length,
  //       totalInvitees: totalInvitees,
  //       isCreator: false
  //     } as Meeting;
  //   });
  // }

}
