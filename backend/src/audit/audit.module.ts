import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditEntry } from './audit-entry.entity';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { TicketAuditSubscriber } from './ticket-audit.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([AuditEntry])],
  providers: [AuditService, TicketAuditSubscriber],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
