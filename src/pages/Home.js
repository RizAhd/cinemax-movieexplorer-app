import { useState, useEffect, useRef, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ErrorMessage from '../components/ErrorMessage';
import useDebounce from '../hooks/useDebounce';
import useLocalStorage from '../hooks/useLocalStorage';
import { getTrending, searchMovies, getGenres } from '../services/movies';
import { getErrorMessage } from '../services/errorMessage';

// Home page: shows trending movies, or search results when the user types
function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // The search text is saved in localStorage, so the last search is remembered
  const [query, setQuery] = useLocalStorage('lastSearch', '');

  // Filters: '' means "all". genre is a genre id, year is a number like 1999,
  // rating is the lowest rating to show, like 7.
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '' });
  // The genre list for the dropdown
  const [genres, setGenres] = useState([]);

  // How more movies are loaded: 'scroll' (infinite scroll) or 'button' (Load More button).
  // Saved in localStorage so the choice is remembered.
  const [loadMode, setLoadMode] = useLocalStorage('loadMode', 'scroll');

  // For loading more pages
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState('');

  // Going up by one makes the first load run again (used by the Retry button)
  const [retryCount, setRetryCount] = useState(0);

  // The invisible box at the bottom of the grid. When it comes into view, we load more.
  const bottomRef = useRef(null);
  // Remembers the latest search text, so old answers can be ignored
  const latestSearch = useRef('');

  // Wait until the user stops typing before we search
  const debouncedQuery = useDebounce(query, 500);
  const searchText = debouncedQuery.trim();

  // Load the genre names one time for the dropdown
  useEffect(() => {
    getGenres()
      .then((list) => setGenres(list))
      .catch(() => {
        // If this fails the dropdown just stays empty, the rest of the page still works
        setGenres([]);
      });
  }, []);

  // Runs on first load and every time the search text changes (loads page 1)
  useEffect(() => {
    // If the user types again before this finishes, we ignore the old answer
    let ignore = false;
    latestSearch.current = searchText;

    setLoading(true);
    setError('');
    setMoreError('');
    setPage(1);

    // No text means trending (one page only), some text means search
    let request;
    if (searchText === '') {
      request = getTrending().then((results) => ({ results, totalPages: 1 }));
    } else {
      request = searchMovies(searchText, 1);
    }

    request
      .then((data) => {
        if (!ignore) {
          setMovies(data.results);
          setTotalPages(data.totalPages);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(getErrorMessage(err));
        }
      })
      .finally(() => {
        // Loading is over, whether it worked or not
        if (!ignore) {
          setLoading(false);
        }
      });

    // Cleanup: runs before the next search starts
    return () => {
      ignore = true;
    };
  }, [searchText, retryCount]);

  // Load the next page and add it to the list.
  // Both the scroll watcher and the Load More button use this function.
  const loadMore = useCallback(() => {
    const noMorePages = page >= totalPages;
    // Trending has one page, and we do not load while another load is running
    if (searchText === '' || noMorePages || loading || loadingMore || moreError) {
      return;
    }

    const nextPage = page + 1;
    const requestedText = searchText;
    setLoadingMore(true);

    searchMovies(requestedText, nextPage)
      .then((data) => {
        // The user searched for something else in the meantime, so ignore this
        if (latestSearch.current !== requestedText) {
          return;
        }
        // TMDb can send the same movie twice, so we skip movies we already have
        setMovies((oldMovies) => {
          const oldIds = oldMovies.map((movie) => movie.id);
          const newMovies = data.results.filter((movie) => !oldIds.includes(movie.id));
          return [...oldMovies, ...newMovies];
        });
        setPage(nextPage);
      })
      .catch((err) => {
        if (latestSearch.current === requestedText) {
          setMoreError(getErrorMessage(err));
        }
      })
      .finally(() => {
        setLoadingMore(false);
      });
  }, [page, totalPages, loading, loadingMore, moreError, searchText]);

  // Infinite scroll: watch the bottom box and load the next page when it is visible
  useEffect(() => {
    // In Load More button mode we do not watch the scroll
    if (loadMode !== 'scroll') {
      return;
    }

    const target = bottomRef.current;
    if (!target) {
      return;
    }

    // The 200px margin starts loading a little before the user reaches the bottom
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(target);

    // Cleanup: stop watching before the next run
    return () => {
      observer.disconnect();
    };
    // filters is in the list so we check again after a filter changes
    // (if few movies match, the bottom box stays visible and more pages load)
  }, [loadMode, loadMore, movies, filters]);

  // Are there more pages to load? (only search results have pages)
  const hasMore = searchText !== '' && page < totalPages;

  // Only the movies that match the chosen filters
  const visibleMovies = movies.filter((movie) => {
    const movieGenres = movie.genre_ids || [];
    // release_date looks like "1999-10-15", so the first 4 letters are the year
    const movieYear = movie.release_date ? Number(movie.release_date.slice(0, 4)) : null;

    const genreOk = filters.genre === '' || movieGenres.includes(filters.genre);
    const yearOk = filters.year === '' || movieYear === filters.year;
    // vote_average is the rating from 0 to 10
    const ratingOk = filters.rating === '' || movie.vote_average >= filters.rating;

    // A movie must pass every filter
    return genreOk && yearOk && ratingOk;
  });

  return (
    <Container sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <SearchBar value={query} onChange={setQuery} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <FilterBar filters={filters} genres={genres} onChange={setFilters} />
        {/* Switch between infinite scroll and the Load More button */}
        <FormControlLabel
          control={
            <Switch
              checked={loadMode === 'button'}
              onChange={(event) => setLoadMode(event.target.checked ? 'button' : 'scroll')}
            />
          }
          label="Use Load More button"
          sx={{ mt: 1 }}
        />
      </Box>

      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        {searchText === '' ? 'Trending this week' : `Results for "${searchText}"`}
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <ErrorMessage message={error} onRetry={() => setRetryCount(retryCount + 1)} />}

      {/* Search finished but nothing was found */}
      {!loading && !error && movies.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No movies found for "{searchText}". Try another title.
        </Typography>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          {visibleMovies.length > 0 ? (
            <MovieGrid movies={visibleMovies} />
          ) : (
            // Movies were loaded, but none match the filters
            <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
              No movies match your filters.
            </Typography>
          )}

          {/* Scroll mode: this empty box is what the scroll watcher looks at */}
          {loadMode === 'scroll' && <Box ref={bottomRef} sx={{ height: 1 }} />}

          {/* Button mode: a button to load the next page */}
          {loadMode === 'button' && hasMore && !loadingMore && !moreError && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="outlined" onClick={loadMore}>
                Load more
              </Button>
            </Box>
          )}

          {loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Retry clears the error, which lets the scroll watcher try again */}
          {moreError && <ErrorMessage message={moreError} onRetry={() => setMoreError('')} />}
        </>
      )}
    </Container>
  );
}

export default Home;
