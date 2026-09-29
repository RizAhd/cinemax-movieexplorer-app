import axios from 'axios';

export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500'; // movie posters
export const PROFILE_URL = 'https://image.tmdb.org/t/p/w185'; // actor photos
export const BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280'; // wide background pictures

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  // a stuck request ends with an error after 10 seconds instead of loading forever
  timeout: 10000,
  params: {
    api_key: process.env.REACT_APP_TMDB_KEY,
    language: 'en-US',
  },
});

export default tmdb;
