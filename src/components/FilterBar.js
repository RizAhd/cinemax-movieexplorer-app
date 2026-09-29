import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList';

// Dropdowns to filter the movies.
// filters = the chosen values, onChange = called with the new filters when one changes
function FilterBar({ filters, genres, onChange }) {
  // Make a list of years, from this year back to 1950
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year);
  }

  // Minimum ratings the user can choose
  const ratings = [9, 8, 7, 6, 5];

  // True when at least one filter is chosen
  const hasFilters = filters.genre !== '' || filters.year !== '' || filters.rating !== '';

  return (
    <Box>
      {/* Title row, with a Clear button when a filter is on */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Filters
          </Typography>
        </Box>
        {hasFilters && (
          <Button size="small" onClick={() => onChange({ genre: '', year: '', rating: '' })}>
            Clear
          </Button>
        )}
      </Box>

      {/* On phones: Genre on its own row, Year and Rating side by side. On bigger screens: 3 in a row */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
        }}
      >
        {/* Genre dropdown. The empty value means "no filter" */}
        <TextField
          select
          fullWidth
          label="Genre"
          size="small"
          value={filters.genre}
          onChange={(event) => onChange({ ...filters, genre: event.target.value })}
          sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }}
        >
          <MenuItem value="">All genres</MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre.id} value={genre.id}>
              {genre.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Year dropdown */}
        <TextField
          select
          fullWidth
          label="Year"
          size="small"
          value={filters.year}
          onChange={(event) => onChange({ ...filters, year: event.target.value })}
        >
          <MenuItem value="">All years</MenuItem>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>

        {/* Rating dropdown: shows movies with this rating or higher */}
        <TextField
          select
          fullWidth
          label="Rating"
          size="small"
          value={filters.rating}
          onChange={(event) => onChange({ ...filters, rating: event.target.value })}
        >
          <MenuItem value="">All ratings</MenuItem>
          {ratings.map((rating) => (
            <MenuItem key={rating} value={rating}>
              {rating}+ stars
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
}

export default FilterBar;
