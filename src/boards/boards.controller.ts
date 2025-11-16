import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    return this.boardsService.create(createBoardDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.boardsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.boardsService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateBoardDto>,
    @Request() req,
  ) {
    return this.boardsService.update(id, updateData, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.boardsService.remove(id, req.user);
  }
}
