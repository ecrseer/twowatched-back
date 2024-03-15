import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  TmdbBelongsToCollection,
  TmdbCastMember,
  TmdbGenre,
  TmdbProductionCompany,
  TmdbSpokenLanguage,
  iTmdbMovieCastCredits,
} from './Tmdb';
import { HydratedDocument } from 'mongoose';

type iTMDBMovieCredits = Omit<iTmdbMovieCastCredits, 'id'>;
type iMovieCredits = { cast: TmdbCastMember[] };
@Schema({ timestamps: true })
export class Movie {
  @Prop()
  original_title?: string;

  @Prop()
  title: string;

  @Prop()
  tmdb_id: string;

  @Prop({ type: () => Object })
  credits: iMovieCredits;

  @Prop()
  backdrop_path?: string;

  @Prop({ type: () => Object })
  belongs_to_collection?: TmdbBelongsToCollection;

  @Prop({ type: () => Object })
  genres?: TmdbGenre[];

  @Prop()
  imdb_id?: string;

  @Prop()
  original_language?: string;

  @Prop()
  overview?: string;

  @Prop()
  popularity?: number;

  @Prop()
  poster_path?: string;

  @Prop({ type: () => Object })
  production_companies?: TmdbProductionCompany[];

  @Prop({ type: () => Object })
  production_countries?: { iso_3166_1: string; name: string }[];

  @Prop()
  release_date?: string;

  @Prop()
  revenue?: number;

  @Prop()
  runtime?: number;

  @Prop({ type: () => Object })
  spoken_languages?: TmdbSpokenLanguage[];

  @Prop()
  status?: string;

  @Prop()
  tagline?: string;

  @Prop()
  video?: boolean;
}

export type MovieDocument = HydratedDocument<Movie>;

export const MovieSchema = SchemaFactory.createForClass(Movie);
