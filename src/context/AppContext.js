import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// This is the shared box that any component can read from
const AppContext = createContext();

// Wrap the app with this so every component can use the shared data
export function AppProvider({ children }) {
  // Theme mode is 'light' or 'dark', and it is saved in localStorage
  const [mode, setMode] = useLocalStorage('themeMode', 'light');

  // Switch between light and dark
  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const value = { mode, toggleMode };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Short helper so components can write useAppContext() to get the data
export function useAppContext() {
  return useContext(AppContext);
}
