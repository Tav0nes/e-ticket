import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditEntry } from './audit-entry.entity';

export interface AuditLogInput {
  ticketId: string;
  actorId?: string | null;
  action: string;
  fromValue?: string | null;
  toValue?: string | null;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditEntry)
    private readonly auditRepo: Repository<AuditEntry>,
  ) {}

  log(input: AuditLogInput): Promise<AuditEntry> {
    const entry = this.auditRepo.create({
      ticketId: input.ticketId,
      actorId: input.actorId ?? null,
      action: input.action,
      fromValue: input.fromValue ?? null,
      toValue: input.toValue ?? null,
    });
    return this.auditRepo.save(entry);
  }

  findByTicket(ticketId: string): Promise<AuditEntry[]> {
    return this.auditRepo.find({
      where: { ticketId },
      order: { timeStamp: 'ASC' },
    });
  }
}
