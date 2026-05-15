import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService, StatsOverview } from './stats.service';
import { Roles } from '../auth/roles.decorator';

@ApiTags('stats')
@ApiBearerAuth()
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  @Roles('viewer', 'reporter', 'engineer', 'admin')
  getOverview(): Promise<StatsOverview> {
    return this.statsService.getOverview();
  }
}
