import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  DataSource,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Ticket } from 'src/tickets/ticket.entity';
import { AuditService } from './audit.service';

@Injectable()
@EventSubscriber()
export class TicketAuditSubscriber implements EntitySubscriberInterface<Ticket> {
  constructor(
    dataSource: DataSource,
    private readonly auditService: AuditService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Ticket;
  }

  async afterUpdate(event: UpdateEvent<Ticket>): Promise<void> {
    const before = event.databaseEntity;
    const after = event.entity as Ticket;
    if (!before || !after) return;

    if (before.status !== after.status) {
      await this.auditService.log({
        ticketId: after.id,
        action: 'STATUS_CHANGED',
        fromValue: before.status,
        toValue: after.status,
      });
    }

    if (before.assigneeId !== after.assigneeId) {
      await this.auditService.log({
        ticketId: after.id,
        action: 'ASSIGNEE_CHANGED',
        fromValue: before.assigneeId ?? null,
        toValue: after.assigneeId ?? null,
      });
    }
  }
}