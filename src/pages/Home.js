import { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';
import useLocalStorage from '../hooks/useLocalStorage';
import { getTrending, searchMovies } from '../services/movies';

// Home page: shows trending movies, or search results when the user types
function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // The search text is saved in localStorage, so the last search is remembered
  const [query, setQuery] = useLocalStorage('lastSearch', '');

  // For infinite scroll
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState('');

  // The invisible box at the bottom of the grid. When it comes into view, we load more.
  const bottomRef = useRef(null);
  // Remembers the latest search text, so old answers can be ignored
  const latestSearch = useRef('');

  // Wait until the user stops typing before we search
  const debouncedQuery = useDebounce(query, 500);
  const searchText = debouncedQuery.trim();

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
      .catch(() => {
        // Simple message for now, better error handling comes later
        if (!ignore) {
          setError('Could not load movies.');
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
  }, [searchText]);

  // Infinite scroll: watch the bottom box and load the next page when it is visible
  useEffect(() => {
    const target = bottomRef.current;
    if (!target) {
      return;
    }

    // Load the next page and add it to the list
    const loadMore = () => {
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
        .catch(() => {
          if (latestSearch.current === requestedText) {
            setMoreError('Could not load more movies.');
          }
        })
        .finally(() => {
          setLoadingMore(false);
        });
    };

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
  }, [movies, page, totalPages, loading, loadingMore, moreError, searchText]);

  return (
    <Container sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <SearchBar value={query} onChange={setQuery} />
      </Box>

      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        {searchText === '' ? 'Trending this week' : `Results for "${searchText}"`}
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {/* Search finished but nothing was found */}
      {!loading && !error && movies.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No movies found for "{searchText}". Try another title.
        </Typography>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} />

          {/* This empty box is what the scroll watcher looks at */}
          <Box ref={bottomRef} sx={{ height: 1 }} />

          {loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {moreError && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {moreError}
            </Typography>
          )}
        </>
      )}
    </Container>
  );
}

export default Home;
