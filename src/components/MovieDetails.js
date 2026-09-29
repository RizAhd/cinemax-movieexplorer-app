import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CastList from './CastList';
import TrailerEmbed, { findTrailer } from './TrailerEmbed';
import RatingCircle from './RatingCircle';
import SectionTitle from './SectionTitle';
import { useAppContext } from '../context/AppContext';
import { IMAGE_URL, BACKDROP_URL } from '../services/tmdb';

function MovieDetails({ movie }) {
  const { isFavorite, toggleFavorite } = useAppContext();

  const favorite = isFavorite(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const runtime = movie.runtime ? `${movie.runtime} min` : '';
  const language = movie.original_language ? movie.original_language.toUpperCase() : '';
  const trailer = findTrailer(movie.videos.results);

  const scrollToTrailer = () => {
    const section = document.getElementById('trailer');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: { xs: 200, md: 340 },
          borderRadius: '24px 24px 0 0',
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

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-end' },
          gap: { xs: 2, md: 4 },
          px: { md: 4 },
          // pulls the poster up so it overlaps the backdrop
          mt: { xs: -10, md: -16 },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        {movie.poster_path ? (
          <Box
            component="img"
            src={IMAGE_URL + movie.poster_path}
            alt={movie.title}
            sx={{ width: { xs: 160, md: 250 }, flexShrink: 0, borderRadius: '16px', boxShadow: 8 }}
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

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            {movie.genres.map((genre) => (
              <Chip key={genre.id} label={genre.name} color="primary" />
            ))}
          </Box>

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
              variant={favorite ? 'contained' : 'outlined'}
              startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => toggleFavorite(movie)}
            >
              {favorite ? 'In favorites' : 'Add to favorites'}
            </Button>

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

      <Box
        sx={{
          mt: 5,
          display: 'grid',
          gap: 5,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1.4fr)' },
        }}
      >
        <Box>
          <SectionTitle>Overview</SectionTitle>
          <Typography sx={{ lineHeight: 1.8 }}>{movie.overview || 'No overview available.'}</Typography>
        </Box>

        <Box id="trailer" sx={{ scrollMarginTop: '90px' }}>
          <SectionTitle>Trailer</SectionTitle>
          <TrailerEmbed videos={movie.videos.results} />
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <SectionTitle>Cast</SectionTitle>
        <CastList cast={movie.credits.cast} />
      </Box>
    </Box>
  );
}

export default MovieDetails;
