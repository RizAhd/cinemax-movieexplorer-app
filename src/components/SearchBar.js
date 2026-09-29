import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// A search box. The page that uses it keeps the text (value)
// and gets told about every change (onChange).
function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      placeholder="Search for a movie..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        input: {
          // Search icon on the left
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          // Clear button on the right, only when there is some text
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
