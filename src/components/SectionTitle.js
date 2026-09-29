import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// A heading with a small red bar on the left, used to start a section of a page
function SectionTitle({ children }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
      {/* The red bar */}
      <Box sx={{ width: 5, height: 28, borderRadius: 999, bgcolor: 'primary.main' }} />
      <Typography variant="h5" component="h2">
        {children}
      </Typography>
    </Box>
  );
}

export default SectionTitle;
