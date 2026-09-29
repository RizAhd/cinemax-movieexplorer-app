import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import { getMovie } from '../services/movies';

// Start of every TMDb poster url
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Details page for one movie
function MovieDetails() {
  // Read the movie id from the url, for example /movie/550
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load the movie when the page opens (or when the id changes)
  useEffect(() => {
    // If the id changes before this finishes, we ignore the old answer
    let ignore = false;

    setLoading(true);
    setError('');

    getMovie(id)
      .then((data) => {
        if (!ignore) {
          setMovie(data);
        }
      })
      .catch(() => {
        // Simple message for now, better error handling comes later
        if (!ignore) {
          setError('Could not load this movie.');
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
  }, [id]);

  // Small pieces of text for the info line
  const year = movie && movie.release_date ? movie.release_date.slice(0, 4) : '';
  const runtime = movie && movie.runtime ? `${movie.runtime} min` : '';
  const rating = movie && movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Container sx={{ py: 3 }}>
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back
      </Button>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && movie && (
        // Column on phones (poster on top), row on bigger screens (poster on the left)
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Poster */}
          {movie.poster_path ? (
            <Box
              component="img"
              src={IMAGE_URL + movie.poster_path}
              alt={movie.title}
              sx={{
                width: '100%',
                maxWidth: 300,
                alignSelf: { xs: 'center', md: 'flex-start' },
                borderRadius: 2,
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                maxWidth: 300,
                aspectRatio: '2 / 3',
                alignSelf: { xs: 'center', md: 'flex-start' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'action.hover',
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary">No image</Typography>
            </Box>
          )}

          {/* Text details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1">
              {movie.title}
            </Typography>

            {movie.tagline && (
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {movie.tagline}
              </Typography>
            )}

            {/* Year, runtime and rating on one line */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2, flexWrap: 'wrap' }}>
              {year && <Typography color="text.secondary">{year}</Typography>}
              {runtime && <Typography color="text.secondary">{runtime}</Typography>}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon color="secondary" fontSize="small" />
                <Typography>{rating}</Typography>
              </Box>
            </Box>

            {/* Genres */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {movie.genres.map((genre) => (
                <Chip key={genre.id} label={genre.name} />
              ))}
            </Box>

            {/* Overview */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Overview
            </Typography>
            <Typography>{movie.overview || 'No overview available.'}</Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default MovieDetails;
