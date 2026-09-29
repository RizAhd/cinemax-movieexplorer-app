import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';

// Start of every TMDb profile photo url
const PROFILE_URL = 'https://image.tmdb.org/t/p/w185';

// Shows the main actors of a movie in a row that scrolls sideways
function CastList({ cast }) {
  // The cast can be very long, so we only show the first 10
  const mainCast = cast.slice(0, 10);

  if (mainCast.length === 0) {
    return <Typography color="text.secondary">No cast information available.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
      {mainCast.map((person) => (
        // flexShrink 0 stops the items from getting squashed in the row
        <Box key={person.id} sx={{ width: 90, flexShrink: 0, textAlign: 'center' }}>
          <Avatar
            src={person.profile_path ? PROFILE_URL + person.profile_path : undefined}
            alt={person.name}
            sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
          >
            {/* Shown when the actor has no photo */}
            <PersonIcon />
          </Avatar>
          <Typography variant="body2" noWrap title={person.name}>
            {person.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap component="div" title={person.character}>
            {person.character}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default CastList;
