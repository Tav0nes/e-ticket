import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let service: CommentsService;
  let repo: jest.Mocked<Partial<Repository<Comment>>>;

  const mockComment: Comment = {
    id: 'c1',
    ticketId: 't1',
    authorId: 'user1',
    body: 'hello',
    createdAt: new Date(),
  } as Comment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,  
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repo = module.get(getRepositoryToken(Comment));
  });

  describe('create', () => {
    it('creates and saves a comment', async () => {
      repo.create.mockReturnValue(mockComment);
      repo.save.mockResolvedValue(mockComment);

      const result = await service.create({
        ticketId: 't1',
        authorId: 'user1',
        body: 'hello',
      });

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual(mockComment);
    });
  });

  describe('findByTicket', () => {
    it('returns comments ordered by createdAt ASC', async () => {
      repo.find.mockResolvedValue([mockComment]);
      const result = await service.findByTicketId('t1');

      expect(repo.find).toHaveBeenCalledWith({
        where: { ticketId: 't1' },  
        order: { createdAt: 'ASC' },
      });
      expect(result).toEqual([mockComment]);
    });
  });

  describe('findOne', () => {
    it('returns a comment if found', async () => {
      repo.findOne.mockResolvedValue(mockComment);
      const result = await service.findOne('c1');
      expect(result).toEqual(mockComment);
    });

    it('throws NotFoundException if comment not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes a comment if found', async () => {
      repo.delete.mockResolvedValue({ affected: 1, raw: {} });
      await service.remove('c1');
      expect(repo.delete).toHaveBeenCalledWith('c1');
    });

    it('throws NotFoundException if comment not found', async () => {
      repo.delete.mockResolvedValue({ affected: 0, raw: {} });
      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
