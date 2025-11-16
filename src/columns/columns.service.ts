import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardColumn } from './entities/column.entity';

import { User } from '../users/entities/user.entity';
import { BoardsService } from '../boards/boards.service';
import { CreateColumnDto } from './dto/create-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private columnsRepository: Repository<BoardColumn>,
    private boardsService: BoardsService,
  ) {}

  async create(
    boardId: string,
    createColumnDto: CreateColumnDto,
    user: User,
  ): Promise<BoardColumn> {
    await this.boardsService.findOne(boardId, user);

    const column = this.columnsRepository.create({
      ...createColumnDto,
      boardId,
    });
    return this.columnsRepository.save(column);
  }

  async update(
    id: string,
    updateData: Partial<CreateColumnDto>,
    user: User,
  ): Promise<BoardColumn> {
    const column = await this.columnsRepository.findOne({
      where: { id },
      relations: ['board'],
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    await this.boardsService.findOne(column.boardId, user);
    Object.assign(column, updateData);
    return this.columnsRepository.save(column);
  }

  async remove(id: string, user: User): Promise<void> {
    const column = await this.columnsRepository.findOne({
      where: { id },
      relations: ['board'],
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    await this.boardsService.findOne(column.boardId, user);
    await this.columnsRepository.remove(column);
  }
}
