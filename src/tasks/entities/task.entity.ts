import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BoardColumn } from '../../columns/entities/column.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  position: number;

  @ManyToOne(() => BoardColumn, (column) => column.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'columnId' })
  column: BoardColumn;

  @Column()
  columnId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
