import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  create(dto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create(dto);
    return this.commentsRepository.save(comment);
  }

  findByTicketId(ticketId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { ticketId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.commentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
  }
}
