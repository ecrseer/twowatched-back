import { PartialType } from '@nestjs/mapped-types';
import { TmdbCastMemberClass } from '../entities/Tmdb';
import { IsNumber, IsString } from 'class-validator';

export class TmdbCastMemberDTO extends PartialType(TmdbCastMemberClass) {
  @IsNumber()
  id: number;
  @IsString()
  known_for_department: string;
  @IsString()
  name: string;
}
