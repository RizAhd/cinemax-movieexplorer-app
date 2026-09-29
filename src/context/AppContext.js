import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  loginUser,
  registerUser,
  updateProfile as updateAccountProfile,
  changePassword as changeAccountPassword,
} from '../services/auth';

// saved values that fail these checks are ignored, so broken localStorage cannot crash the app
const isValidMode = (value) => value === 'light' || value === 'dark';
const isValidUser = (value) =>
  value === null ||
  (typeof value === 'object' && typeof value.username === 'string' && value.username.trim() !== '');
const isValidFavorites = (value) =>
  Array.isArray(value) &&
  value.every((movie) => movie && typeof movie === 'object' && typeof movie.id === 'number');

const AppContext = createContext();

export function AppProvider({ children }) {
  const [mode, setMode] = useLocalStorage('themeMode', 'light', isValidMode);

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const [user, setUser] = useLocalStorage('user', null, isValidUser);

  const login = async (identifier, password) => {
    const result = await loginUser(identifier, password);
    if (result.ok) {
      setUser(result.user);
    }
    return result;
  };

  const register = async (values) => {
    const result = await registerUser(values);
    if (result.ok) {
      setUser(result.user);
    }
    return result;
  };

  const updateProfile = async (values) => {
    if (!user) {
      return { ok: false, error: 'You are not logged in.' };
    }
    const result = await updateAccountProfile(user.username, values);
    if (result.ok) {
      setUser(result.user);
    }
    return result;
  };

  const changePassword = async (values) => {
    if (!user) {
      return { ok: false, error: 'You are not logged in.' };
    }
    return changeAccountPassword(user.username, values);
  };

  const logout = () => {
    setUser(null);
  };

  const [favorites, setFavorites] = useLocalStorage('favorites', [], isValidFavorites);

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      setFavorites(favorites.filter((item) => item.id !== movie.id));
    } else {
      // keep only what MovieCard shows
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
    register,
    updateProfile,
    changePassword,
    logout,
    favorites,
    isFavorite,
    toggleFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
