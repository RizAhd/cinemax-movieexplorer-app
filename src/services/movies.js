import tmdb from './tmdb';

function toPage(data) {
  const results = data && Array.isArray(data.results) ? data.results.filter(Boolean) : [];
  const totalPages = data && Number(data.total_pages) > 0 ? Number(data.total_pages) : 1;
  return { results, totalPages };
}

export async function getTrending(page = 1) {
  const response = await tmdb.get('/trending/movie/week', {
    params: { page: page },
  });
  return toPage(response.data);
}

export async function getGenres() {
  const response = await tmdb.get('/genre/movie/list');
  const genres = response.data && response.data.genres;
  return Array.isArray(genres) ? genres : [];
}

export async function getMovie(id) {
  const response = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' },
  });
  const data = response.data;

  // genres, cast and videos are always arrays, so the pages can use them without checks
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

export async function searchMovies(query, page = 1, year = '') {
  const params = { query, page };
  if (year !== '') {
    params.primary_release_year = year;
  }
  const response = await tmdb.get('/search/movie', { params });
  return toPage(response.data);
}

export async function discoverMovies(filters, page = 1) {
  const params = {
    page,
    include_adult: false,
    sort_by: 'popularity.desc',
    // otherwise a "9+" filter returns movies with three votes
    'vote_count.gte': 50,
  };
  if (filters.genre !== '') {
    params.with_genres = filters.genre;
  }
  if (filters.year !== '') {
    params.primary_release_year = filters.year;
  }
  if (filters.rating !== '') {
    params['vote_average.gte'] = filters.rating;
  }
  const response = await tmdb.get('/discover/movie', { params });
  return toPage(response.data);
}
