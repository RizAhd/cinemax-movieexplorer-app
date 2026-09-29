import tmdb from './tmdb';

// Get the trending movies of the week.
// Returns an array of movies (each one has id, title, poster_path, etc.)
export async function getTrending() {
  const response = await tmdb.get('/trending/movie/week');
  return response.data.results;
}

// Get the list of all movie genres, for example [{ id: 28, name: 'Action' }, ...]
export async function getGenres() {
  const response = await tmdb.get('/genre/movie/list');
  return response.data.genres;
}

// Get the full details of one movie by its id.
// append_to_response adds the cast (credits) and trailers (videos) to the same answer.
// Returns one movie object (title, overview, genres, credits, videos, etc.)
export async function getMovie(id) {
  const response = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' },
  });
  return response.data;
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
