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
    return await this.moviesService.search_movie_TMDB('The matrix');
  }
}
