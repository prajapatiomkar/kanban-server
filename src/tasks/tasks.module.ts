import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { BoardsModule } from '../boards/boards.module';
import { BoardColumn } from '../columns/entities/column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, BoardColumn]), BoardsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
