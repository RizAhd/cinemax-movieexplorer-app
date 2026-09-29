import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      placeholder="Search for a movie..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
      sx={{
        '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'background.default' },
      }}
      slotProps={{
        htmlInput: { 'aria-label': 'Search movies' },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton aria-label="clear search" onClick={() => onChange('')}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}

export default SearchBar;
