import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { useAppContext } from './context/AppContext';
import { getTheme } from './theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';

function App() {
  // Get the current mode ('light' or 'dark') from the context
  const { mode } = useAppContext();

  return (
    <ThemeProvider theme={getTheme(mode)}>
      {/* CssBaseline applies the theme background and text color to the page */}
      <CssBaseline />
      <BrowserRouter>
        {/* This box is at least as tall as the screen, so the footer stays at the bottom */}
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navbar is inside BrowserRouter because its links need the router */}
        <Navbar />
        {/* The page content grows to fill the space between the navbar and the footer */}
        <Box component="main" sx={{ flex: 1 }}>
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
        </Routes>
        </Box>
        <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
