import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from './AppContext';
import useDebounce from '../hooks/useDebounce';
import useLocalStorage from '../hooks/useLocalStorage';
import { getTrending, searchMovies, getGenres } from '../services/movies';
import { getErrorMessage } from '../services/errorMessage';

// Shared box for the movie data (trending, search results, genres).
// It lives above the pages, so the results stay when the user opens a movie and comes back.
const MovieContext = createContext();

export function MovieProvider({ children }) {
  const { user } = useAppContext();

  // The search text is saved in localStorage, so the last search is remembered
  const [query, setQuery] = useLocalStorage('lastSearch', '');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // For loading more pages
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState('');

  // Going up by one makes the first load run again (used by the Retry button)
  const [retryCount, setRetryCount] = useState(0);

  // The genre list for the filter dropdown
  const [genres, setGenres] = useState([]);

  // Filters: '' means "all". genre is a genre id, year is a number like 1999,
  // rating is the lowest rating to show, like 7.
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '' });

  // How the movies are sorted: '' (the order TMDb sent), 'rating', 'year-new', 'year-old' or 'title'
  const [sortBy, setSortBy] = useState('');

  // How more movies are loaded: 'button' (Load More button) or 'scroll' (infinite scroll).
  // The button is the default. The choice is saved in localStorage.
  // The key ends with V2 on purpose: browsers that saved 'scroll' under the old key
  // ('loadMode') now start with the button too.
  const [loadMode, setLoadMode] = useLocalStorage('loadModeV2', 'button');

  // Remembers the latest search text, so old answers can be ignored
  const latestSearch = useRef('');

  // Wait until the user stops typing before we search
  const debouncedQuery = useDebounce(query, 500);
  const searchText = debouncedQuery.trim();

  // Load the genre names one time (only when someone is logged in)
  useEffect(() => {
    if (!user) {
      return;
    }
    getGenres()
      .then((list) => setGenres(list))
      .catch(() => {
        // If this fails the dropdown just stays empty, the rest of the app still works
        setGenres([]);
      });
  }, [user]);

  // Runs when a user is logged in and every time the search text changes (loads page 1)
  useEffect(() => {
    // Nobody is logged in, so there is nothing to load
    if (!user) {
      return;
    }

    // If the user types again before this finishes, we ignore the old answer
    let ignore = false;
    latestSearch.current = searchText;

    setLoading(true);
    setError('');
    setMoreError('');
    setPage(1);

    // No text means trending, some text means search. Both come in pages.
    const request = searchText === '' ? getTrending(1) : searchMovies(searchText, 1);

    request
      .then((data) => {
        if (!ignore) {
          setMovies(data.results);
          setTotalPages(data.totalPages);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(getErrorMessage(err));
        }
      })
      .finally(() => {
        // Loading is over, whether it worked or not
        if (!ignore) {
          setLoading(false);
        }
      });

    // Cleanup: runs before the next search starts
    return () => {
      ignore = true;
    };
  }, [user, searchText, retryCount]);

  // Load the next page and add it to the list.
  // Both the scroll watcher and the Load More button use this function.
  const loadMore = useCallback(() => {
    const noMorePages = page >= totalPages;
    // We do not load when there are no more pages, or while another load is running
    if (noMorePages || loading || loadingMore || moreError) {
      return;
    }

    const nextPage = page + 1;
    const requestedText = searchText;
    setLoadingMore(true);

    // Same as the first load: trending when there is no search text, search otherwise
    const request =
      requestedText === '' ? getTrending(nextPage) : searchMovies(requestedText, nextPage);

    request
      .then((data) => {
        // The user searched for something else in the meantime, so ignore this
        if (latestSearch.current !== requestedText) {
          return;
        }
        // TMDb can send the same movie twice, so we skip movies we already have
        setMovies((oldMovies) => {
          const oldIds = oldMovies.map((movie) => movie.id);
          const newMovies = data.results.filter((movie) => !oldIds.includes(movie.id));
          return [...oldMovies, ...newMovies];
        });
        setPage(nextPage);
      })
      .catch((err) => {
        if (latestSearch.current === requestedText) {
          setMoreError(getErrorMessage(err));
        }
      })
      .finally(() => {
        setLoadingMore(false);
      });
  }, [page, totalPages, loading, loadingMore, moreError, searchText]);

  // Are there more pages to load?
  const hasMore = page < totalPages;

  // Try the first load again after an error
  const retry = () => {
    setRetryCount(retryCount + 1);
  };

  // Forget the "load more" error, which lets us try loading again
  const clearMoreError = () => {
    setMoreError('');
  };

  const value = {
    query,
    setQuery,
    searchText,
    movies,
    loading,
    error,
    retry,
    genres,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    loadMode,
    setLoadMode,
    loadMore,
    loadingMore,
    moreError,
    clearMoreError,
    hasMore,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

// Short helper so components can write useMovies() to get the data
export function useMovies() {
  return useContext(MovieContext);
}
