import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

// Array.from keeps emoji and other characters that take two code units in one piece
export function getInitial(name) {
  const first = Array.from(String(name || '').trim())[0];
  return first ? first.toUpperCase() : '?';
}

function UserBadge({ user }) {
  const name = (user.firstName || user.username || '').trim();

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
          minHeight: 40,
          pr: { md: 1 },
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

        <Typography
          variant="body2"
          noWrap
          sx={{ display: { xs: 'none', md: 'block' }, maxWidth: { md: 130, lg: 180 }, fontWeight: 600 }}
        >
          Hi, {name}
        </Typography>
      </Box>
    </Tooltip>
  );
}

export default UserBadge;
