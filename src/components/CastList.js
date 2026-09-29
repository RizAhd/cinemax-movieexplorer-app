import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import { PROFILE_URL } from '../services/tmdb';

// Shows the main actors of a movie as small cards in a row that scrolls sideways
function CastList({ cast }) {
  // The cast can be very long, so we only show the first 10
  const mainCast = cast.slice(0, 10);

  if (mainCast.length === 0) {
    return <Typography color="text.secondary">No cast information available.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1.5 }}>
      {mainCast.map((person) => (
        // flexShrink 0 stops the cards from getting squashed in the row
        <Box
          key={person.id}
          sx={{
            width: 130,
            flexShrink: 0,
            borderRadius: '16px',
            overflow: 'hidden',
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            transition: 'transform 0.25s',
            '&:hover': { transform: 'translateY(-4px)' },
          }}
        >
          {/* Photo, or a grey box with an icon when the actor has no photo */}
          {person.profile_path ? (
            <Box
              component="img"
              src={PROFILE_URL + person.profile_path}
              alt={person.name}
              sx={{ width: '100%', aspectRatio: '2 / 3', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                aspectRatio: '2 / 3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'action.hover',
              }}
            >
              <PersonIcon sx={{ fontSize: 48 }} color="disabled" />
            </Box>
          )}

          {/* Name and the character they play */}
          <Box sx={{ p: 1.25 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700 }} title={person.name}>
              {person.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap component="div" title={person.character}>
              {person.character}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default CastList;
