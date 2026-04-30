import { Controller, Get, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { Roles } from '../auth/roles.decorator';

@ApiTags('audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Roles('viewer', 'reporter', 'engineer', 'admin')
  @Get()
  findByTicket(@Query('ticketId', ParseUUIDPipe) ticketId: string) {
    return this.auditService.findByTicket(ticketId);
  }
}
