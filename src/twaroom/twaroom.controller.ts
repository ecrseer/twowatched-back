import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TwaroomService } from './twaroom.service';
import { ChooseCharacterService } from './choose-character.service';
import { TmdbCastMemberDTO } from '../movies/dto/Tmdb';

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

  @Get('count-roleplays-by-user-id/:user_id')
  async count_roleplays(@Param('user_id') user_id: string) {
    return await this.twaroomService.get_most_count_movies_roleplays_from_user(
      user_id,
    );
  }

  @Post('choosed-character/:chat_room_id/:user_id')
  async choosed_character(
    @Param('chat_room_id') chat_room_id: string,
    @Param('user_id') user_id: string,
    @Body() cast_member: TmdbCastMemberDTO,
  ) {
    return await this.chooseCharacterService.choose(
      chat_room_id,
      user_id,
      cast_member,
    );
  }
}
