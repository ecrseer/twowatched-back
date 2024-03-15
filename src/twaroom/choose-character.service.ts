import { Injectable } from '@nestjs/common';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ChooseCharacterService {
  constructor(private moviesService: MoviesService) {}

  async choose() {
    return this.moviesService.get_tmdb_movie_by_name('The matrix');
  }
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
}
