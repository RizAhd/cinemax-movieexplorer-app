import axios from 'axios';

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
