import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

// The look shared by the Login and Sign up pages: a card with the logo and a title,
// on a background with soft red and gold glows.
// title and subtitle are the texts at the top, children is the form, maxWidth is how wide the card is.
function AuthLayout({ title, subtitle, children, maxWidth = 420 }) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}
    >
      {/* Soft red and gold glows behind the card. They fade out at the bottom, so there is no hard edge. */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 15% 20%, ${alpha(theme.palette.primary.main, 0.35)}, transparent 45%), radial-gradient(circle at 85% 80%, ${alpha(theme.palette.secondary.main, 0.2)}, transparent 45%)`,
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        })}
      />

      <Paper
        elevation={8}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth,
          p: { xs: 3, sm: 5 },
          borderRadius: '24px',
        }}
      >
        {/* Logo and title */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <MovieFilterIcon color="primary" sx={{ fontSize: 56 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 3 }}>
            CINEMAX
          </Typography>
          <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
            {title}
          </Typography>
          <Typography color="text.secondary">{subtitle}</Typography>
        </Box>

        {children}
      </Paper>
    </Box>
  );
}

export default AuthLayout;
