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

const ITEM_HEIGHT = 40;

function Navbar() {
  const { mode, toggleMode, user, logout } = useAppContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => pathname === path;

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
        bgcolor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
      })}
    >
      <Container>
        <Toolbar disableGutters>
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
                // on very small phones only the icon fits next to the buttons
                '@media (max-width: 359px)': { display: 'none' },
              }}
            >
              CINEMAX
            </Typography>
          </Box>

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

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            {user ? (
              <>
                <UserBadge user={user} />

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
