import { Injectable } from '@nestjs/common';
import { CreateTwaroomDto } from './dto/create-twaroom.dto';
import { UpdateTwaroomDto } from './dto/update-twaroom.dto';
import { Twaroom } from './entities/twaroom.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TwaMessage } from './entities/twamessage.schema';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ChooseCharacterService {
  constructor(private moviesService: MoviesService) {}

  async choose() {
    const movies = await this.moviesService.search_movie_TMDB('The matrix');
    const chosen_movie = movies.results[0];
    const characters = await this.moviesService.search_movie_characters_TMDB(
      chosen_movie.id.toString(),
    );
    const cast_with_images = characters.credits.cast.map((character) => {
      return {
        ...character,
        profile_path: `https://image.tmdb.org/t/p/w500${character.profile_path}`,
      };
    });
    return cast_with_images;
  }
}
