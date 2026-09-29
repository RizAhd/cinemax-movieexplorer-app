import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import MovieGrid from '../components/MovieGrid';
import { getTrending } from '../services/movies';

// Home page: shows the trending movies
function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load the trending movies one time when the page opens
  useEffect(() => {
    getTrending()
      .then((results) => {
        setMovies(results);
      })
      .catch(() => {
        // Simple message for now, better error handling comes later
        setError('Could not load movies.');
      })
      .finally(() => {
        // Loading is over, whether it worked or not
        setLoading(false);
      });
  }, []);

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        Trending this week
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && <MovieGrid movies={movies} />}
    </Container>
  );
}

export default Home;
