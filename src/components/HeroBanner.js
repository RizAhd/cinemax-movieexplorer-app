import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { BACKDROP_URL } from '../services/tmdb';

// Big banner for one featured movie, shown at the top of the home page
function HeroBanner({ movie }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 340, md: 460 },
        borderRadius: '24px',
        overflow: 'hidden',
        // The wide movie picture fills the whole banner
        backgroundImage: `url(${BACKDROP_URL + movie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // The text is always white because it sits on top of a picture
        color: 'white',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Dark gradient so the white text is easy to read on any picture */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      {/* Text and button, on top of the gradient */}
      <Box sx={{ position: 'relative', p: { xs: 2.5, md: 5 }, maxWidth: 640 }}>
        <Typography
          variant="overline"
          sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2 }}
        >
          Trending now
        </Typography>

        <Typography
          variant="h3"
          component="h2"
          sx={{ fontSize: { xs: '1.75rem', md: '3rem' }, lineHeight: 1.15, mb: 1 }}
        >
          {movie.title}
        </Typography>

        {/* Year and rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          {year && <Typography>{year}</Typography>}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon color="secondary" fontSize="small" />
            <Typography sx={{ fontWeight: 700 }}>{rating}</Typography>
          </Box>
        </Box>

        {/* Overview, cut after 2 lines on phones and 3 lines on bigger screens */}
        <Typography
          sx={{
            mb: 2.5,
            opacity: 0.9,
            display: '-webkit-box',
            WebkitLineClamp: { xs: 2, md: 3 },
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {movie.overview}
        </Typography>

        <Button
          variant="contained"
          size="large"
          component={Link}
          to={`/movie/${movie.id}`}
          startIcon={<InfoOutlinedIcon />}
        >
          View details
        </Button>
      </Box>
    </Box>
  );
}

export default HeroBanner;
