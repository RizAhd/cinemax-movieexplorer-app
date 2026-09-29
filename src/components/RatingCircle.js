import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function RatingCircle({ value, size = 64 }) {
  const score = value || 0;

  return (
    <Box
      role="img"
      aria-label={score ? `Rating ${score.toFixed(1)} out of 10` : 'No rating yet'}
      sx={{ position: 'relative', display: 'inline-flex' }}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={4}
        sx={{ color: 'divider' }}
      />
      <CircularProgress
        variant="determinate"
        value={score * 10}
        size={size}
        thickness={4}
        color="secondary"
        sx={{ position: 'absolute', left: 0 }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          {score ? score.toFixed(1) : 'N/A'}
        </Typography>
      </Box>
    </Box>
  );
}

export default RatingCircle;
