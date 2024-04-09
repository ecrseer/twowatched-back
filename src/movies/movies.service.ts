import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  iSearchRequestTmdbMovieDTO,
  iTmdbMovieCastCredits,
  iTmdbMovieDTO,
} from './entities/Tmdb';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Movie } from './entities/movie.schema';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private MovieModel: Model<Movie>) {}

  public async get_movie_by_id(id: string) {
    const movie = await this.MovieModel.findById(
      new mongoose.Types.ObjectId(id),
    ).exec();

    return movie;
  }

  public async get_movie_by_ids(ids: string[]) {
    const movies = await this.MovieModel.find({
      _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
    });

    return movies;
  }

  public async get_characters_by_movie_id(id: string) {
    const movie = await this.get_movie_by_id(id);
    const cast_with_images = movie.credits.cast.map((character) => {
      return {
        ...character,
        profile_path: `https://image.tmdb.org/t/p/w500${character.profile_path}`,
      };
    });
    return cast_with_images;
  }

  public async get_tmdb_movie_by_name(searched_name: string) {
    const found = await this.MovieModel.findOne({
      title: { $regex: new RegExp(searched_name, 'i') },
    }).exec();

    if (!found) {
      const search_result = await this.search_movie_TMDB(searched_name);
      const movie = this.find_most_likely_movie_in_tmdb(
        search_result.results,
        searched_name,
      );
      const full_data_of_movie = await this.search_movie_with_characters_TMDB(
        `${movie.id}`,
      );
      const created = await this.MovieModel.create({
        ...full_data_of_movie,
        id: undefined,
        tmdb_id: full_data_of_movie.id,
      });
      return created;
    }
    return found;
  }

  private find_most_likely_movie_in_tmdb(
    results: iTmdbMovieDTO[],
    searched_name: string,
  ) {
    // TODO - implement a better search algorithm
    // return results.find((movie) =>
    //   new RegExp(searched_name, 'i').test(movie.title),
    // );
    return results[0];
  }

  public async search_movie_TMDB(searching_movie: string) {
    const base_url = 'https://api.themoviedb.org/3/search/multi';

    const { data } = await axios.get<iSearchRequestTmdbMovieDTO>(base_url, {
      headers: {
        accept: 'application/json',
      },
      params: {
        query: searching_movie,
        include_adult: true,
        language: 'pt-BR',
        page: 1,
        api_key: process.env.TMDB_API_KEY,
      },
    });
    return data;

    // return await this.search_movie_characters_TMDB(
    //   axios_matrix_sample[0].id.toString(),
    // );
  }

  public async search_movie_with_characters_TMDB(movie_id: string) {
    const base_url = `https://api.themoviedb.org/3/movie/${movie_id}`;

    const { data } = await axios.get<iTmdbMovieCastCredits>(base_url, {
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
