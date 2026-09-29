import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Login form: an email or a username, and a password
function Login() {
  // Keep what the user types in state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  // Show the password as text (true) or as dots (false)
  const [showPassword, setShowPassword] = useState(false);
  // Error messages to show under the fields
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  // The message for a wrong login, shown at the top of the form
  const [formError, setFormError] = useState('');
  // true while we check the login
  const [submitting, setSubmitting] = useState(false);

  const { user, login } = useAppContext();

  const handleSubmit = async (event) => {
    // Stop the page from reloading when the form is sent
    event.preventDefault();

    // Ignore a second click while the first one is still being checked
    if (submitting) {
      return;
    }

    // Both fields must be filled in. We do not check password rules here, only when signing up.
    const newIdentifierError = identifier.trim() === '' ? 'Enter your email or username' : '';
    const newPasswordError = password === '' ? 'Enter your password' : '';

    setIdentifierError(newIdentifierError);
    setPasswordError(newPasswordError);
    setFormError('');

    if (newIdentifierError || newPasswordError) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await login(identifier, password);
      // If it worked, the user is saved and the redirect below sends them to the home page
      if (!result.ok) {
        setFormError(result.error);
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Already logged in (or just logged in): go to the home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    // Full height area with soft red and gold glows in the background
    <Box
      sx={(theme) => ({
        position: 'relative',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      })}
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
          maxWidth: 420,
          p: { xs: 3, sm: 5 },
          borderRadius: '24px',
        }}
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

        <form onSubmit={handleSubmit} noValidate>
          {/* A wrong email/username or password shows up here */}
          {formError && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {formError}
            </Alert>
          )}

          <TextField
            label="Email or username"
            fullWidth
            margin="normal"
            autoComplete="username"
            value={identifier}
            onChange={(event) => {
              setIdentifier(event.target.value);
              setFormError('');
            }}
            error={identifierError !== ''}
            helperText={identifierError}
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
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setFormError('');
            }}
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
          {/* While we check the login the button is disabled and shows a spinner */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ mt: 2 }}
          >
            {submitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
