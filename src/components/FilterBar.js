import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { smoothMenuProps } from './menuProps';

const fieldStyle = {
  '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'background.default' },
};

function FilterBar({ filters, genres, onChange }) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year);
  }

  const ratings = [9, 8, 7, 6, 5];

  return (
    <>
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
