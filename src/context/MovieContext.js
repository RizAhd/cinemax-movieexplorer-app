import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from './AppContext';
import useDebounce from '../hooks/useDebounce';
import useLocalStorage from '../hooks/useLocalStorage';
import { getTrending, searchMovies, discoverMovies, getGenres } from '../services/movies';
import { getErrorMessage } from '../services/errorMessage';

// Search text first, then the filters, otherwise the trending list
function fetchPage(searchText, filters, page) {
  if (searchText !== '') {
    return searchMovies(searchText, page, filters.year);
  }
  if (filters.genre !== '' || filters.year !== '' || filters.rating !== '') {
    return discoverMovies(filters, page);
  }
  return getTrending(page);
}

// Shared box for the movie data (trending, search results, genres).
// It lives above the pages, so the results stay when the user opens a movie and comes back.
const MovieContext = createContext();

export function MovieProvider({ children }) {
  // Here we only need to know IF somebody is logged in (true or false), not who.
  // Using true/false, and not the whole user object, means changing the name or email in the
  // profile does not make the movies load again.
  const { user: currentUser } = useAppContext();
  const user = Boolean(currentUser);

  // The search text is saved in localStorage, so the last search is remembered
  const [query, setQuery] = useLocalStorage('lastSearch', '', (value) => typeof value === 'string');

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

  // The movies for the banner at the top of Home. They are loaded on their own, so the banner
  // does not change when the user searches, filters or sorts.
  const [heroMovies, setHeroMovies] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);

  // Filters: '' means "all". genre is a genre id, year is a number like 1999,
  // rating is the lowest rating to show, like 7.
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '' });

  // How the movies are sorted: '' (the order TMDb sent), 'rating', 'year-new', 'year-old' or 'title'
  const [sortBy, setSortBy] = useState('');

  // The search and filters of the list on screen, so answers for an older list can be ignored
  const latestRequest = useRef('');

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

  // Load the banner movies (only when someone is logged in). The Retry button loads them again too.
  useEffect(() => {
    if (!user) {
      return;
    }

    let ignore = false;
    setHeroLoading(true);

    getTrending(1)
      .then((data) => {
        if (!ignore) {
          // Only movies with a wide picture, and only the first 10
          setHeroMovies(data.results.filter((movie) => movie.backdrop_path).slice(0, 10));
        }
      })
      .catch(() => {
        // If this fails the banner is just hidden, the rest of the page still works
        if (!ignore) {
          setHeroMovies([]);
        }
      })
      .finally(() => {
        if (!ignore) {
          setHeroLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user, retryCount]);

  // Loads page 1 when a user is logged in and whenever the search text or a filter changes
  useEffect(() => {
    if (!user) {
      return;
    }

    let ignore = false;
    latestRequest.current = JSON.stringify([searchText, filters]);

    setLoading(true);
    setError('');
    setMoreError('');
    setPage(1);

    fetchPage(searchText, filters, 1)
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
  }, [user, searchText, filters, retryCount]);

  // Adds the next page to the list. The scroll watcher and the Load More button both use it.
  const loadMore = useCallback(() => {
    if (page >= totalPages || loading || loadingMore || moreError) {
      return;
    }

    const nextPage = page + 1;
    const requestedList = latestRequest.current;
    setLoadingMore(true);

    fetchPage(searchText, filters, nextPage)
      .then((data) => {
        // The search or a filter changed in the meantime, so this page is for an older list
        if (latestRequest.current !== requestedList) {
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
        if (latestRequest.current === requestedList) {
          setMoreError(getErrorMessage(err));
        }
      })
      .finally(() => {
        setLoadingMore(false);
      });
  }, [page, totalPages, loading, loadingMore, moreError, searchText, filters]);

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
    heroMovies,
    heroLoading,
    filters,
    setFilters,
    sortBy,
    setSortBy,
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
