import { createTheme } from '@mui/material/styles';

// Colors for light mode (warm light grey page, white cards)
const lightPalette = {
  mode: 'light',
  primary: { main: '#d32f2f' }, // red
  secondary: { main: '#f5a623' }, // gold, used for rating stars
  background: {
    default: '#f6f4f1',
    paper: '#ffffff',
  },
  text: {
    primary: '#1c1b22',
    secondary: '#5f5d6b',
  },
};

// Colors for dark mode (almost black page, dark grey cards)
const darkPalette = {
  mode: 'dark',
  primary: { main: '#ef5350' }, // lighter red so it is easy to see on dark
  secondary: { main: '#ffc107' },
  background: {
    default: '#0b0b0f',
    paper: '#16161d',
  },
  text: {
    primary: '#f5f5f7',
    secondary: '#a0a0ab',
  },
};

// Give this function 'light' or 'dark' and it returns a MUI theme
export function getTheme(mode) {
  return createTheme({
    palette: mode === 'dark' ? darkPalette : lightPalette,

    // Rounder corners everywhere
    shape: { borderRadius: 12 },

    // Fonts: bold headings, and buttons without ALL CAPS
    typography: {
      fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 600, textTransform: 'none' },
    },

    // Change how some MUI components look everywhere in the app
    components: {
      // Remove the grey overlay MUI adds to papers in dark mode
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      // Pill shaped buttons
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 999, paddingLeft: 20, paddingRight: 20 },
        },
      },
      // Bigger corners and a thin border on cards
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      // Bolder text inside chips (genres)
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
    },
  });
}
