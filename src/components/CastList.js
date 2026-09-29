import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { PROFILE_URL } from '../services/tmdb';

// How many people to show before the "Show all cast" button
const FIRST_COUNT = 12;

// Shows the actors of a movie as small cards in a grid (no sideways scrolling)
function CastList({ cast }) {
  // false = only the first few, true = everybody
  const [showAll, setShowAll] = useState(false);

  if (cast.length === 0) {
    return <Typography color="text.secondary">No cast information available.</Typography>;
  }

  const visibleCast = showAll ? cast : cast.slice(0, FIRST_COUNT);

  return (
    <Box>
      {/* auto-fill makes as many columns of at least 130px as fit: 2 on a phone, more on bigger screens */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        }}
      >
        {visibleCast.map((person, index) => (
          <Box
            // credit_id is unique for each role. The index is only a backup.
            key={person.credit_id || `${person.id}-${index}`}
            sx={{
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
                // Only load the picture when it is near the screen (the list can be long)
                loading="lazy"
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
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                component="div"
                title={person.character}
              >
                {person.character}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Only when there are more people than we show at first */}
      {cast.length > FIRST_COUNT && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowAll(!showAll)}
            endIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showAll ? 'Show less' : `Show all cast (${cast.length})`}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CastList;
