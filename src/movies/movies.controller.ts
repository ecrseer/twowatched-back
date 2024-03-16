import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('characters/:movie_id')
  public async findCharactersById(@Param('movie_id') movie_id: string) {
    console.log('~☠️ ~ MoviesController ~ findById ~ movie_id:', movie_id);

    return this.moviesService.get_characters_by_movie_id(movie_id);
  }
}
