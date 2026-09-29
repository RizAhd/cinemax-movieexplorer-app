import { createTheme } from '@mui/material/styles';

// Colors for light mode
const lightPalette = {
  mode: 'light',
  primary: { main: '#d32f2f' }, // red
  secondary: { main: '#ffb300' }, // gold, good for rating stars
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
};

// Colors for dark mode
const darkPalette = {
  mode: 'dark',
  primary: { main: '#ef5350' }, // lighter red so it is easy to see on dark
  secondary: { main: '#ffca28' },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
};

// Give this function 'light' or 'dark' and it returns a MUI theme
export function getTheme(mode) {
  return createTheme({
    palette: mode === 'dark' ? darkPalette : lightPalette,
  });
}
