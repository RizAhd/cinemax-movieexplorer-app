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
    <ErrorBoundary>
      <AppProvider>
        <MovieProvider>
          <App />
        </MovieProvider>
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();
