import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const lightPalette = {
  mode: 'light',
  primary: { main: '#d32f2f' },
  secondary: { main: '#c77800' }, // darker gold, readable on a light background
  background: {
    default: '#f6f4f1',
    paper: '#ffffff',
  },
  text: {
    primary: '#1c1b22',
    secondary: '#5f5d6b',
  },
};

const darkPalette = {
  mode: 'dark',
  // dark text on the red, white text is too faint on it
  primary: { main: '#ef5350', contrastText: '#0b0b0f' },
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

export function getTheme(mode) {
  const theme = createTheme({
    palette: mode === 'dark' ? darkPalette : lightPalette,

    shape: { borderRadius: 12 },

    typography: {
      fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: { fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' },
      h2: { fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' },
      h3: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.015em' },
      h4: { fontSize: '1.625rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.01em' },
      h5: { fontSize: '1.375rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.005em' },
      h6: { fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.4 },
      subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
      subtitle2: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 },
      body1: { fontSize: '1rem', lineHeight: 1.65 },
      body2: { fontSize: '0.875rem', lineHeight: 1.6 },
      caption: { fontSize: '0.75rem', lineHeight: 1.5 },
      overline: { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', lineHeight: 1.5 },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    },

    components: {
      // turns animations off for people who asked for reduced motion
      MuiCssBaseline: {
        styleOverrides: `
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              transition-delay: 0ms !important;
              scroll-behavior: auto !important;
            }
          }
        `,
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 999, paddingLeft: 20, paddingRight: 20 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
}
