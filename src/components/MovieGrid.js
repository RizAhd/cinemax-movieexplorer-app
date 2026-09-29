import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

// How many placeholder cards to show while loading
const SKELETON_COUNT = 12;

// Shows a list of movies as a grid of MovieCards.
// While loading is true it shows grey placeholder cards instead.
// Mobile first: 2 columns on phones, more columns on bigger screens.
function MovieGrid({ movies = [], loading = false }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
      }}
    >
      {loading
        ? Array.from({ length: SKELETON_COUNT }, (_, index) => <MovieCardSkeleton key={index} />)
        : movies.map((movie, index) => (
            // Each card grows in. The delay is a little longer for each card in a row of 10,
            // so they appear one after another. (Grow needs a Box around the card.)
            <Grow in key={movie.id} timeout={400} style={{ transitionDelay: `${(index % 10) * 40}ms` }}>
              <Box>
                <MovieCard movie={movie} />
              </Box>
            </Grow>
          ))}
    </Box>
  );
}

export default MovieGrid;
