import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { smoothMenuProps } from './menuProps';

// Same look for all the dropdowns: rounded corners, and the same height as the search bar
const fieldStyle = {
  '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'background.default' },
};

// The three filter dropdowns (genre, year, rating).
// filters = the chosen values, onChange = called with the new filters when one changes.
// It has no wrapper on purpose: the fields are placed by the grid of the page that uses it.
function FilterBar({ filters, genres, onChange }) {
  // Make a list of years, from this year back to 1950
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year);
  }

  // Minimum ratings the user can choose
  const ratings = [9, 8, 7, 6, 5];

  return (
    <>
      {/* Genre dropdown. The empty value means "no filter". It gets a full row on phones only. */}
      <TextField
        select
        fullWidth
        label="Genre"
        value={filters.genre}
        onChange={(event) => onChange({ ...filters, genre: event.target.value })}
        slotProps={{ select: { MenuProps: smoothMenuProps } }}
        sx={{ ...fieldStyle, gridColumn: { xs: '1 / -1', sm: 'auto' } }}
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
        value={filters.year}
        onChange={(event) => onChange({ ...filters, year: event.target.value })}
        slotProps={{ select: { MenuProps: smoothMenuProps } }}
        sx={fieldStyle}
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
        value={filters.rating}
        onChange={(event) => onChange({ ...filters, rating: event.target.value })}
        slotProps={{ select: { MenuProps: smoothMenuProps } }}
        sx={fieldStyle}
      >
        <MenuItem value="">All ratings</MenuItem>
        {ratings.map((rating) => (
          <MenuItem key={rating} value={rating}>
            {rating}+ stars
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}

export default FilterBar;
