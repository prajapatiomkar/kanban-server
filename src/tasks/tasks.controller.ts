import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('boards/:boardId/columns/:columnId/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.create(boardId, columnId, createTaskDto, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateTaskDto>,
    @Request() req,
  ) {
    return this.tasksService.update(id, updateData, req.user);
  }

  @Patch(':id/move')
  move(
    @Param('id') id: string,
    @Body() moveTaskDto: MoveTaskDto,
    @Request() req,
  ) {
    return this.tasksService.move(id, moveTaskDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user);
  }
}
