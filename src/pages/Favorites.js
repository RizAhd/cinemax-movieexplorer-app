import { Link } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MovieIcon from '@mui/icons-material/Movie';
import MovieGrid from '../components/MovieGrid';
import SectionTitle from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';

// Favorites page: shows the movies the user hearted
function Favorites() {
  // The list comes from the context, so it updates when a heart is clicked
  const { favorites } = useAppContext();

  return (
    <Container sx={{ py: 3 }}>
      <SectionTitle component="h1">
        My favorites
        {/* Small badge with how many movies are saved */}
        {favorites.length > 0 && (
          <Chip label={favorites.length} color="primary" size="small" sx={{ ml: 1.5, verticalAlign: 'middle' }} />
        )}
      </SectionTitle>

      {favorites.length === 0 ? (
        // Nothing saved yet: a big heart in a soft red circle
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Box
            sx={(theme) => ({
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 3,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.12),
            })}
          >
            <FavoriteBorderIcon color="primary" sx={{ fontSize: 56 }} />
          </Box>
          <Typography variant="h5" component="p" sx={{ mb: 1 }}>
            No favorites yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 380, mx: 'auto' }}>
            Tap the heart on any movie to save it here, so you can find it again later.
          </Typography>
          <Button variant="contained" size="large" component={Link} to="/" startIcon={<MovieIcon />}>
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
