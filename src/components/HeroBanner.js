import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { BACKDROP_URL } from '../services/tmdb';

// How long each slide stays, in milliseconds
const SLIDE_TIME = 6000;

// Animation for the progress bar on the active dot: it fills from 0% to 100% width
const fillProgress = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

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
      {/* On bigger screens the text starts further right, so the left arrow never covers it */}
      <Box
        sx={{
          position: 'relative',
          p: { xs: 2.5, md: 5 },
          px: { xs: 2.5, md: 10 },
          pb: { xs: 6, md: 7 },
          maxWidth: 640,
        }}
      >
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
  // true while a real mouse is over the banner
  const [hovering, setHovering] = useState(false);
  // true while a keyboard user has focus on a control inside the banner
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  // true when the user pressed the pause button
  const [userPaused, setUserPaused] = useState(false);
  // Where the finger touched the screen (for swiping)
  const touchStartX = useRef(null);

  const count = movies.length;
  // Stay inside the list, even if the list gets shorter
  const current = Math.min(index, count - 1);

  // The banner slides by itself unless it is paused in some way
  const isPlaying = count > 1 && !hovering && !keyboardFocus && !userPaused;

  const goNext = () => setIndex((current + 1) % count);
  const goPrevious = () => setIndex((current - 1 + count) % count);

  // Auto sliding: wait a few seconds, then go to the next slide.
  // The timer starts again every time the slide changes, also when the user changes it.
  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const timer = setTimeout(() => {
      setIndex((current + 1) % count);
    }, SLIDE_TIME);

    return () => clearTimeout(timer);
  }, [current, isPlaying, count]);

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
      // Pause only for a real mouse. Touch screens fake a mouse enter that never ends.
      onPointerEnter={(event) => setHovering(event.pointerType === 'mouse')}
      onPointerLeave={() => setHovering(false)}
      // Pause only for keyboard focus. Clicking a dot or an arrow must not stop the sliding.
      onFocus={(event) => setKeyboardFocus(event.target.matches(':focus-visible'))}
      onBlur={() => setKeyboardFocus(false)}
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

      {/* Arrows, pause button and dots only make sense with more than one slide */}
      {count > 1 && (
        <>
          <ArrowButton side="left" label="previous movie" onClick={goPrevious}>
            <ChevronLeftIcon />
          </ArrowButton>
          <ArrowButton side="right" label="next movie" onClick={goNext}>
            <ChevronRightIcon />
          </ArrowButton>

          {/* Bottom right: pause button and one dot for each slide */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 14, md: 22 },
              right: { xs: 16, md: 36 },
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={() => setUserPaused(!userPaused)}
              aria-label={userPaused ? 'play slideshow' : 'pause slideshow'}
              sx={{ color: 'white', bgcolor: 'rgba(0, 0, 0, 0.45)', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' } }}
            >
              {userPaused ? <PlayArrowIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
            </IconButton>

            {movies.map((movie, position) => {
              const isCurrent = position === current;
              return (
                <Box
                  key={movie.id}
                  component="button"
                  type="button"
                  aria-label={`Go to movie ${position + 1}`}
                  aria-current={isCurrent}
                  onClick={() => setIndex(position)}
                  sx={{
                    position: 'relative',
                    // The dot of the visible slide is a longer bar that shows the progress
                    width: isCurrent ? 34 : 8,
                    height: 8,
                    p: 0,
                    border: 'none',
                    borderRadius: 999,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    bgcolor: 'rgba(255, 255, 255, 0.55)',
                    transition: 'width 0.3s',
                  }}
                >
                  {isCurrent && (
                    // The red part grows from 0 to full while we wait for the next slide.
                    // A new key restarts it when the slide changes or the play state changes.
                    <Box
                      key={`${current}-${isPlaying}`}
                      sx={{
                        height: '100%',
                        bgcolor: 'primary.main',
                        borderRadius: 999,
                        // When paused the bar stays full
                        width: isPlaying ? undefined : '100%',
                        animation: isPlaying ? `${fillProgress} ${SLIDE_TIME}ms linear forwards` : 'none',
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}

export default HeroBanner;
