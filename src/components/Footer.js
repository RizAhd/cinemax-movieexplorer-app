import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

// Bottom of every page: logo, copyright and the TMDb credit
function Footer() {
  return (
    <Box
      component="footer"
      sx={{ mt: 6, py: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}
    >
      <Container>
        {/* Logo and name */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1.5 }}>
          <MovieFilterIcon color="primary" />
          <Typography sx={{ fontWeight: 800, letterSpacing: 2 }}>CINEMAX</Typography>
        </Box>

        {/* TMDb asks every app that uses its data to show this text */}
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto' }}>
          This product uses the{' '}
          <Link href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">
            TMDB
          </Link>{' '}
          API but is not endorsed or certified by TMDB.
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
          © {new Date().getFullYear()} Cinemax Movie Explorer
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
