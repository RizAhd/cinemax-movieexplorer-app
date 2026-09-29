import axios from 'axios';

// Start of every TMDb image url. Add a poster_path or profile_path to the end.
export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500'; // movie posters
export const PROFILE_URL = 'https://image.tmdb.org/t/p/w185'; // actor photos

// One axios instance that all TMDb calls will use.
// The API key comes from the .env file (REACT_APP_TMDB_KEY).
const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.REACT_APP_TMDB_KEY,
    language: 'en-US',
  },
});

export default tmdb;
