import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { BoardColumn } from '../columns/entities/column.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { User } from '../users/entities/user.entity';
import { BoardsService } from '../boards/boards.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(BoardColumn)
    private columnsRepository: Repository<BoardColumn>,
    private boardsService: BoardsService,
  ) {}

  async create(
    boardId: string,
    columnId: string,
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    await this.boardsService.findOne(boardId, user);

    const column = await this.columnsRepository.findOne({
      where: { id: columnId, boardId },
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    const task = this.tasksRepository.create({
      ...createTaskDto,
      columnId,
    });
    return this.tasksRepository.save(task);
  }

  async update(
    id: string,
    updateData: Partial<CreateTaskDto>,
    user: User,
  ): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['column', 'column.board'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.boardsService.findOne(task.column.boardId, user);
    Object.assign(task, updateData);
    return this.tasksRepository.save(task);
  }

  async move(id: string, moveTaskDto: MoveTaskDto, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['column', 'column.board'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.boardsService.findOne(task.column.boardId, user);

    const newColumn = await this.columnsRepository.findOne({
      where: { id: moveTaskDto.newColumnId },
      relations: ['board'],
    });

    if (!newColumn || newColumn.board.id !== task.column.board.id) {
      throw new NotFoundException('Target column not found');
    }

    // Update task position and column
    task.columnId = moveTaskDto.newColumnId;
    task.position = moveTaskDto.newPosition;

    return this.tasksRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['column', 'column.board'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.boardsService.findOne(task.column.boardId, user);
    await this.tasksRepository.remove(task);
  }
}
