import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    const board = this.boardsRepository.create({
      ...createBoardDto,
      userId: user.id,
    });
    return this.boardsRepository.save(board);
  }

  async findAll(user: User): Promise<Board[]> {
    return this.boardsRepository.find({
      where: { userId: user.id },
      relations: ['columns', 'columns.tasks'],
      order: {
        createdAt: 'DESC',
        columns: { position: 'ASC', tasks: { position: 'ASC' } },
      },
    });
  }

  async findOne(id: string, user: User): Promise<Board> {
    const board = await this.boardsRepository.findOne({
      where: { id },
      relations: ['columns', 'columns.tasks'],
      order: {
        columns: { position: 'ASC', tasks: { position: 'ASC' } },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return board;
  }

  async update(
    id: string,
    updateData: Partial<Board>,
    user: User,
  ): Promise<Board> {
    const board = await this.findOne(id, user);
    Object.assign(board, updateData);
    return this.boardsRepository.save(board);
  }

  async remove(id: string, user: User): Promise<void> {
    const board = await this.findOne(id, user);
    await this.boardsRepository.remove(board);
  }
}
