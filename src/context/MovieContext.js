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

    // No text means trending (one page only), some text means search
    let request;
    if (searchText === '') {
      request = getTrending().then((results) => ({ results, totalPages: 1 }));
    } else {
      request = searchMovies(searchText, 1);
    }

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
    // Trending has one page, and we do not load while another load is running
    if (searchText === '' || noMorePages || loading || loadingMore || moreError) {
      return;
    }

    const nextPage = page + 1;
    const requestedText = searchText;
    setLoadingMore(true);

    searchMovies(requestedText, nextPage)
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

  // Are there more pages to load? (only search results have pages)
  const hasMore = searchText !== '' && page < totalPages;

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
