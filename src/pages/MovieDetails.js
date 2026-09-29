import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CastList from '../components/CastList';
import TrailerEmbed, { findTrailer } from '../components/TrailerEmbed';
import { useAppContext } from '../context/AppContext';
import ErrorMessage from '../components/ErrorMessage';
import RatingCircle from '../components/RatingCircle';
import SectionTitle from '../components/SectionTitle';
import { getMovie } from '../services/movies';
import { getErrorMessage } from '../services/errorMessage';
import { IMAGE_URL, BACKDROP_URL } from '../services/tmdb';

// Details page for one movie
function MovieDetails() {
  // Read the movie id from the url, for example /movie/550
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useAppContext();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Going up by one makes the movie load again (used by the Retry button)
  const [retryCount, setRetryCount] = useState(0);

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

  // Small pieces of text for the chips
  const year = movie && movie.release_date ? movie.release_date.slice(0, 4) : '';
  const runtime = movie && movie.runtime ? `${movie.runtime} min` : '';
  const language = movie && movie.original_language ? movie.original_language.toUpperCase() : '';

  // The trailer video (or nothing if the movie has none)
  const trailer = movie ? findTrailer(movie.videos.results) : undefined;

  // Scroll smoothly down to the trailer section
  const scrollToTrailer = () => {
    const section = document.getElementById('trailer');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

      {error && <ErrorMessage message={error} onRetry={() => setRetryCount(retryCount + 1)} />}

      {!loading && !error && movie && (
        <Box>
          {/* Wide backdrop picture that fades into the page color at the bottom */}
          <Box
            sx={{
              position: 'relative',
              height: { xs: 200, md: 340 },
              borderRadius: '24px',
              overflow: 'hidden',
              bgcolor: 'action.hover',
              backgroundImage: movie.backdrop_path ? `url(${BACKDROP_URL + movie.backdrop_path})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Box
              sx={(theme) => ({
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.1)} 0%, ${theme.palette.background.default} 100%)`,
              })}
            />
          </Box>

          {/* Poster and main info. The negative margin pulls them up over the backdrop. */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-end' },
              gap: { xs: 2, md: 4 },
              px: { md: 4 },
              mt: { xs: -10, md: -16 },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {/* Poster */}
            {movie.poster_path ? (
              <Box
                component="img"
                src={IMAGE_URL + movie.poster_path}
                alt={movie.title}
                sx={{
                  width: { xs: 160, md: 250 },
                  flexShrink: 0,
                  borderRadius: '16px',
                  boxShadow: 8,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: { xs: 160, md: 250 },
                  flexShrink: 0,
                  aspectRatio: '2 / 3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                  borderRadius: '16px',
                }}
              >
                <Typography color="text.secondary">No image</Typography>
              </Box>
            )}

            {/* Title, rating, chips and genres */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, lineHeight: 1.15 }}
              >
                {movie.title}
              </Typography>

              {movie.tagline && (
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                  {movie.tagline}
                </Typography>
              )}

              {/* Rating circle and the year, runtime and language chips */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  gap: 2,
                  flexWrap: 'wrap',
                  my: 2,
                }}
              >
                <RatingCircle value={movie.vote_average} />
                {year && <Chip variant="outlined" icon={<CalendarMonthIcon />} label={year} />}
                {runtime && <Chip variant="outlined" icon={<AccessTimeIcon />} label={runtime} />}
                {language && <Chip variant="outlined" icon={<LanguageIcon />} label={language} />}
              </Box>

              {/* Genres */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                {movie.genres.map((genre) => (
                  <Chip key={genre.id} label={genre.name} color="primary" />
                ))}
              </Box>

              {/* Action buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mt: 2.5,
                }}
              >
                <Button
                  variant={isFavorite(movie.id) ? 'contained' : 'outlined'}
                  startIcon={isFavorite(movie.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={() => toggleFavorite(movie)}
                >
                  {isFavorite(movie.id) ? 'In favorites' : 'Add to favorites'}
                </Button>

                {/* These two only show when the movie has a trailer */}
                {trailer && (
                  <>
                    <Button variant="outlined" startIcon={<PlayArrowIcon />} onClick={scrollToTrailer}>
                      Watch trailer
                    </Button>
                    <Button
                      variant="text"
                      endIcon={<OpenInNewIcon />}
                      component="a"
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      YouTube
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Box>

          {/* Sections under the header */}
          <Box sx={{ mt: 5 }}>
            <SectionTitle>Overview</SectionTitle>
            <Typography sx={{ maxWidth: 800, lineHeight: 1.8 }}>
              {movie.overview || 'No overview available.'}
            </Typography>
          </Box>

          {/* Trailer (the videos came with the movie because of append_to_response) */}
          {/* scrollMarginTop leaves room for the sticky navbar when we scroll here */}
          <Box id="trailer" sx={{ mt: 5, scrollMarginTop: '90px' }}>
            <SectionTitle>Trailer</SectionTitle>
            <TrailerEmbed videos={movie.videos.results} />
          </Box>

          {/* Cast (it came with the movie because of append_to_response) */}
          <Box sx={{ mt: 5 }}>
            <SectionTitle>Cast</SectionTitle>
            <CastList cast={movie.credits.cast} />
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default MovieDetails;
