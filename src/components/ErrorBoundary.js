import { Component } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';

// The page the user sees after a crash. It uses normal links and window.location,
// so it works even if the router itself is the thing that broke.
function CrashPage({ error }) {
  return (
    <Container sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <ErrorOutlinedIcon color="error" sx={{ fontSize: 64 }} />

      <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 1 }}>
        Something went wrong
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 440, mx: 'auto' }}>
        The page hit an unexpected problem. Reloading usually fixes it, and your login and
        favorites are safe.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
        >
          Reload page
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => window.location.assign('/')}
        >
          Go to home
        </Button>
      </Box>

      {/* The technical message is only shown while developing, never to real visitors */}
      {process.env.NODE_ENV !== 'production' && error && (
        <Typography
          component="pre"
          variant="caption"
          color="text.secondary"
          sx={{ mt: 4, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          {String(error.message || error)}
        </Typography>
      )}
    </Container>
  );
}

// Catches errors that happen while React draws the page (in any component below it) and shows
// CrashPage instead of a blank white screen. React only allows this in a class component.
// It does not catch errors in event handlers or in async code, those are handled where they happen.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  // React calls this when a component below crashed. What we return becomes the new state.
  static getDerivedStateFromError(error) {
    return { error };
  }

  // A good place to write the error somewhere. Here we just log it in the browser console.
  componentDidCatch(error, info) {
    console.error('The app crashed:', error, info && info.componentStack);
  }

  render() {
    if (this.state.error) {
      return <CrashPage error={this.state.error} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
