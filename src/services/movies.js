import tmdb from './tmdb';

// Turns a TMDb list answer into { results, totalPages }, even if some parts are missing.
// results is always an array (without empty items) and totalPages is always at least 1.
function toPage(data) {
  const results = data && Array.isArray(data.results) ? data.results.filter(Boolean) : [];
  const totalPages = data && Number(data.total_pages) > 0 ? Number(data.total_pages) : 1;
  return { results, totalPages };
}

// Get the trending movies of the week. TMDb sends them in pages of about 20 movies.
// Returns { results: [movies], totalPages: number }
export async function getTrending(page = 1) {
  const response = await tmdb.get('/trending/movie/week', {
    params: { page: page },
  });
  return toPage(response.data);
}

// Get the list of all movie genres, for example [{ id: 28, name: 'Action' }, ...]
export async function getGenres() {
  const response = await tmdb.get('/genre/movie/list');
  const genres = response.data && response.data.genres;
  return Array.isArray(genres) ? genres : [];
}

// Get the full details of one movie by its id.
// append_to_response adds the cast (credits) and trailers (videos) to the same answer.
// Returns one movie object. genres, credits.cast and videos.results are always arrays,
// so the pages can use them without checking.
export async function getMovie(id) {
  const response = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' },
  });
  const data = response.data;

  // If the answer is not a movie object, treat it as an error
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The movie server sent an answer we do not understand.');
  }

  return {
    ...data,
    genres: Array.isArray(data.genres) ? data.genres : [],
    credits: { cast: data.credits && Array.isArray(data.credits.cast) ? data.credits.cast : [] },
    videos: { results: data.videos && Array.isArray(data.videos.results) ? data.videos.results : [] },
  };
}

// Search movies by name. TMDb sends results in pages of about 20 movies.
// Returns { results: [movies], totalPages: number }
export async function searchMovies(query, page = 1) {
  const response = await tmdb.get('/search/movie', {
    params: { query: query, page: page },
  });
  return toPage(response.data);
}
