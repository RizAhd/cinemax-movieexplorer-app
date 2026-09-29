import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppContext } from './context/AppContext';
import { getTheme } from './theme';
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
        {/* Each Route shows one page for one url */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
