import { Link, useNavigate, useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useAppContext } from '../context/AppContext';

// Top bar shown on every page, with the logo and page links
function Navbar() {
  // Get the mode, the user and the functions from the context
  const { mode, toggleMode, user, logout } = useAppContext();
  const navigate = useNavigate();
  // The current page url, used to highlight the active link
  const { pathname } = useLocation();

  // Sign out and go back to the login page
  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  // True when the user is on this page
  const isActive = (path) => pathname === path;

  // A soft red background for the link of the current page
  const activeStyle = (path) => (theme) => ({
    bgcolor: isActive(path) ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={(theme) => ({
        // See-through background with a blur, so the page shows a little behind the bar
        bgcolor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
      })}
    >
      <Container>
        <Toolbar disableGutters>
          {/* Logo and app name, they link to the home page */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <MovieFilterIcon color="primary" fontSize="large" />
            <Typography variant="h6" component="span" sx={{ fontWeight: 800, letterSpacing: 2 }}>
              CINEMAX
            </Typography>
          </Box>

          {/* component={Link} makes the button change page without reloading */}
          {user ? (
            <>
              {/* Text buttons: hidden on phones (the bottom bar has the links there) */}
              <Box component="nav" aria-label="main" sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
                <Button
                  color={isActive('/') ? 'primary' : 'inherit'}
                  component={Link}
                  to="/"
                  sx={activeStyle('/')}
                >
                  Home
                </Button>
                <Button
                  color={isActive('/favorites') ? 'primary' : 'inherit'}
                  component={Link}
                  to="/favorites"
                  sx={activeStyle('/favorites')}
                >
                  Favorites
                </Button>
                <Button color="inherit" onClick={handleSignOut}>
                  Sign out
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
              {/* Smaller side padding on phones, so both buttons and the logo fit on one line */}
              <Button
                size="small"
                color={isActive('/login') ? 'primary' : 'inherit'}
                component={Link}
                to="/login"
                sx={[activeStyle('/login'), { px: { xs: 1.5, sm: 2.5 } }]}
              >
                Login
              </Button>
              <Button
                size="small"
                variant="contained"
                component={Link}
                to="/signup"
                sx={{ px: { xs: 1.5, sm: 2.5 } }}
              >
                Sign up
              </Button>
            </Box>
          )}

          {/* Theme toggle: moon in light mode, sun in dark mode */}
          <IconButton color="inherit" onClick={toggleMode} aria-label="toggle theme" sx={{ ml: 0.5 }}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
