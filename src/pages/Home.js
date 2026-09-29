import { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { smoothMenuProps } from '../components/menuProps';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import ErrorMessage from '../components/ErrorMessage';
import { useMovies } from '../context/MovieContext';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'rating', label: 'Rating: high to low' },
  { value: 'year-new', label: 'Newest first' },
  { value: 'year-old', label: 'Oldest first' },
  { value: 'title', label: 'Title: A to Z' },
];

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
  } = useMovies();

  const searching = searchText !== '';
  const bottomRef = useRef(null);

  // infinite scroll is only for search results, trending uses the Load More button
  useEffect(() => {
    if (!searching || !bottomRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [searching, loadMore, movies, filters]);

  // when browsing, TMDb already applied the filters. Search has no genre/rating filter, so do it here
  const filteredMovies = movies.filter((movie) => {
    if (!searching) {
      return true;
    }
    const movieGenres = movie.genre_ids || [];
    const movieYear = movie.release_date ? Number(movie.release_date.slice(0, 4)) : null;

    const genreOk = filters.genre === '' || movieGenres.includes(filters.genre);
    const yearOk = filters.year === '' || movieYear === filters.year;
    const ratingOk = filters.rating === '' || movie.vote_average >= filters.rating;

    return genreOk && yearOk && ratingOk;
  });

  const visibleMovies = [...filteredMovies].sort((a, b) => {
    const dateA = a.release_date || '';
    const dateB = b.release_date || '';

    if (sortBy === 'rating') {
      return b.vote_average - a.vote_average;
    }
    if (sortBy === 'year-new') {
      if (!dateA || !dateB) return !dateA ? 1 : -1;
      return dateB.localeCompare(dateA);
    }
    if (sortBy === 'year-old') {
      if (!dateA || !dateB) return !dateA ? 1 : -1;
      return dateA.localeCompare(dateB);
    }
    if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return 0;
  });

  const hasFilters = filters.genre !== '' || filters.year !== '' || filters.rating !== '';

  return (
    <Container sx={{ py: 3 }}>
      {!heroLoading && heroMovies.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <HeroBanner movies={heroMovies} />
        </Box>
      )}

      {heroLoading && (
        <Skeleton
          variant="rounded"
          sx={{ height: { xs: 360, md: 480 }, borderRadius: '24px', mb: 3 }}
        />
      )}

      <Paper variant="outlined" sx={{ p: 2, mb: 4, borderRadius: '20px' }}>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: 'minmax(0, 2fr) repeat(3, minmax(0, 1fr))',
            },
          }}
        >
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
            <SearchBar value={query} onChange={setQuery} />
          </Box>
          <FilterBar filters={filters} genres={genres} onChange={setFilters} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 36, mt: 1.5 }}>
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
      </Paper>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
        }}
      >
        <SectionTitle component="h1" mb={0}>
          {searching
            ? `Results for "${searchText}"`
            : hasFilters
              ? 'Movies matching your filters'
              : 'Trending this week'}
        </SectionTitle>

        <TextField
          select
          size="small"
          label="Sort by"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          slotProps={{ select: { MenuProps: smoothMenuProps } }}
          sx={{
            width: { xs: '100%', sm: 220 },
            flexShrink: 0,
            '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'background.paper' },
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading && movies.length === 0 && <MovieGrid loading />}

      {loading && movies.length > 0 && <LinearProgress sx={{ borderRadius: 999, mb: 2 }} />}

      {error && <ErrorMessage message={error} onRetry={retry} />}

      {!loading && !error && movies.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          {searching
            ? `No movies found for "${searchText}". Try another title.`
            : 'No movies match these filters. Try changing them.'}
        </Typography>
      )}

      {!error && movies.length > 0 && (
        <Box
          sx={{
            opacity: loading ? 0.45 : 1,
            transition: 'opacity 0.25s',
            pointerEvents: loading ? 'none' : 'auto',
          }}
        >
          {visibleMovies.length > 0 ? (
            <MovieGrid movies={visibleMovies} />
          ) : (
            <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
              No movies match your filters.
            </Typography>
          )}

          {searching && <Box ref={bottomRef} sx={{ height: 1 }} />}

          {searching && loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {!searching && hasMore && !moreError && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={loadMore}
                disabled={loadingMore}
                sx={{ minWidth: 220 }}
                startIcon={loadingMore ? <CircularProgress size={18} color="inherit" /> : null}
                endIcon={loadingMore ? null : <ExpandMoreIcon />}
              >
                {loadingMore ? 'Loading...' : 'Load more movies'}
              </Button>
            </Box>
          )}

          {moreError && <ErrorMessage message={moreError} onRetry={clearMoreError} />}
        </Box>
      )}
    </Container>
  );
}

export default Home;
