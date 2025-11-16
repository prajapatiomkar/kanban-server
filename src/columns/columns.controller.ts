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
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('boards/:boardId/columns')
@UseGuards(JwtAuthGuard)
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Post()
  create(
    @Param('boardId') boardId: string,
    @Body() createColumnDto: CreateColumnDto,
    @Request() req,
  ) {
    return this.columnsService.create(boardId, createColumnDto, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateColumnDto>,
    @Request() req,
  ) {
    return this.columnsService.update(id, updateData, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.columnsService.remove(id, req.user);
  }
}
