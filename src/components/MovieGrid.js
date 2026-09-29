import Box from '@mui/material/Box';
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
        : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
    </Box>
  );
}

export default MovieGrid;
