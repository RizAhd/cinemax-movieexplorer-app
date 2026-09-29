import { useState } from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AuthLayout from '../components/AuthLayout';
import PasswordStrength from '../components/PasswordStrength';
import { validateSignUp } from '../services/validation';

// The fields in the order they appear on the page (used to find the first field with an error)
const FIELD_ORDER = ['firstName', 'username', 'email', 'password', 'confirm'];

// Sign up form: first name, username, email, password and confirm password
function SignUp() {
  const { user, register } = useAppContext();

  // What the user typed
  const [values, setValues] = useState({ firstName: '', username: '', email: '', password: '', confirm: '' });
  // Fields the user has already been in. Errors only show for these, so the form is not red from the start.
  const [touched, setTouched] = useState({});
  // Errors that came from the account service, for example "this email is already used"
  const [serverErrors, setServerErrors] = useState({});
  // A message for problems that belong to no field, shown at the top of the form
  const [formError, setFormError] = useState('');
  // true while the account is being created
  const [submitting, setSubmitting] = useState(false);
  // Show the passwords as text (true) or as dots (false)
  const [showPassword, setShowPassword] = useState(false);

  // The rules for every field, checked again on every keystroke
  const clientErrors = validateSignUp(values);

  // The error to show under a field ('' means no error)
  const errorFor = (field) => {
    if (serverErrors[field]) return serverErrors[field];
    return touched[field] ? clientErrors[field] || '' : '';
  };

  // Called when the user types in a field
  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
    // The old error from the server is out of date now
    setServerErrors({ ...serverErrors, [field]: '' });
    setFormError('');
  };

  // Called when the user leaves a field
  const handleBlur = (field) => () => {
    setTouched({ ...touched, [field]: true });
  };

  // Put the cursor in the first field that has an error
  const focusFirstError = (errors) => {
    const first = FIELD_ORDER.find((field) => errors[field]);
    if (first) {
      const input = document.getElementById(`signup-${first}`);
      if (input) input.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ignore a second click while the first one is still being handled
    if (submitting) {
      return;
    }

    // Show the errors of every field now
    setTouched({ firstName: true, username: true, email: true, password: true, confirm: true });
    setFormError('');

    if (Object.keys(clientErrors).length > 0) {
      focusFirstError(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      const result = await register(values);
      // If it worked, the new user is logged in and the redirect below sends them to the home page
      if (!result.ok) {
        setServerErrors(result.errors || {});
        setFormError(result.error || '');
        if (result.errors) focusFirstError(result.errors);
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Already logged in (or just signed up): go to the home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  // The same settings for every text field, to keep the code below short
  const fieldProps = (field, label, icon, extra = {}) => ({
    id: `signup-${field}`,
    label,
    fullWidth: true,
    margin: 'normal',
    value: values[field],
    onChange: handleChange(field),
    onBlur: handleBlur(field),
    error: errorFor(field) !== '',
    helperText: errorFor(field) || extra.hint || ' ',
    disabled: submitting,
    autoComplete: extra.autoComplete,
    type: extra.type,
    slotProps: {
      input: {
        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
        endAdornment: extra.endAdornment,
      },
      htmlInput: { maxLength: extra.maxLength },
    },
  });

  // The eye button that shows or hides the passwords
  const eyeButton = (
    <InputAdornment position="end">
      <IconButton
        aria-label={showPassword ? 'hide passwords' : 'show passwords'}
        onClick={() => setShowPassword(!showPassword)}
        edge="end"
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <AuthLayout title="Create your account" subtitle="Join Cinemax to save your favorite movies" maxWidth={540}>
      <form onSubmit={handleSubmit} noValidate>
        {formError && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {formError}
          </Alert>
        )}

        {/* First name and username side by side on bigger screens */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 2 }}>
          <TextField
            {...fieldProps('firstName', 'First name', <BadgeOutlinedIcon />, {
              autoComplete: 'given-name',
              maxLength: 30,
            })}
          />
          <TextField
            {...fieldProps('username', 'Username', <AlternateEmailIcon />, {
              autoComplete: 'username',
              maxLength: 20,
              hint: '3 to 20 letters, numbers or _',
            })}
          />
        </Box>

        <TextField
          {...fieldProps('email', 'Email', <EmailOutlinedIcon />, {
            autoComplete: 'email',
            type: 'email',
            maxLength: 254,
          })}
        />

        <TextField
          {...fieldProps('password', 'Password', <LockOutlinedIcon />, {
            autoComplete: 'new-password',
            type: showPassword ? 'text' : 'password',
            maxLength: 64,
            endAdornment: eyeButton,
            hint: 'At least 8 characters',
          })}
        />
        {/* The strength bar and the rules show up when the user starts typing a password */}
        {values.password !== '' && <PasswordStrength password={values.password} />}

        <TextField
          {...fieldProps('confirm', 'Confirm password', <LockOutlinedIcon />, {
            autoComplete: 'new-password',
            type: showPassword ? 'text' : 'password',
            maxLength: 64,
          })}
        />

        {/* While the account is created the button is disabled and shows a spinner */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{ mt: 1 }}
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 700 }}>
          Login
        </Link>
      </Typography>
    </AuthLayout>
  );
}

export default SignUp;
