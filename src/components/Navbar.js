import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Top bar shown on every page, with the app name and page links
function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* App name on the left, flexGrow pushes the links to the right */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Cinemax
        </Typography>

        {/* component={Link} makes the button change page without reloading */}
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/favorites">
          Favorites
        </Button>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
