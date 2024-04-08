import { PartialType } from '@nestjs/mapped-types';

import { Movie } from '../entities/movie.schema';

export class UpdateMovieDto extends PartialType(Movie) {}
