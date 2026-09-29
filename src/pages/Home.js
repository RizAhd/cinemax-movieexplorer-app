import { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
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

  // True when at least one filter is chosen
  const hasFilters = filters.genre !== '' || filters.year !== '' || filters.rating !== '';

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

      {/* One toolbar card for the search bar, the filters and the Load More switch */}
      <Paper variant="outlined" sx={{ p: 2, mb: 4, borderRadius: '20px' }}>
        {/* Grid: on a phone the search bar has a row, then Genre, then Year and Rating side by side.
            On a big screen everything is in one row and the search bar is twice as wide. */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 1fr 1fr 1fr' },
          }}
        >
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
            <SearchBar value={query} onChange={setQuery} />
          </Box>
          <FilterBar filters={filters} genres={genres} onChange={setFilters} />
        </Box>

        {/* Bottom row: how many movies and a Clear button on the left, the Load More switch on the right */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mt: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 36 }}>
            {!loading && !error && (
              <Typography variant="body2" color="text.secondary">
                {visibleMovies.length} {visibleMovies.length === 1 ? 'movie' : 'movies'}
              </Typography>
            )}
            {hasFilters && (
              <Button
                size="small"
                startIcon={<FilterAltOffIcon />}
                onClick={() => setFilters({ genre: '', year: '', rating: '' })}
              >
                Clear filters
              </Button>
            )}
          </Box>

          {/* Switch between infinite scroll and the Load More button */}
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={loadMode === 'button'}
                onChange={(event) => setLoadMode(event.target.checked ? 'button' : 'scroll')}
              />
            }
            label={<Typography variant="body2">Use Load More button</Typography>}
            sx={{ mr: 0 }}
          />
        </Box>
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
