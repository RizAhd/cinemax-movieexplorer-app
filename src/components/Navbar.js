import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useAppContext } from '../context/AppContext';

// Top bar shown on every page, with the app name and page links
function Navbar() {
  // Get the mode, the user and the functions from the context
  const { mode, toggleMode, user, logout } = useAppContext();
  const navigate = useNavigate();

  // Sign out and go back to the login page
  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* App name on the left, flexGrow pushes the links to the right */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Cinemax
        </Typography>

        {/* component={Link} makes the button change page without reloading */}
        {user ? (
          <>
            {/* Links for a logged in user */}
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/favorites">
              Favorites
            </Button>
            <Button color="inherit" onClick={handleSignOut}>
              Sign out
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}

        {/* Theme toggle: moon in light mode, sun in dark mode */}
        <IconButton color="inherit" onClick={toggleMode} aria-label="toggle theme">
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
