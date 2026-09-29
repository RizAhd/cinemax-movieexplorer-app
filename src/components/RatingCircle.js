import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

// A round rating meter. value is the rating from 0 to 10, for example 7.8
function RatingCircle({ value, size = 64 }) {
  const score = value || 0;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {/* The grey ring behind */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={4}
        sx={{ color: 'divider' }}
      />
      {/* The gold ring on top. 7.8 out of 10 fills 78% of the ring. */}
      <CircularProgress
        variant="determinate"
        value={score * 10}
        size={size}
        thickness={4}
        color="secondary"
        sx={{ position: 'absolute', left: 0 }}
      />
      {/* The number in the middle */}
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
