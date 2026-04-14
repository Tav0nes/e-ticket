export interface AuditEntry {
  id: string;
  ticketId: string;
  actorId: string | null;
  action: string;
  fromValue: string | null;
  toValue: string | null;
  timeStamp: string;
}