import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{ mt: 6, py: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}
    >
      <Container>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1.5 }}>
          <MovieFilterIcon color="primary" />
          <Typography sx={{ fontWeight: 800, letterSpacing: 2 }}>CINEMAX</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Developed by <strong>Riflan Mohamed</strong>
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          © {new Date().getFullYear()} Cinemax Movie Explorer
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
