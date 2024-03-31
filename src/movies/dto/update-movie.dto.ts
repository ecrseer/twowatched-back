import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { Movie } from '../entities/movie.schema';

export class UpdateMovieDto extends PartialType(Movie) {}
