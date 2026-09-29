import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { passwordStrength, passwordChecks } from '../services/validation';

// The color of the bar for each score (0 is nothing typed yet)
const SCORE_COLORS = ['text.secondary', 'error', 'warning', 'info', 'success'];

// A strength bar and a checklist of the password rules, that update while the user types
function PasswordStrength({ password }) {
  const { score, label } = passwordStrength(password);
  const checks = passwordChecks(password);
  const color = SCORE_COLORS[score];

  return (
    <Box sx={{ mt: 0.5, mb: 1 }}>
      {/* The bar: 4 small pieces, the first few get colored */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {[1, 2, 3, 4].map((piece) => (
          <Box
            key={piece}
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 999,
              bgcolor: piece <= score ? `${color}.main` : 'action.hover',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
        {/* aria-live tells screen readers when the word changes */}
        <Typography
          variant="caption"
          aria-live="polite"
          sx={{ minWidth: 52, textAlign: 'right', fontWeight: 700, color: `${color}.main` }}
        >
          {label}
        </Typography>
      </Box>

      {/* The rules, each with a tick when the password follows it */}
      <Box
        component="ul"
        aria-label="Password rules"
        sx={{
          listStyle: 'none',
          p: 0,
          m: 0,
          mt: 1,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 0.25,
        }}
      >
        {checks.map((check) => (
          <Box
            component="li"
            key={check.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              color: check.ok ? 'success.main' : 'text.secondary',
            }}
          >
            {check.ok ? (
              <CheckCircleIcon sx={{ fontSize: 16 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
            )}
            <Typography variant="caption">{check.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default PasswordStrength;
