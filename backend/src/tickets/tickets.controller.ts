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
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { AuthenticatedUser } from 'src/auth/jwt.strategy';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Roles('reporter', 'engineer', 'admin')
  @Post()
  create(
    @Body() CreateTicketDto: CreateTicketDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Ticket> {
    return this.ticketsService.create(CreateTicketDto, user);
  }

  @Roles('viewer', 'reporter', 'engineer', 'admin')
  @Get()
  findAll(): Promise<Ticket[]> {
    return this.ticketsService.findAll();
  }

  @Roles('viewer', 'reporter', 'engineer', 'admin')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Ticket> {
    return this.ticketsService.findOne(id);
  }

  @Roles('engineer', 'admin')
  @Patch(':id')
  update( 
    @Param('id', ParseUUIDPipe) id: string,
    @Body() UpdateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {  
    return this.ticketsService.update(id, UpdateTicketDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.ticketsService.remove(id);
  }
}
