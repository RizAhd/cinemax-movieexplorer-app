import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { useAppContext } from './context/AppContext';
import { getTheme } from './theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import BackToTop from './components/BackToTop';
import PageFade from './components/PageFade';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

function App() {
  // Get the current mode ('light' or 'dark') from the context
  const { mode, user } = useAppContext();

  return (
    <ThemeProvider theme={getTheme(mode)}>
      {/* CssBaseline applies the theme background and text color to the page */}
      <CssBaseline />
      <BrowserRouter>
        {/* This box is at least as tall as the screen, so the footer stays at the bottom.
            On phones a logged in user gets extra space at the bottom for the bottom bar. */}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            pb: user ? { xs: 8, sm: 0 } : 0,
          }}
        >
          {/* "Skip to content" link. It is hidden until a keyboard user presses Tab. */}
          <Box
            component="a"
            href="#main-content"
            sx={{
              position: 'absolute',
              left: -9999,
              '&:focus': {
                left: 16,
                top: 8,
                zIndex: 2000,
                bgcolor: 'background.paper',
                color: 'text.primary',
                px: 2,
                py: 1,
                borderRadius: 2,
              },
            }}
          >
            Skip to content
          </Box>

          {/* Navbar is inside BrowserRouter because its links need the router */}
          <Navbar />

          {/* The page content grows to fill the space between the navbar and the footer */}
          <Box component="main" id="main-content" tabIndex={-1} sx={{ flex: 1, outline: 'none' }}>
            {/* PageFade makes each page fade in when the user changes page */}
            <PageFade>
              {/* Each Route shows one page for one url */}
              <Routes>
                <Route path="/login" element={<Login />} />
                {/* These pages need a logged in user */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/movie/:id"
                  element={
                    <ProtectedRoute>
                      <MovieDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />
                {/* Any other url shows the 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageFade>
          </Box>

          <Footer />
        </Box>

        {/* Bottom bar for phones (it hides itself when nobody is logged in) */}
        <BottomNav />

        {/* Round button that scrolls back to the top (it shows after scrolling down) */}
        <BackToTop />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
