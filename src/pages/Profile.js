import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SectionTitle from '../components/SectionTitle';
import PasswordStrength from '../components/PasswordStrength';
import { getInitial } from '../components/UserBadge';
import { getAccount } from '../services/auth';
import { validateFirstName, validateEmail, validatePassword, validateConfirm } from '../services/validation';

function fieldProps({ id, label, icon, value, onChange, onBlur, error, hint, type, autoComplete, disabled, endAdornment, maxLength }) {
  return {
    id,
    label,
    value,
    onChange,
    onBlur,
    type,
    autoComplete,
    disabled,
    fullWidth: true,
    margin: 'normal',
    error: Boolean(error),
    helperText: error || hint || ' ',
    slotProps: {
      input: {
        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
        endAdornment,
      },
      htmlInput: { maxLength },
    },
  };
}

function focusField(id) {
  const input = document.getElementById(id);
  if (input) input.focus();
}

function EyeButton({ visible, onToggle, label }) {
  return (
    <InputAdornment position="end">
      <IconButton aria-label={visible ? `hide ${label}` : `show ${label}`} onClick={onToggle} edge="end">
        {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  );
}

function DetailsCard({ account }) {
  const { updateProfile } = useAppContext();

  const [values, setValues] = useState({ firstName: account.firstName, email: account.email, currentPassword: '' });
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailChanged = values.email.trim().toLowerCase() !== account.email.toLowerCase();
  const changed = values.firstName.trim() !== account.firstName || emailChanged;

  const clientErrors = {};
  const firstNameError = validateFirstName(values.firstName);
  const emailError = validateEmail(values.email);
  if (firstNameError) clientErrors.firstName = firstNameError;
  if (emailError) clientErrors.email = emailError;
  if (emailChanged && !values.currentPassword) {
    clientErrors.currentPassword = 'Enter your current password to change your email';
  }

  const errorFor = (field) => serverErrors[field] || (touched[field] ? clientErrors[field] || '' : '');

  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
    setServerErrors({ ...serverErrors, [field]: '' });
    setFormError('');
    setSaved(false);
  };
  const handleBlur = (field) => () => setTouched({ ...touched, [field]: true });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving || !changed) return;

    setTouched({ firstName: true, email: true, currentPassword: true });
    setFormError('');
    setSaved(false);

    if (Object.keys(clientErrors).length > 0) {
      const first = ['firstName', 'email', 'currentPassword'].find((field) => clientErrors[field]);
      focusField(`profile-${first}`);
      return;
    }

    setSaving(true);
    try {
      const result = await updateProfile(values);
      if (result.ok) {
        setValues({ ...values, currentPassword: '' });
        setTouched({});
        setServerErrors({});
        setSaved(true);
      } else {
        setServerErrors(result.errors || {});
        setFormError(result.error || '');
        const first = ['firstName', 'email', 'currentPassword'].find((field) => result.errors && result.errors[field]);
        if (first) focusField(`profile-${first}`);
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '20px' }}>
      <Typography variant="h6" component="h2">
        Personal details
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        {saved && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Your profile was updated.
          </Alert>
        )}
        {formError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {formError}
          </Alert>
        )}

        <TextField
          {...fieldProps({
            id: 'profile-firstName',
            label: 'First name',
            icon: <BadgeOutlinedIcon />,
            value: values.firstName,
            onChange: handleChange('firstName'),
            onBlur: handleBlur('firstName'),
            error: errorFor('firstName'),
            autoComplete: 'given-name',
            disabled: saving,
            maxLength: 30,
          })}
        />

        <TextField
          {...fieldProps({
            id: 'profile-username',
            label: 'Username',
            icon: <AlternateEmailIcon />,
            value: account.username,
            hint: 'Your username cannot be changed',
            disabled: true,
            endAdornment: (
              <InputAdornment position="end">
                <LockOutlinedIcon fontSize="small" aria-label="locked" />
              </InputAdornment>
            ),
          })}
        />

        <TextField
          {...fieldProps({
            id: 'profile-email',
            label: 'Email',
            icon: <EmailOutlinedIcon />,
            value: values.email,
            onChange: handleChange('email'),
            onBlur: handleBlur('email'),
            error: errorFor('email'),
            type: 'email',
            autoComplete: 'email',
            disabled: saving,
            maxLength: 254,
          })}
        />

        {emailChanged && (
          <TextField
            {...fieldProps({
              id: 'profile-currentPassword',
              label: 'Current password (needed to change your email)',
              icon: <LockOutlinedIcon />,
              value: values.currentPassword,
              onChange: handleChange('currentPassword'),
              onBlur: handleBlur('currentPassword'),
              error: errorFor('currentPassword'),
              type: showPassword ? 'text' : 'password',
              autoComplete: 'current-password',
              disabled: saving,
              endAdornment: (
                <EyeButton visible={showPassword} onToggle={() => setShowPassword(!showPassword)} label="password" />
              ),
            })}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={!changed || saving}
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{ mt: 1 }}
        >
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </form>
    </Paper>
  );
}

