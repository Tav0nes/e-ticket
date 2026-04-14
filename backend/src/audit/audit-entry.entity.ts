import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('audit_entries')
export class AuditEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  ticketId: string;

  @Column({ type: 'varchar', nullable: true })
  actorId: string | null;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  fromValue: string | null;

  @Column({ type: 'text', nullable: true })
  toValue: string | null;

  @CreateDateColumn()
  timeStamp: Date;
}