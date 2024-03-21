import { Injectable, NotFoundException } from '@nestjs/common';
import { MoviesService } from '../movies/movies.service';
import { Twaroom } from './entities/twaroom.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { TmdbCastMember } from '../movies/entities/Tmdb';
import { TmdbCastMemberDTO } from '../movies/dto/Tmdb';

@Injectable()
export class ChooseCharacterService {
  constructor(
    private moviesService: MoviesService,
    @InjectModel(Twaroom.name) private twaroomModel: Model<Twaroom>,
  ) {}
  async get_characters() {
    const movie_with_characters =
      await this.moviesService.get_tmdb_movie_by_name('The matrix');

    const cast_with_images = movie_with_characters.credits.cast.map(
      (character) => {
        return {
          ...character,
          profile_path: `https://image.tmdb.org/t/p/w500${character.profile_path}`,
        };
      },
    );
    return cast_with_images;
  }

  async choose(
    chat_room_id: string,
    user_id: string,
    cast_member: TmdbCastMemberDTO,
  ) {
    return this.twaroomModel.findByIdAndUpdate(
      chat_room_id,
      {
        $set: { [`usersCharacters.${user_id}`]: cast_member },
      },
      { new: true },
    );
  }
}
