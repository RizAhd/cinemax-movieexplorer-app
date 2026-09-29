import { useState } from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AuthLayout from '../components/AuthLayout';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user, login } = useAppContext();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

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
      if (!result.ok) {
        setFormError(result.error);
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Login to explore movies">
      <form onSubmit={handleSubmit} noValidate>
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

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
        New to Cinemax?{' '}
        <Link component={RouterLink} to="/signup" underline="hover" sx={{ fontWeight: 700 }}>
          Create an account
        </Link>
      </Typography>
    </AuthLayout>
  );
}

export default Login;
