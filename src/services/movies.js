import tmdb from './tmdb';

// Get the trending movies of the week.
// Returns an array of movies (each one has id, title, poster_path, etc.)
export async function getTrending() {
  const response = await tmdb.get('/trending/movie/week');
  return response.data.results;
}

// Search movies by name.
// Returns an array of movies that match the text.
export async function searchMovies(query) {
  const response = await tmdb.get('/search/movie', {
    params: { query: query },
  });
  return response.data.results;
}
