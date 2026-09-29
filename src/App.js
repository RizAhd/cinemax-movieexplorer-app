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
import ScrollManager from './components/ScrollManager';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  const { mode, user } = useAppContext();

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />

      <OfflineBanner />

      <ErrorBoundary>
        <BrowserRouter>
          <ScrollManager />

          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              pb: user ? { xs: 8, sm: 0 } : 0,
            }}
          >
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

            <Navbar />

            <Box component="main" id="main-content" tabIndex={-1} sx={{ flex: 1, outline: 'none' }}>
              <PageFade>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
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
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageFade>
            </Box>

            <Footer />
          </Box>

          <BottomNav />

          <BackToTop />
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
