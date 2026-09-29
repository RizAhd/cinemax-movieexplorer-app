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

// The ways the user can sort the movies. The empty value keeps the order TMDb sent.
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'rating', label: 'Rating: high to low' },
  { value: 'year-new', label: 'Newest first' },
  { value: 'year-old', label: 'Oldest first' },
  { value: 'title', label: 'Title: A to Z' },
];

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

  // Only the movies that match the chosen filters
  const filteredMovies = movies.filter((movie) => {
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

  // Put those movies in the order the user chose.
  // The [...] makes a copy, because sort() would change the original list.
  const visibleMovies = [...filteredMovies].sort((a, b) => {
    // Movies without a date go to the end
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
      // A movie without a title counts as an empty title
      return (a.title || '').localeCompare(b.title || '');
    }
    // Default: keep the order as it is
    return 0;
  });

  // True when at least one filter is chosen
  const hasFilters = filters.genre !== '' || filters.year !== '' || filters.rating !== '';

  return (
    <Container sx={{ py: 3 }}>
      {/* The banner is always at the top. It has its own movies, so a search does not hide it. */}
      {!heroLoading && heroMovies.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <HeroBanner movies={heroMovies} />
        </Box>
      )}

      {/* Placeholder with the banner's size, so the page does not jump when it loads */}
      {heroLoading && (
        <Skeleton
          variant="rounded"
          sx={{ height: { xs: 360, md: 480 }, borderRadius: '24px', mb: 3 }}
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
            // minmax(0, ...) keeps the columns from growing when a field has long text
            // Phone: 2 columns. Tablet: 3 columns. Desktop: search bar twice as wide + 3 dropdowns.
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

        {/* Bottom row: how many movies, and a Clear button when a filter is on */}
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

      {/* Results heading: the title on the left and the sort dropdown on the right.
          On a phone the dropdown goes under the title and fills the width. */}
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
          {searchText === '' ? 'Trending this week' : `Results for "${searchText}"`}
        </SectionTitle>

        {/* Sort dropdown */}
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

      {/* The very first time there is nothing to show, so we show grey placeholder cards */}
      {loading && movies.length === 0 && <MovieGrid loading />}

      {/* Later loads keep the old movies on screen (dimmed) and show a thin progress bar */}
      {loading && movies.length > 0 && <LinearProgress sx={{ borderRadius: 999, mb: 2 }} />}

      {error && <ErrorMessage message={error} onRetry={retry} />}

      {/* Search finished but nothing was found */}
      {!loading && !error && movies.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No movies found for "{searchText}". Try another title.
        </Typography>
      )}

      {!error && movies.length > 0 && (
        // While a new search loads, the old movies fade and cannot be clicked
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
            // Movies were loaded, but none match the filters
            <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
              No movies match your filters.
            </Typography>
          )}

          {/* The button that loads the next page. It stays on screen while loading, is disabled,
              and shows its own spinner, so the user always sees something is happening. */}
          {hasMore && !moreError && (
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

          {/* If loading more failed, show the error. Retry clears it, so the Load More button comes back. */}
          {moreError && <ErrorMessage message={moreError} onRetry={clearMoreError} />}
        </Box>
      )}
    </Container>
  );
}

export default Home;
