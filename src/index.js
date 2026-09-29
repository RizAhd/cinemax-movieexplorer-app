import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';
import { MovieProvider } from './context/MovieContext';
import ErrorBoundary from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Last safety net: if even the providers crash, the user still gets a friendly page.
        (App has its own ErrorBoundary inside, with the theme colors.) */}
    <ErrorBoundary>
      {/* AppProvider shares the theme mode, the user and the favorites with the whole app */}
      <AppProvider>
        {/* MovieProvider shares the movie data. It needs the user, so it goes inside AppProvider. */}
        <MovieProvider>
          <App />
        </MovieProvider>
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
