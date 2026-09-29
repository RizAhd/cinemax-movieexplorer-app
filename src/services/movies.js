import tmdb from './tmdb';

// Get the trending movies of the week.
// Returns an array of movies (each one has id, title, poster_path, etc.)
export async function getTrending() {
  const response = await tmdb.get('/trending/movie/week');
  return response.data.results;
}
