import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MovieDetails from '../components/MovieDetails';
import ErrorMessage from '../components/ErrorMessage';
import { getMovie } from '../services/movies';
import { getErrorMessage } from '../services/errorMessage';

function MovieDetailsPage() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError('');

    getMovie(id)
      .then((data) => {
        if (!ignore) {
          setMovie(data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(getErrorMessage(err));
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id, retryCount]);

  return (
    <Container sx={{ py: 3 }}>
      {/* ml -2.5 cancels the button's own padding so the text lines up with the page edge */}
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2, ml: -2.5 }}>
        Back
      </Button>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <ErrorMessage message={error} onRetry={() => setRetryCount(retryCount + 1)} />}

      {!loading && !error && movie && <MovieDetails movie={movie} />}
    </Container>
  );
}

export default MovieDetailsPage;
