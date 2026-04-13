import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() CreateTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.ticketsService.create(CreateTicketDto);
  }

  @Get()
  findAll(): Promise<Ticket[]> {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Ticket> {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  update( 
    @Param('id', ParseUUIDPipe) id: string,
    @Body() UpdateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {  
    return this.ticketsService.update(id, UpdateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.ticketsService.remove(id);
  }
}
