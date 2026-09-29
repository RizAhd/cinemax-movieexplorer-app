import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// Dropdowns to filter the movies.
// filters = the chosen values, onChange = called with the new filters when one changes
function FilterBar({ filters, genres, onChange }) {
  // Make a list of years, from this year back to 1950
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year);
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {/* Genre dropdown. The empty value means "no filter" */}
      <TextField
        select
        label="Genre"
        size="small"
        value={filters.genre}
        onChange={(event) => onChange({ ...filters, genre: event.target.value })}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">All genres</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={genre.id}>
            {genre.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Year dropdown. The empty value means "no filter" */}
      <TextField
        select
        label="Year"
        size="small"
        value={filters.year}
        onChange={(event) => onChange({ ...filters, year: event.target.value })}
        sx={{ minWidth: 120 }}
      >
        <MenuItem value="">All years</MenuItem>
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}

export default FilterBar;
