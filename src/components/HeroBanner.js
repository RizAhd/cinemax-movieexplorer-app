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

const SLIDE_TIME = 6000;

const fillProgress = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

function Slide({ movie, rank, active }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Box
      aria-hidden={!active}
      sx={{
        position: 'relative',
        flex: '0 0 100%',
        height: '100%',
        backgroundImage: `url(${BACKDROP_URL + movie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.1) 100%)',
        }}
      />

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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          {year && <Typography>{year}</Typography>}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon color="secondary" fontSize="small" />
            <Typography sx={{ fontWeight: 700 }}>{rating}</Typography>
          </Box>
        </Box>

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
          tabIndex={active ? 0 : -1}
        >
          View details
        </Button>
      </Box>
    </Box>
  );
}

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
        display: { xs: 'none', md: 'inline-flex' },
      }}
    >
      {children}
    </IconButton>
  );
}

function HeroBanner({ movies }) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const touchStartX = useRef(null);

  const count = movies.length;
  const current = Math.min(index, count - 1);

  const isPlaying = count > 1 && !hovering && !keyboardFocus && !userPaused;

  const goNext = () => setIndex((current + 1) % count);
  const goPrevious = () => setIndex((current - 1 + count) % count);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const timer = setTimeout(() => {
      setIndex((current + 1) % count);
    }, SLIDE_TIME);

    return () => clearTimeout(timer);
  }, [current, isPlaying, count]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };
  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) {
      return;
    }
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    // a swipe of more than 50px changes the slide
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
      // pause only for a real mouse (a tap fakes a mouse enter that never ends) and only for
      // keyboard focus (clicking a dot or an arrow must not stop the slideshow)
      onPointerEnter={(event) => setHovering(event.pointerType === 'mouse')}
      onPointerLeave={() => setHovering(false)}
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

      {count > 1 && (
        <>
          <ArrowButton side="left" label="previous movie" onClick={goPrevious}>
            <ChevronLeftIcon />
          </ArrowButton>
          <ArrowButton side="right" label="next movie" onClick={goNext}>
            <ChevronRightIcon />
          </ArrowButton>

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
                    // a new key restarts the fill when the slide or the play state changes
                    <Box
                      key={`${current}-${isPlaying}`}
                      sx={{
                        height: '100%',
                        bgcolor: 'primary.main',
                        borderRadius: 999,
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
