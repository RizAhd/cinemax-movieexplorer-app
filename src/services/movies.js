import tmdb from './tmdb';

// Get the trending movies of the week.
// Returns an array of movies (each one has id, title, poster_path, etc.)
export async function getTrending() {
  const response = await tmdb.get('/trending/movie/week');
  return response.data.results;
}

// Search movies by name. TMDb sends results in pages of about 20 movies.
// Returns { results: [movies], totalPages: number }
export async function searchMovies(query, page = 1) {
  const response = await tmdb.get('/search/movie', {
    params: { query: query, page: page },
  });
  return {
    results: response.data.results,
    totalPages: response.data.total_pages,
  };
}
