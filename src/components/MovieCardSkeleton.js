import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

// A grey pulsing placeholder that looks like a MovieCard.
// It is shown while the real movies are loading.
function MovieCardSkeleton() {
  return (
    <Box>
      {/* Poster shape (2 wide, 3 tall) */}
      <Skeleton
        variant="rounded"
        sx={{ width: '100%', height: 'auto', aspectRatio: '2 / 3', borderRadius: '16px' }}
      />
      {/* Title line and year line */}
      <Skeleton width="80%" sx={{ mt: 1.5 }} />
      <Skeleton width="30%" />
    </Box>
  );
}

export default MovieCardSkeleton;
