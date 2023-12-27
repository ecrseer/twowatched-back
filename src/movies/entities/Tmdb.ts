export interface iTmdbMovieDTO {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}
export interface iSearchRequestTmdbMovieDTO {
  page: number;
  total_pages: number;
  total_results: number;
  results: iTmdbMovieDTO[];
}
export interface iTwaMovie extends Partial<iTmdbMovieDTO> {
  title?: string;
}
