import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Login form with simple mock validation
function Login() {
  // Keep what the user types in state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            error={usernameError !== ''}
            helperText={usernameError}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={passwordError !== ''}
            helperText={passwordError}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;
