import Box from '@mui/material/Box';
import MovieCard from './MovieCard';

// Shows a list of movies as a grid of MovieCards.
// Mobile first: 2 columns on phones, more columns on bigger screens.
function MovieGrid({ movies }) {
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
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </Box>
  );
}

export default MovieGrid;
