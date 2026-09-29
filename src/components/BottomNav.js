import { Link, useNavigate, useLocation } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppContext } from '../context/AppContext';

// Bar at the bottom of the screen on phones, with the main links.
// It is hidden on bigger screens, where the top navbar has the links.
function BottomNav() {
  const { user, logout } = useAppContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Only logged in users see it
  if (!user) {
    return null;
  }

  // Only Home, Favorites and Profile can be selected. On other pages nothing is selected.
  const value = ['/', '/favorites', '/profile'].includes(pathname) ? pathname : false;

  // Sign out and go back to the login page
  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <Paper
      component="nav"
      aria-label="bottom"
      square
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        // Only on phones
        display: { xs: 'block', sm: 'none' },
        borderTop: 1,
        borderColor: 'divider',
        // Keeps the bar above the home bar on phones that have one
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <BottomNavigation showLabels value={value}>
        <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} component={Link} to="/" />
        <BottomNavigationAction
          label="Favorites"
          value="/favorites"
          icon={<FavoriteIcon />}
          component={Link}
          to="/favorites"
        />
        <BottomNavigationAction
          label="Profile"
          value="/profile"
          icon={<PersonIcon />}
          component={Link}
          to="/profile"
        />
        <BottomNavigationAction label="Sign out" icon={<LogoutIcon />} onClick={handleSignOut} />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
