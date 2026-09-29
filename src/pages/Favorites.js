import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MovieGrid from '../components/MovieGrid';
import { useAppContext } from '../context/AppContext';

// Favorites page: shows the movies the user hearted
function Favorites() {
  // The list comes from the context, so it updates when a heart is clicked
  const { favorites } = useAppContext();

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        My favorites
      </Typography>

      {favorites.length === 0 ? (
        // Nothing saved yet
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            You have no favorite movies yet. Tap the heart on a movie to save it here.
          </Typography>
          <Button variant="contained" component={Link} to="/">
            Browse movies
          </Button>
        </Box>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </Container>
  );
}

export default Favorites;
