import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAppContext } from '../context/AppContext';
import { IMAGE_URL } from '../services/tmdb';

function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useAppContext();
  const favorite = isFavorite(movie.id);

  const [imageLoaded, setImageLoaded] = useState(false);

  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Card
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        overflow: 'visible',
        transition: 'transform 0.25s',
        '&:hover': { transform: 'translateY(-4px)' },
        '&:hover img': { transform: 'scale(1.06)' },
        '&:hover .poster-frame': { boxShadow: 8 },
      }}
    >
      <IconButton
        onClick={() => toggleFavorite(movie)}
        aria-label={favorite ? 'remove from favorites' : 'add to favorites'}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(4px)',
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.75)' },
        }}
      >
        {favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon sx={{ color: 'white' }} />}
      </IconButton>

      <CardActionArea component={Link} to={`/movie/${movie.id}`} sx={{ borderRadius: '16px' }}>
        <Box
          className="poster-frame"
          sx={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            bgcolor: 'action.hover',
            transition: 'box-shadow 0.25s',
          }}
        >
          {movie.poster_path ? (
            <CardMedia
              component="img"
              image={IMAGE_URL + movie.poster_path}
              alt={movie.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              sx={{
                aspectRatio: '2 / 3',
                objectFit: 'cover',
                display: 'block',
                opacity: imageLoaded ? 1 : 0,
                transition: 'transform 0.4s, opacity 0.5s',
              }}
            />
          ) : (
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

          <Box
            role="img"
            aria-label={`Rating ${rating} out of 10`}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: 999,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
            }}
          >
            <StarIcon color="secondary" sx={{ fontSize: 16 }} />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {rating}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ pt: 1.5, px: 0.5 }}>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }} title={movie.title}>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {year}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}

export default MovieCard;
