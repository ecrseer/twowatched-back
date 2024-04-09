const MOCK_MOVIE = [
  { _id: '6609cdfa94cadf2c5b7c9e6d', title: 'Avengers: Endgame' },
];
const MOCK_MOVIE_IDS = ['6609cdfa94cadf2c5b7c9e6d'];

export const client_enter_roleplay_notifications_room = {
  payload: {
    moviesList: MOCK_MOVIE,
  },
};

export const mock_enter_roleplay_room = {
  payload: {
    moviesListIds: MOCK_MOVIE_IDS,
  },
};

export const mock_create_room = {
  name: '3/4/2024-JEST_MOCK-Demon slayer',
  media_story_id: '3/4/2024-JEST_MOCK-Demon slayer',
  messages: [],
};
