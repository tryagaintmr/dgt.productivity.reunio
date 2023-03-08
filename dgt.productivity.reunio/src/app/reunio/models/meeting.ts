import { Invitee } from "./invitee";

export interface Meeting {
  id?: number;
  title: string;
  description?: string;
  dateCreated?: Date;
  answered?:boolean;
  totalAnswers?:number;
  creator: Partial<ISPUser>;
  invitees: Partial<Invitee[]>;
  slots: {
    date: string;
    start: string;
    end: string;
    available: boolean;
    selected: boolean;
    invitees: string[];
  }[];
  status?: string;
  selectedSlot?: {
    date: string;
    start: string;
    end: string;
  };
  isCreator?: boolean;
}

export interface ISPUser {
  ID: number;
  Id: number;
  EMail: string;
  Email: string;
  LoginName?: string;
  Title: string;

}
