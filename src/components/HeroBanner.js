import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { BACKDROP_URL } from '../services/tmdb';

// How long each slide stays, in milliseconds
const SLIDE_TIME = 6000;

// One slide: a big picture with the movie info on top
// rank = 1 for the first slide, 2 for the second, ...
// active = true for the slide the user can see right now
function Slide({ movie, rank, active }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Box
      // Slides that are not visible are hidden from screen readers
      aria-hidden={!active}
      sx={{
        position: 'relative',
        // Every slide is as wide as the banner, so they sit side by side in a row
        flex: '0 0 100%',
        height: '100%',
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
      <Box sx={{ position: 'relative', p: { xs: 2.5, md: 5 }, pb: { xs: 6, md: 7 }, maxWidth: 640 }}>
        <Typography
          variant="overline"
          sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2 }}
        >
          #{rank} Trending
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
          // Keyboard users can only reach the button of the visible slide
          tabIndex={active ? 0 : -1}
        >
          View details
        </Button>
      </Box>
    </Box>
  );
}

// A round arrow button on the left or right side of the banner
function ArrowButton({ side, label, onClick, children }) {
  return (
    <IconButton
      onClick={onClick}
      aria-label={label}
      sx={{
        position: 'absolute',
        top: '50%',
        [side]: 16,
        transform: 'translateY(-50%)',
        zIndex: 2,
        color: 'white',
        bgcolor: 'rgba(0, 0, 0, 0.45)',
        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
        // Phones use swipe instead, so the arrows only show on bigger screens
        display: { xs: 'none', md: 'inline-flex' },
      }}
    >
      {children}
    </IconButton>
  );
}

// Banner that slides through several movies by itself.
// movies = a list of movies that all have a backdrop_path
function HeroBanner({ movies }) {
  const [index, setIndex] = useState(0);
  // true while the mouse is over the banner or a control has focus
  const [paused, setPaused] = useState(false);
  // Where the finger touched the screen (for swiping)
  const touchStartX = useRef(null);

  // People who set "reduce motion" on their device do not get auto sliding
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const count = movies.length;
  // Stay inside the list, even if the list gets shorter
  const current = Math.min(index, count - 1);

  const goNext = () => setIndex((current + 1) % count);
  const goPrevious = () => setIndex((current - 1 + count) % count);

  // Auto sliding: wait a few seconds, then go to the next slide.
  // The timer starts again every time the slide changes, also when the user changes it.
  useEffect(() => {
    if (paused || reduceMotion || count < 2) {
      return;
    }
    const timer = setTimeout(() => {
      setIndex((current + 1) % count);
    }, SLIDE_TIME);

    return () => clearTimeout(timer);
  }, [current, paused, reduceMotion, count]);

  // Swipe: remember where the finger started, and compare when it lifts
  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };
  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) {
      return;
    }
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    // A swipe of more than 50px changes the slide
    if (distance > 50) {
      goPrevious();
    } else if (distance < -50) {
      goNext();
    }
  };

  return (
    <Box
      role="region"
      aria-roledescription="carousel"
      aria-label="Trending movies"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      sx={{
        position: 'relative',
        height: { xs: 360, md: 480 },
        borderRadius: '24px',
        overflow: 'hidden',
      }}
    >
      {/* The row of slides. Moving it to the left shows the next slide. */}
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          transform: `translateX(-${current * 100}%)`,
          transition: 'transform 0.7s ease',
        }}
      >
        {movies.map((movie, position) => (
          <Slide key={movie.id} movie={movie} rank={position + 1} active={position === current} />
        ))}
      </Box>

      {/* Arrows and dots only make sense with more than one slide */}
      {count > 1 && (
        <>
          <ArrowButton side="left" label="previous movie" onClick={goPrevious}>
            <ChevronLeftIcon />
          </ArrowButton>
          <ArrowButton side="right" label="next movie" onClick={goNext}>
            <ChevronRightIcon />
          </ArrowButton>

          {/* One dot for each slide. The dot of the visible slide is longer and red. */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 20, md: 28 },
              right: { xs: 20, md: 40 },
              zIndex: 2,
              display: 'flex',
              gap: 1,
            }}
          >
            {movies.map((movie, position) => (
              <Box
                key={movie.id}
                component="button"
                type="button"
                aria-label={`Go to movie ${position + 1}`}
                aria-current={position === current}
                onClick={() => setIndex(position)}
                sx={{
                  width: position === current ? 26 : 8,
                  height: 8,
                  p: 0,
                  border: 'none',
                  borderRadius: 999,
                  cursor: 'pointer',
                  bgcolor: position === current ? 'primary.main' : 'rgba(255, 255, 255, 0.55)',
                  transition: 'width 0.3s, background-color 0.3s',
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

export default HeroBanner;
