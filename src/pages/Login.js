import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Login form with simple mock validation
function Login() {
  // Keep what the user types in state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Show the password as text (true) or as dots (false)
  const [showPassword, setShowPassword] = useState(false);
  // Error messages to show under the fields
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    // Stop the page from reloading when the form is sent
    event.preventDefault();

    // Check both fields
    const newUsernameError = username.trim() === '' ? 'Username is required' : '';
    const newPasswordError =
      password.length < 4 ? 'Password must be at least 4 characters' : '';

    setUsernameError(newUsernameError);
    setPasswordError(newPasswordError);

    // Stop here if there is any error
    if (newUsernameError || newPasswordError) {
      return;
    }

    // All good: save the user and go to the home page
    login(username.trim());
    navigate('/');
  };

  return (
    // Full height area with soft red and gold glows in the background
    <Box
      sx={(theme) => ({
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        background: `radial-gradient(circle at 15% 20%, ${alpha(theme.palette.primary.main, 0.35)}, transparent 45%), radial-gradient(circle at 85% 80%, ${alpha(theme.palette.secondary.main, 0.2)}, transparent 45%)`,
      })}
    >
      <Paper
        elevation={8}
        sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 5 }, borderRadius: '24px' }}
      >
        {/* Logo and welcome text */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <MovieFilterIcon color="primary" sx={{ fontSize: 56 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 3 }}>
            CINEMAX
          </Typography>
          <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
            Welcome back
          </Typography>
          <Typography color="text.secondary">Login to explore movies</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            error={usernameError !== ''}
            helperText={usernameError}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlinedIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={passwordError !== ''}
            helperText={passwordError}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                // Eye button to show or hide the password
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'hide password' : 'show password'}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>

        {/* Hint for the demo login */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          Demo login: any username and a password with 4 or more characters.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
