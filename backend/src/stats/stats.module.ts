import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../tickets/ticket.entity';
import { Comment } from '../comments/comment.entity';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Comment])],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
