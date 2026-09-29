import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAppContext } from '../context/AppContext';
import { IMAGE_URL } from '../services/tmdb';

// Shows one movie: poster, title, year and rating.
// Clicking the card opens the movie details page.
function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useAppContext();
  const favorite = isFavorite(movie.id);

  // release_date looks like "2024-05-17", so we take the first 4 letters
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';

  // Show the rating with one decimal, for example 7.8
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    // position relative lets us put the heart button on top of the poster
    <Card sx={{ position: 'relative' }}>
      {/* The heart is outside the link, so clicking it does not open the details page */}
      <IconButton
        onClick={() => toggleFavorite(movie)}
        aria-label={favorite ? 'remove from favorites' : 'add to favorites'}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        {favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon sx={{ color: 'white' }} />}
      </IconButton>

      <CardActionArea component={Link} to={`/movie/${movie.id}`}>
        {movie.poster_path ? (
          <CardMedia
            component="img"
            image={IMAGE_URL + movie.poster_path}
            alt={movie.title}
            sx={{ aspectRatio: '2 / 3', objectFit: 'cover' }}
          />
        ) : (
          // Some movies have no poster, so we show a plain box instead
          <Box
            sx={{
              aspectRatio: '2 / 3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
            }}
          >
            <Typography color="text.secondary">No image</Typography>
          </Box>
        )}

        <CardContent>
          {/* noWrap keeps long titles on one line with ... at the end */}
          <Typography variant="subtitle1" noWrap>
            {movie.title}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {year}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon color="secondary" fontSize="small" />
              <Typography variant="body2">{rating}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default MovieCard;
