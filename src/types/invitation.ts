export interface Invitation {
  id: 0;
  sentMail: string;
  token: string;
  expiredAt: Date;
  confirmedAt: Date;
  createdAt: Date;
}
