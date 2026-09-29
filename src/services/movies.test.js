import { getTrending, searchMovies, discoverMovies, getGenres, getMovie } from './movies';
import tmdb from './tmdb';

// We replace the real axios instance with a fake one, so the tests never use the internet
jest.mock('./tmdb', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

// Makes the fake API answer with the given data
const answerWith = (data) => tmdb.get.mockResolvedValue({ data });

describe('movie service with odd answers from the API', () => {
  test('getTrending returns the movies and the number of pages', async () => {
    answerWith({ results: [{ id: 1 }, { id: 2 }], total_pages: 7 });
    expect(await getTrending()).toEqual({ results: [{ id: 1 }, { id: 2 }], totalPages: 7 });
  });

  test('getTrending gives an empty list and 1 page when the answer has no results', async () => {
    answerWith({});
    expect(await getTrending()).toEqual({ results: [], totalPages: 1 });
  });

  test('searchMovies removes empty items from the list', async () => {
    answerWith({ results: [{ id: 1 }, null, { id: 3 }], total_pages: 2 });
    const page = await searchMovies('batman');
    expect(page.results).toEqual([{ id: 1 }, { id: 3 }]);
  });

  test('searchMovies survives an answer that is not an object', async () => {
    answerWith('<html>error page</html>');
    expect(await searchMovies('batman')).toEqual({ results: [], totalPages: 1 });
  });

  test('searchMovies sends the year only when there is one', async () => {
    answerWith({ results: [], total_pages: 1 });
    await searchMovies('batman', 2, 2008);
    expect(tmdb.get).toHaveBeenLastCalledWith('/search/movie', {
      params: { query: 'batman', page: 2, primary_release_year: 2008 },
    });
    await searchMovies('batman');
    expect(tmdb.get).toHaveBeenLastCalledWith('/search/movie', { params: { query: 'batman', page: 1 } });
  });

  test('discoverMovies sends every chosen filter to TMDb', async () => {
    answerWith({ results: [{ id: 1 }], total_pages: 4 });
    const page = await discoverMovies({ genre: 28, year: 2010, rating: 7 }, 3);
    expect(tmdb.get).toHaveBeenCalledWith('/discover/movie', {
      params: expect.objectContaining({
        page: 3,
        with_genres: 28,
        primary_release_year: 2010,
        'vote_average.gte': 7,
        'vote_count.gte': 50,
      }),
    });
    expect(page).toEqual({ results: [{ id: 1 }], totalPages: 4 });
  });

  test('discoverMovies leaves out the filters that are empty', async () => {
    answerWith({ results: [], total_pages: 1 });
    await discoverMovies({ genre: 35, year: '', rating: '' });
    const { params } = tmdb.get.mock.calls[0][1];
    expect(params.with_genres).toBe(35);
    expect(params).not.toHaveProperty('primary_release_year');
    expect(params).not.toHaveProperty('vote_average.gte');
  });

  test('getGenres gives an empty list when genres is missing or not a list', async () => {
    answerWith({ genres: 'nope' });
    expect(await getGenres()).toEqual([]);
    answerWith({});
    expect(await getGenres()).toEqual([]);
  });

  test('getMovie always gives arrays for genres, cast and videos', async () => {
    // A movie that came without genres, credits and videos
    answerWith({ id: 5, title: 'Small Movie' });
    const movie = await getMovie(5);
    expect(movie.title).toBe('Small Movie');
    expect(movie.genres).toEqual([]);
    expect(movie.credits.cast).toEqual([]);
    expect(movie.videos.results).toEqual([]);
  });

  test('getMovie keeps the real genres, cast and videos', async () => {
    answerWith({
      id: 5,
      genres: [{ id: 1, name: 'Drama' }],
      credits: { cast: [{ id: 9, name: 'An Actor' }] },
      videos: { results: [{ key: 'abc' }] },
    });
    const movie = await getMovie(5);
    expect(movie.genres).toHaveLength(1);
    expect(movie.credits.cast[0].name).toBe('An Actor');
    expect(movie.videos.results[0].key).toBe('abc');
  });

  test('getMovie throws when the answer is not a movie object', async () => {
    answerWith('not a movie');
    await expect(getMovie(5)).rejects.toThrow();
    answerWith(null);
    await expect(getMovie(5)).rejects.toThrow();
  });
});
