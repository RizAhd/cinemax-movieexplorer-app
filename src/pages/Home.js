import { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import ErrorMessage from '../components/ErrorMessage';
import { useMovies } from '../context/MovieContext';

// Home page: shows trending movies, or search results when the user types.
// The movie data comes from MovieContext. This page decides how to show it.
function Home() {
  const {
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
    loadMode,
    setLoadMode,
    loadMore,
    loadingMore,
    moreError,
    clearMoreError,
    hasMore,
  } = useMovies();

  // The invisible box at the bottom of the grid. When it comes into view, we load more.
  const bottomRef = useRef(null);

  // Infinite scroll: watch the bottom box and load the next page when it is visible
  useEffect(() => {
    // In Load More button mode we do not watch the scroll
    if (loadMode !== 'scroll') {
      return;
    }

    const target = bottomRef.current;
    if (!target) {
      return;
    }

    // The 200px margin starts loading a little before the user reaches the bottom
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(target);

    // Cleanup: stop watching before the next run
    return () => {
      observer.disconnect();
    };
    // filters is in the list so we check again after a filter changes
    // (if few movies match, the bottom box stays visible and more pages load)
  }, [loadMode, loadMore, movies, filters]);

  // Only the movies that match the chosen filters
  const visibleMovies = movies.filter((movie) => {
    const movieGenres = movie.genre_ids || [];
    // release_date looks like "1999-10-15", so the first 4 letters are the year
    const movieYear = movie.release_date ? Number(movie.release_date.slice(0, 4)) : null;

    const genreOk = filters.genre === '' || movieGenres.includes(filters.genre);
    const yearOk = filters.year === '' || movieYear === filters.year;
    // vote_average is the rating from 0 to 10
    const ratingOk = filters.rating === '' || movie.vote_average >= filters.rating;

    // A movie must pass every filter
    return genreOk && yearOk && ratingOk;
  });

  // The banner shows the first trending movie that has a wide picture.
  // It only shows for trending (no search text).
  const heroMovie = searchText === '' ? movies.find((movie) => movie.backdrop_path) : null;

  return (
    <Container sx={{ py: 3 }}>
      {!loading && !error && heroMovie && (
        <Box sx={{ mb: 3 }}>
          <HeroBanner movie={heroMovie} />
        </Box>
      )}

      {/* Placeholder with the banner's size, so the page does not jump when it loads */}
      {loading && searchText === '' && (
        <Skeleton
          variant="rounded"
          sx={{ height: { xs: 340, md: 460 }, borderRadius: '24px', mb: 3 }}
        />
      )}

      <Box sx={{ mb: 3 }}>
        <SearchBar value={query} onChange={setQuery} />
      </Box>

      {/* One panel for the filters and the Load More switch */}
      <Paper variant="outlined" sx={{ p: 2, mb: 4, borderRadius: '16px' }}>
        <FilterBar filters={filters} genres={genres} onChange={setFilters} />
        {/* Switch between infinite scroll and the Load More button */}
        <FormControlLabel
          control={
            <Switch
              checked={loadMode === 'button'}
              onChange={(event) => setLoadMode(event.target.checked ? 'button' : 'scroll')}
            />
          }
          label="Use Load More button"
          sx={{ mt: 1 }}
        />
      </Paper>

      <SectionTitle component="h1">
        {searchText === '' ? 'Trending this week' : `Results for "${searchText}"`}
      </SectionTitle>

      {/* While loading, show grey placeholder cards instead of a spinner */}
      {loading && <MovieGrid loading />}

      {error && <ErrorMessage message={error} onRetry={retry} />}

      {/* Search finished but nothing was found */}
      {!loading && !error && movies.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No movies found for "{searchText}". Try another title.
        </Typography>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          {visibleMovies.length > 0 ? (
            <MovieGrid movies={visibleMovies} />
          ) : (
            // Movies were loaded, but none match the filters
            <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
              No movies match your filters.
            </Typography>
          )}

          {/* Scroll mode: this empty box is what the scroll watcher looks at */}
          {loadMode === 'scroll' && <Box ref={bottomRef} sx={{ height: 1 }} />}

          {/* Button mode: a button to load the next page */}
          {loadMode === 'button' && hasMore && !loadingMore && !moreError && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="outlined" onClick={loadMore}>
                Load more
              </Button>
            </Box>
          )}

          {loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Retry clears the error, which lets the scroll watcher try again */}
          {moreError && <ErrorMessage message={moreError} onRetry={clearMoreError} />}
        </>
      )}
    </Container>
  );
}

export default Home;
