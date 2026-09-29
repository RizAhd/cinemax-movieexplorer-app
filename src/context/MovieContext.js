import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from './AppContext';
import useDebounce from '../hooks/useDebounce';
import useLocalStorage from '../hooks/useLocalStorage';
import { getTrending, searchMovies, discoverMovies, getGenres } from '../services/movies';
import { getErrorMessage } from '../services/errorMessage';

function fetchPage(searchText, filters, page) {
  if (searchText !== '') {
    return searchMovies(searchText, page, filters.year);
  }
  if (filters.genre !== '' || filters.year !== '' || filters.rating !== '') {
    return discoverMovies(filters, page);
  }
  return getTrending(page);
}

const MovieContext = createContext();

export function MovieProvider({ children }) {
  // only "is somebody logged in" matters here. A boolean, not the user object, so saving the
  // profile does not reload the movies
  const { user: currentUser } = useAppContext();
  const user = Boolean(currentUser);

  const [query, setQuery] = useLocalStorage('lastSearch', '', (value) => typeof value === 'string');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState('');

  const [retryCount, setRetryCount] = useState(0);

  const [genres, setGenres] = useState([]);

  // the banner has its own list, so it does not change with the search or the filters
  const [heroMovies, setHeroMovies] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);

  // '' means no filter
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '' });
  // '', 'rating', 'year-new', 'year-old' or 'title'
  const [sortBy, setSortBy] = useState('');

  // search + filters of the list on screen, to drop pages that arrive late for an older list
  const latestRequest = useRef('');

  const debouncedQuery = useDebounce(query, 500);
  const searchText = debouncedQuery.trim();

  useEffect(() => {
    if (!user) {
      return;
    }
    getGenres()
      .then((list) => setGenres(list))
      .catch(() => {
        setGenres([]);
      });
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let ignore = false;
    setHeroLoading(true);

    getTrending(1)
      .then((data) => {
        if (!ignore) {
          setHeroMovies(data.results.filter((movie) => movie.backdrop_path).slice(0, 10));
        }
      })
      .catch(() => {
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
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user, searchText, filters, retryCount]);

  const loadMore = useCallback(() => {
    if (page >= totalPages || loading || loadingMore || moreError) {
      return;
    }

    const nextPage = page + 1;
    const requestedList = latestRequest.current;
    setLoadingMore(true);

    fetchPage(searchText, filters, nextPage)
      .then((data) => {
        if (latestRequest.current !== requestedList) {
          return;
        }
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

  const hasMore = page < totalPages;

  const retry = () => {
    setRetryCount(retryCount + 1);
  };

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

export function useMovies() {
  return useContext(MovieContext);
}
