import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

const SKELETON_COUNT = 12;

function MovieGrid({ movies = [], loading = false }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        // minmax(0, 1fr) stops long titles from stretching the columns
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, minmax(0, 1fr))',
          md: 'repeat(4, minmax(0, 1fr))',
          lg: 'repeat(5, minmax(0, 1fr))',
        },
      }}
    >
      {loading
        ? Array.from({ length: SKELETON_COUNT }, (_, index) => <MovieCardSkeleton key={index} />)
        : movies.map((movie, index) => (
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
