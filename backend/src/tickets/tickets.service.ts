import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ticket, TicketStatus } from "./ticket.entity";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { AuthenticatedUser } from "../auth/jwt.strategy";

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepo: Repository<Ticket>,
  ) {}

  create(data: CreateTicketDto, user: AuthenticatedUser): Promise<Ticket> {
    const ticket = this.ticketsRepo.create({
      ...data,
      reporterId: user.username,
    });
    return this.ticketsRepo.save(ticket);
  }

  findAll(): Promise<Ticket[]> {
    return this.ticketsRepo.find();
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepo.findOneBy({ id });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);  
    }
    return ticket;
  }

  async update(id: string, data: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    if (
      data.status === TicketStatus.RESOLVED &&
      ticket.status !== TicketStatus.RESOLVED
    ) {
      ticket.resolvedAt = new Date();
    }
    Object.assign(ticket, data);
    return this.ticketsRepo.save(ticket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketsRepo.remove(ticket);
  }
}
