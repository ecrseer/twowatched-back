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
import { ChooseCharacterService } from './choose-character.service';

@Controller('twaroom')
export class TwaroomController {
  constructor(
    private readonly twaroomService: TwaroomService,
    private readonly chooseCharacterService: ChooseCharacterService,
  ) {}

  @Get('by-id/:room_id')
  async findOne(@Param('room_id') room_id: string) {
    return await this.twaroomService.findOne(room_id);
  }

  @Get('choose-character/:movie_id')
  async choose() {
    return this.chooseCharacterService.choose();
  }
}
