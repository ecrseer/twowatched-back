import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TwaroomService } from './twaroom.service';
import { CreateTwaroomDto } from './dto/create-twaroom.dto';
import { UpdateTwaroomDto } from './dto/update-twaroom.dto';
import { TwaMessage } from './entities/twamessage.schema';

@Controller('twaroom')
export class TwaroomController {
  constructor(private readonly twaroomService: TwaroomService) {}

  @Post()
  create(@Body() createTwaroomDto: CreateTwaroomDto) {
    return this.twaroomService.create(createTwaroomDto);
  }

  @Get()
  findAll() {
    return this.twaroomService.findAll();
  }

  @Get(':room_id')
  async findOne(@Param('room_id') room_id: string) {
    return await this.twaroomService.findOne(room_id);
  }

  @Patch(':room_id')
  add_message(@Param('room_id') room_id: string, @Body() message: TwaMessage) {
    return this.twaroomService.add_message(room_id, message);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.twaroomService.remove(+id);
  }
}
