import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { loginUser } from '../services/auth';

// Checks for the values we read from localStorage. A saved value that fails its check is ignored.
const isValidMode = (value) => value === 'light' || value === 'dark';
const isValidUser = (value) =>
  value === null ||
  (typeof value === 'object' && typeof value.username === 'string' && value.username.trim() !== '');
const isValidFavorites = (value) =>
  Array.isArray(value) &&
  value.every((movie) => movie && typeof movie === 'object' && typeof movie.id === 'number');

// This is the shared box that any component can read from
const AppContext = createContext();

// Wrap the app with this so every component can use the shared data
export function AppProvider({ children }) {
  // Theme mode is 'light' or 'dark', and it is saved in localStorage
  const [mode, setMode] = useLocalStorage('themeMode', 'light', isValidMode);

  // Switch between light and dark
  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  // The logged in user (null means nobody is logged in), saved in localStorage
  const [user, setUser] = useLocalStorage('user', null, isValidUser);

  // Log in with an email or a username and a password. The account service checks them.
  // Returns { ok: true } or { ok: false, error: 'a message to show the user' }
  const login = async (identifier, password) => {
    const result = await loginUser(identifier, password);
    if (result.ok) {
      // Save only what the app needs to know: first name, username and email
      setUser(result.user);
    }
    return result;
  };

  // Sign out: clear the saved user
  const logout = () => {
    setUser(null);
  };

  // The favorite movies, saved in localStorage
  const [favorites, setFavorites] = useLocalStorage('favorites', [], isValidFavorites);

  // Check if a movie is already in the favorites
  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  // Add the movie if it is not a favorite yet, or remove it if it is
  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      setFavorites(favorites.filter((item) => item.id !== movie.id));
    } else {
      // Save only what MovieCard needs, so the saved data stays small
      const smallMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      };
      setFavorites([...favorites, smallMovie]);
    }
  };

  const value = {
    mode,
    toggleMode,
    user,
    login,
    logout,
    favorites,
    isFavorite,
    toggleFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Short helper so components can write useAppContext() to get the data
export function useAppContext() {
  return useContext(AppContext);
}
