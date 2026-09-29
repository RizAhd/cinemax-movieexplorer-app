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
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useAppContext } from '../context/AppContext';
import UserBadge from './UserBadge';

// The height of every button and icon in the bar, so they all look the same size
const ITEM_HEIGHT = 40;

// Top bar shown on every page.
// Left: the logo and the page links. Right: who is logged in, Sign out and the theme button.
//   Phones:  logo ..................... avatar  theme     (the links are in the bottom bar)
//   Tablets: logo  Home  Favorites .... avatar  sign-out icon  theme
//   Desktop: logo  Home  Favorites .... avatar + "Hi, name"  Sign out  theme
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
    minHeight: ITEM_HEIGHT,
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
          {/* LEFT: logo and app name, they link to the home page */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <MovieFilterIcon color="primary" fontSize="large" />
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 800,
                letterSpacing: 2,
                // On very small phones (under 360px) only the logo icon stays, so everything fits
                '@media (max-width: 359px)': { display: 'none' },
              }}
            >
              CINEMAX
            </Typography>
          </Box>

          {/* LEFT: page links, next to the logo. Hidden on phones (the bottom bar has the links there). */}
          {user && (
            <Box
              component="nav"
              aria-label="main"
              sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5, ml: { sm: 2, md: 4 } }}
            >
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
            </Box>
          )}

          {/* An empty box that grows, so everything after it is pushed to the right edge */}
          <Box sx={{ flexGrow: 1 }} />

          {/* RIGHT: who is logged in, Sign out and the theme button, all the same height and spacing */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            {user ? (
              <>
                {/* Avatar with the first letter of the name (and "Hi, name" on desktop). Links to the profile. */}
                <UserBadge user={user} />

                {/* Desktop: a Sign out button with an icon and text */}
                <Button
                  color="inherit"
                  variant="outlined"
                  startIcon={<LogoutIcon fontSize="small" />}
                  onClick={handleSignOut}
                  sx={{
                    display: { xs: 'none', md: 'inline-flex' },
                    minHeight: ITEM_HEIGHT,
                    borderColor: 'divider',
                  }}
                >
                  Sign out
                </Button>

                {/* Tablet: only the Sign out icon, to save space. On phones the bottom bar has Sign out. */}
                <IconButton
                  color="inherit"
                  onClick={handleSignOut}
                  aria-label="sign out"
                  sx={{ display: { xs: 'none', sm: 'inline-flex', md: 'none' }, width: ITEM_HEIGHT, height: ITEM_HEIGHT }}
                >
                  <LogoutIcon />
                </IconButton>
              </>
            ) : (
              <>
                {/* Smaller side padding on phones, so both buttons and the logo fit on one line */}
                <Button
                  color={isActive('/login') ? 'primary' : 'inherit'}
                  component={Link}
                  to="/login"
                  sx={[activeStyle('/login'), { px: { xs: 1.5, sm: 2.5 } }]}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="/signup"
                  sx={{ minHeight: ITEM_HEIGHT, px: { xs: 1.5, sm: 2.5 } }}
                >
                  Sign up
                </Button>
              </>
            )}

            {/* Theme toggle: moon in light mode, sun in dark mode */}
            <IconButton
              color="inherit"
              onClick={toggleMode}
              aria-label="toggle theme"
              sx={{ width: ITEM_HEIGHT, height: ITEM_HEIGHT }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
