import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import axios from 'axios';
import { iSearchRequestTmdbMovieDTO } from './entities/Tmdb';
import {
  axios_demon_sample,
  axios_matrix_sample,
} from './tests/axios-requests';

@Injectable()
export class MoviesService {
  public async search_movie_TMDB(searching_movie: string) {
    const base_url = 'https://api.themoviedb.org/3/search/multi';

    // const { data } = await axios.get<iSearchRequestTmdbMovieDTO>(base_url, {
    //   headers: {
    //     accept: 'application/json',
    //   },
    //   params: {
    //     query: searching_movie,
    //     include_adult: true,
    //     language: 'en-US',
    //     page: 1,
    //     api_key: process.env.TMDB_API_KEY,
    //   },
    // });

    return await this.search_movie_characters_TMDB(
      axios_matrix_sample[0].id.toString(),
    );
  }
  public async search_movie_characters_TMDB(movie_id: string) {
    const base_url = `https://api.themoviedb.org/3/movie/${movie_id}`;

    const { data } = await axios.get<iSearchRequestTmdbMovieDTO>(base_url, {
      headers: {
        accept: 'application/json',
      },
      params: {
        api_key: process.env.TMDB_API_KEY,
        append_to_response: 'credits',
      },
    });

    return data;
  }
}
