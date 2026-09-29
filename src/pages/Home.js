import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';
import { getTrending, searchMovies } from '../services/movies';

// Home page: shows trending movies, or search results when the user types
function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  // Wait until the user stops typing before we search
  const debouncedQuery = useDebounce(query, 500);
  const searchText = debouncedQuery.trim();

  // Runs on first load and every time the search text changes
  useEffect(() => {
    // If the user types again before this finishes, we ignore the old answer
    let ignore = false;

    setLoading(true);
    setError('');

    // No text means trending, some text means search
    const request = searchText === '' ? getTrending() : searchMovies(searchText);

    request
      .then((results) => {
        if (!ignore) {
          setMovies(results);
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

      {!loading && !error && movies.length > 0 && <MovieGrid movies={movies} />}
    </Container>
  );
}

export default Home;
