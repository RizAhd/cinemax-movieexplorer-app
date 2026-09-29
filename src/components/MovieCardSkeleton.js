import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function MovieCardSkeleton() {
  return (
    <Box>
      <Skeleton
        variant="rounded"
        sx={{ width: '100%', height: 'auto', aspectRatio: '2 / 3', borderRadius: '16px' }}
      />
      <Skeleton width="80%" sx={{ mt: 1.5 }} />
      <Skeleton width="30%" />
    </Box>
  );
}

export default MovieCardSkeleton;