function PasswordCard() {
  const { changePassword } = useAppContext();

  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const clientErrors = {};
  if (!values.currentPassword) clientErrors.currentPassword = 'Enter your current password';
  const newPasswordError = validatePassword(values.newPassword);
  const confirmError = validateConfirm(values.newPassword, values.confirm);
  if (newPasswordError) clientErrors.newPassword = newPasswordError;
  else if (values.newPassword === values.currentPassword) {
    clientErrors.newPassword = 'The new password must be different from the current one';
  }
  if (confirmError) clientErrors.confirm = confirmError;

  const errorFor = (field) => serverErrors[field] || (touched[field] ? clientErrors[field] || '' : '');

  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
    setServerErrors({ ...serverErrors, [field]: '' });
    setFormError('');
    setSaved(false);
  };
  const handleBlur = (field) => () => setTouched({ ...touched, [field]: true });

  const ids = { currentPassword: 'password-current', newPassword: 'password-new', confirm: 'password-confirm' };
  const order = ['currentPassword', 'newPassword', 'confirm'];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    setTouched({ currentPassword: true, newPassword: true, confirm: true });
    setFormError('');
    setSaved(false);

    if (Object.keys(clientErrors).length > 0) {
      const first = order.find((field) => clientErrors[field]);
      focusField(ids[first]);
      return;
    }

    setSaving(true);
    try {
      const result = await changePassword(values);
      if (result.ok) {
        setValues({ currentPassword: '', newPassword: '', confirm: '' });
        setTouched({});
        setServerErrors({});
        setSaved(true);
      } else {
        setServerErrors(result.errors || {});
        setFormError(result.error || '');
        const first = order.find((field) => result.errors && result.errors[field]);
        if (first) focusField(ids[first]);
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const eye = (
    <EyeButton visible={showPasswords} onToggle={() => setShowPasswords(!showPasswords)} label="passwords" />
  );
  const type = showPasswords ? 'text' : 'password';

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '20px' }}>
      <Typography variant="h6" component="h2">
        Change password
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        {saved && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Your password was changed. Use the new one the next time you log in.
          </Alert>
        )}
        {formError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {formError}
          </Alert>
        )}

        <TextField
          {...fieldProps({
            id: ids.currentPassword,
            label: 'Current password',
            icon: <LockOutlinedIcon />,
            value: values.currentPassword,
            onChange: handleChange('currentPassword'),
            onBlur: handleBlur('currentPassword'),
            error: errorFor('currentPassword'),
            type,
            autoComplete: 'current-password',
            disabled: saving,
            endAdornment: eye,
          })}
        />

        <TextField
          {...fieldProps({
            id: ids.newPassword,
            label: 'New password',
            icon: <LockOutlinedIcon />,
            value: values.newPassword,
            onChange: handleChange('newPassword'),
            onBlur: handleBlur('newPassword'),
            error: errorFor('newPassword'),
            hint: 'At least 8 characters',
            type,
            autoComplete: 'new-password',
            disabled: saving,
            maxLength: 64,
          })}
        />
        {values.newPassword !== '' && <PasswordStrength password={values.newPassword} />}

        <TextField
          {...fieldProps({
            id: ids.confirm,
            label: 'Confirm new password',
            icon: <LockOutlinedIcon />,
            value: values.confirm,
            onChange: handleChange('confirm'),
            onBlur: handleBlur('confirm'),
            error: errorFor('confirm'),
            type,
            autoComplete: 'new-password',
            disabled: saving,
            maxLength: 64,
          })}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{ mt: 1 }}
        >
          {saving ? 'Changing...' : 'Change password'}
        </Button>
      </form>
    </Paper>
  );
}

function Profile() {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const account = getAccount(user.username);

  if (!account) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <SectionTitle component="h1">My profile</SectionTitle>
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                logout();
                navigate('/signup');
              }}
            >
              Sign up
            </Button>
          }
        >
          You are using an older demo login, which has no account to edit. Log out and create an account to get a
          profile.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <SectionTitle component="h1">My profile</SectionTitle>

      <Paper
        variant="outlined"
        sx={{ p: { xs: 2.5, sm: 3 }, mb: 3, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: 2 }}
      >
        <Avatar
          sx={{
            width: 72,
            height: 72,
            fontSize: '2rem',
            fontWeight: 700,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          {getInitial(account.firstName || account.username)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" component="p" noWrap sx={{ fontWeight: 700 }}>
            {account.firstName}
          </Typography>
          <Typography color="text.secondary" noWrap>
            @{account.username}
          </Typography>
          <Typography color="text.secondary" variant="body2" noWrap>
            {account.email}
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' }, alignItems: 'start' }}>
        <DetailsCard account={account} />
        <PasswordCard />
      </Box>
    </Container>
  );
}

export default Profile;
