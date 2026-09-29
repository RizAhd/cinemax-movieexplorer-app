import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';

// Placeholder for now, the real movie details come later
function MovieDetails() {
  // Read the movie id from the url, for example /movie/550
  const { id } = useParams();

  return (
    <Typography variant="h4" sx={{ p: 2 }}>
      Movie details page (id: {id})
    </Typography>
  );
}

export default MovieDetails;
