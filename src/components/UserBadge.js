import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

// The first letter of a name in capitals, or "?" for an empty name.
// Array.from keeps letters with accents, or emoji, in one piece.
export function getInitial(name) {
  const first = Array.from(String(name || '').trim())[0];
  return first ? first.toUpperCase() : '?';
}

// A round avatar with the first letter of the user's name, and "Hi, Riflan" on bigger screens.
// It is a link to the profile page.
// user = { firstName, username, email }. Older logins have only a username, so we fall back to it.
function UserBadge({ user }) {
  const name = (user.firstName || user.username || '').trim();

  // What appears when the mouse rests on the badge, and what screen readers read
  const details = user.email ? `${name} (${user.email})` : name;

  return (
    <Tooltip title={`Your profile: ${details}`}>
      <Box
        component={Link}
        to="/profile"
        aria-label={`Open your profile. Logged in as ${details}`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mr: { xs: 0.5, sm: 1.5 },
          color: 'inherit',
          textDecoration: 'none',
          borderRadius: 999,
          '&:hover .MuiAvatar-root': { boxShadow: 3 },
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.95rem',
            fontWeight: 700,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            transition: 'box-shadow 0.2s',
          }}
        >
          {getInitial(name)}
        </Avatar>

        {/* The greeting is hidden on phones to save space. noWrap cuts a long name with ... */}
        <Typography
          variant="body2"
          noWrap
          sx={{ display: { xs: 'none', sm: 'block' }, maxWidth: { sm: 110, md: 180 }, fontWeight: 600 }}
        >
          Hi, {name}
        </Typography>
      </Box>
    </Tooltip>
  );
}

export default UserBadge;
