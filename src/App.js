import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { useAppContext } from './context/AppContext';
import { getTheme } from './theme';

function App() {
  // Get the current mode ('light' or 'dark') from the context
  const { mode } = useAppContext();

  return (
    <ThemeProvider theme={getTheme(mode)}>
      {/* CssBaseline applies the theme background and text color to the page */}
      <CssBaseline />
      <Typography variant="h4" sx={{ p: 2 }}>
        Movie Explorer ({mode} mode)
      </Typography>
    </ThemeProvider>
  );
}

export default App;
