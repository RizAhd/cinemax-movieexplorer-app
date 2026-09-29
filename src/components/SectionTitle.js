import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function SectionTitle({ children, component = 'h2', mb = 2 }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb }}>
      <Box sx={{ width: 5, height: 28, borderRadius: 999, bgcolor: 'primary.main' }} />
      <Typography variant="h5" component={component}>
        {children}
      </Typography>
    </Box>
  );
}

export default SectionTitle;
