import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketsService } from './tickets.service';
import { Ticket, TicketStatus, TicketPriority } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';

// A helper function to build a fake Ticket for test assertions
const mockTicket = (): Ticket => ({
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  title: 'Test Ticket',
  description: 'A test description',
  status: TicketStatus.OPEN,
  priority: TicketPriority.MEDIUM,
  category: null,
  reporterId: null,
  assigneeId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('TicketsService', () => {
  let service: TicketsService;
  let repo: jest.Mocked<Partial<Repository<Ticket>>>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });
  
  describe('create', () => {
    it('should create and return a ticket with reporterId from current user', async () => {
      const dto: CreateTicketDto = { title: 'New ticket' };
      const user = { id: 'sub-123', username: 'gustavo', roles: ['engineer'] };
      const ticket = mockTicket();

      repo.create.mockReturnValue(ticket);
      repo.save.mockResolvedValue(ticket);

      const result = await service.create(dto, user);

      expect(repo.create).toHaveBeenCalledWith({ ...dto, reporterId: 'gustavo' });
      expect(repo.save).toHaveBeenCalledWith(ticket);
      expect(result).toEqual(ticket);
    });
  });

  describe('findAll', () => {
    it('should return an array of tickets', async () => {
      const tickets = [mockTicket()];
      repo.find.mockResolvedValue(tickets);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(tickets);
    });
  });

  describe('findOne', () => {
    it('should return a ticket if found', async () => {
      const ticket = mockTicket();
      repo.findOneBy.mockResolvedValue(ticket);

      const result = await service.findOne(ticket.id);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: ticket.id });
      expect(result).toEqual(ticket);
    });
    
    it('should throw NotFoundException if ticket not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException,
      );
    });
  });

  describe('update', () => {  
    it('should update and return the ticket', async () => {
      const ticket = mockTicket();
      const updated = { ...ticket, status: TicketStatus.IN_PROGRESS };

      repo.findOneBy.mockResolvedValue(ticket);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(ticket.id, { status: TicketStatus.IN_PROGRESS });

      expect(repo.save).toHaveBeenCalled();
      expect(result.status).toEqual(TicketStatus.IN_PROGRESS);
    });

    it('should throw NotFoundException if ticket not found', async () => { 
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.update('non-existent-id', { title: 'X'}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the ticket', async () => {
      const ticket = mockTicket();
      repo.findOneBy.mockResolvedValue(ticket);
      repo.remove.mockResolvedValue(ticket);

      await service.remove(ticket.id);

      expect(repo.remove).toHaveBeenCalledWith(ticket);
    });

    it('should throw NotFoundException if ticket not found', async () => { 
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});




