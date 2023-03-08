import { Invitee } from './../../models/invitee';
import { Component, OnInit } from '@angular/core';
import { Meeting } from '../../models/meeting';
import { MeetingProposalService } from '../../services/meeting-proposal.service';

@Component({
  selector: 'app-reunio',
  templateUrl: './reunio.page.html',
  styleUrls: ['./reunio.page.scss'],
})
export class ReunioPage implements OnInit {

  public meetingsCreated: Meeting[]= [];
  public meetingsInvited: Meeting[]= [];
  currentUserEmail: string = '';
  constructor(private meetingService: MeetingProposalService) {}

  ngOnInit(): void {
    this.loadMeetings();

  }

  private async loadMeetings(): Promise<void> {
    const currentUserEmail = await this.meetingService.getCurrentUserEmail();

    // Load meetings created by the current user
    const meetingsCreated = await this.meetingService.getMeetingProposalsCreatedByUser(currentUserEmail);
    this.meetingsCreated = meetingsCreated.map((m: Meeting) => this.calculateMeetingStatus(m));

    // Load meetings the current user is invited to
    const meetingsInvited = await this.meetingService.getMeetingProposalsInvitingUser(currentUserEmail);
    this.meetingsInvited = meetingsInvited.map((m: Meeting) => this.calculateMeetingStatus(m));
  }

  private calculateMeetingStatus(meeting: Meeting): Meeting {
    const currentUserEmail = this.getCurrentUserEmailSync();

    // Check if the current user has answered the meeting proposal
    const currentUserInvitee = meeting.invitees.find((i: any) => i!.Email === currentUserEmail);
    if (currentUserInvitee) {
      meeting.answered = currentUserInvitee.answer!.some((a: any) => a);
    }

    // Calculate the total number of invitees who have answered the meeting proposal
    meeting.totalAnswers = meeting.invitees.reduce((total: any, invitee: any) => {
      const answered = invitee!.answer!.some((a: any) => a);
      return total + (answered ? 1 : 0);
    }, 0);

    return meeting;
  }

  async getCurrentUserEmailSync(): Promise<string> {
    if (!this.currentUserEmail) {
      this.currentUserEmail = await this.meetingService.getCurrentUserEmail();
    }
    return this.currentUserEmail;
  }

}
