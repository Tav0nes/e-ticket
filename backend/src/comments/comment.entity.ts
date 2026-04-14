import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ticket, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId' })
  ticket: Ticket;

  @Column()
  ticketId: string;

  @Column()
  authorId: string;

  @Column('text')
  body: string;

  @CreateDateColumn()
  createdAt: Date;  
}
