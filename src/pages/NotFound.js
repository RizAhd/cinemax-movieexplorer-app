import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import HomeIcon from '@mui/icons-material/Home';

// Shown when the url does not match any page, for example /abc
function NotFound() {
  return (
    <Container sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <MovieFilterIcon color="primary" sx={{ fontSize: 56 }} />

      {/* Big 404 */}
      <Typography
        variant="h1"
        component="p"
        sx={{
          fontSize: { xs: '5rem', md: '8rem' },
          lineHeight: 1,
          color: 'primary.main',
          letterSpacing: 4,
        }}
      >
        404
      </Typography>

      <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 1 }}>
        Scene not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 420, mx: 'auto' }}>
        The page you are looking for does not exist, or it was cut from the final edit.
      </Typography>

      <Button variant="contained" size="large" component={Link} to="/" startIcon={<HomeIcon />}>
        Back to home
      </Button>
    </Container>
  );
}

export default NotFound;
