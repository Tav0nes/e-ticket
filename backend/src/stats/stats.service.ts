import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Ticket, TicketStatus } from '../tickets/ticket.entity';
import { Comment } from '../comments/comment.entity';

export interface StatsOverview {
  ticketsCreated: number;
  ticketsNewOpen: number;
  ticketsClosed: number;
  avgResolutionTime: number;
  avgResponseTime: number;
  activeUsers: number;
}

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketsRepo: Repository<Ticket>,
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
  ) {}

  async getOverview(): Promise<StatsOverview> {
    const [
      ticketsCreated,
      ticketsNewOpen,
      ticketsClosed,
      avgResolutionTime,
      avgResponseTime,
      activeUsers,
    ] = await Promise.all([
      this.ticketsRepo.count(),
      this.ticketsRepo.count({
        where: {
          status: In([
            TicketStatus.OPEN,
            TicketStatus.IN_PROGRESS,
            TicketStatus.BLOCKED,
          ]),
        },
      }),
      this.ticketsRepo.count({
        where: { status: In([TicketStatus.RESOLVED, TicketStatus.CLOSED]) },
      }),
      this.computeAvgResolutionTime(),
      this.computeAvgResponseTime(),
      this.computeActiveUsers(),
    ]);

    return {
      ticketsCreated,
      ticketsNewOpen,
      ticketsClosed,
      avgResolutionTime,
      avgResponseTime,
      activeUsers,
    };
  }

  private async computeAvgResolutionTime(): Promise<number> {
    const result = await this.ticketsRepo.manager.query<
      { avg: string | null }[]
    >(`
      SELECT AVG(EXTRACT(EPOCH FROM ("resolvedAt" - "createdAt")) / 86400) AS avg
      FROM tickets
      WHERE "resolvedAt" IS NOT NULL
    `);
    return result[0]?.avg ? parseFloat(result[0].avg) : 0;
  }

  private async computeAvgResponseTime(): Promise<number> {
    const result = await this.commentsRepo.manager.query<
      { avg: string | null }[]
    >(`
      SELECT AVG(EXTRACT(EPOCH FROM (fr.first_response - t."createdAt")) / 86400) AS avg
      FROM tickets t
      JOIN LATERAL (
        SELECT MIN(c."createdAt") AS first_response
        FROM comments c
        WHERE c."ticketId" = t.id AND c."authorId" != t."reporterId"
      ) fr ON true
      WHERE fr.first_response IS NOT NULL
    `);
    return result[0]?.avg ? parseFloat(result[0].avg) : 0;
  }

  private async computeActiveUsers(): Promise<number> {
    const result = await this.ticketsRepo.manager.query<{ count: string }[]>(`
      SELECT COUNT(DISTINCT user_id) AS count
      FROM (
        SELECT "reporterId" AS user_id FROM tickets WHERE "reporterId" IS NOT NULL
        UNION
        SELECT "assigneeId" AS user_id FROM tickets WHERE "assigneeId" IS NOT NULL
        UNION
        SELECT "authorId" AS user_id FROM comments WHERE "authorId" IS NOT NULL
      ) AS u
    `);
    return result[0]?.count ? parseInt(result[0].count, 10) : 0;
  }
}
