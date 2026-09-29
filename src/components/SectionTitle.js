import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// A heading with a small red bar on the left, used to start a section of a page.
// component is the html heading tag: use "h1" for the main title of a page, "h2" for the rest.
// mb is the space under the heading (2 by default). Use 0 when something sits next to it.
function SectionTitle({ children, component = 'h2', mb = 2 }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb }}>
      {/* The red bar */}
      <Box sx={{ width: 5, height: 28, borderRadius: 999, bgcolor: 'primary.main' }} />
      <Typography variant="h5" component={component}>
        {children}
      </Typography>
    </Box>
  );
}

export default SectionTitle;
