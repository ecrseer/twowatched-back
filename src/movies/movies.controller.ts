import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

import { SearchMoviesByIdsDto } from './dto/search-movies-by-ids-dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('/debugflyio')
  public async debugflyio() {
    return 'this.moviesService.debugflyio()';
  }

  @Get('characters/:movie_id')
  public async findCharactersById(@Param('movie_id') movie_id: string) {
    return this.moviesService.get_characters_by_movie_id(movie_id);
  }

  @Get('by-name/:movie_name')
  public async find_movie_by_name(@Param('movie_name') movie_name: string) {
    return this.moviesService.get_tmdb_movie_by_name(movie_name);
  }

  @Post('by-ids')
  public async find_movie_by_ids(@Body() idsDto: SearchMoviesByIdsDto) {
    return this.moviesService.get_movie_by_ids(idsDto.ids);
  }
}
