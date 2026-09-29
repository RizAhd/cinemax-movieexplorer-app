// Rules for the sign up and login forms.
// Every validate function returns an error message (text), or an empty text '' when the value is fine.

// ---------- First name ----------
export function validateFirstName(value) {
  const name = String(value || '').trim();
  if (name === '') return 'First name is required';
  if (name.length < 2) return 'First name must be at least 2 letters';
  if (name.length > 30) return 'First name must be 30 letters or less';
  // Letters (any language), spaces, hyphens and apostrophes, for example "Anne-Marie" or "D'Souza"
  if (!/^[\p{L}][\p{L} '-]*$/u.test(name)) return 'Use letters only (spaces, - and \' are fine)';
  return '';
}

// ---------- Username ----------
export function validateUsername(value) {
  const username = String(value || '').trim();
  if (username === '') return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 20) return 'Username must be 20 characters or less';
  if (!/^[A-Za-z0-9_]+$/.test(username)) return 'Use only letters, numbers and _';
  return '';
}

// ---------- Email ----------
export function validateEmail(value) {
  const email = String(value || '').trim();
  if (email === '') return 'Email is required';
  if (email.length > 254) return 'Email is too long';
  // something@something.something, with no spaces
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Enter a valid email, like name@example.com';
  return '';
}

// ---------- Password ----------
// The rules a password must follow. The sign up page shows them as a checklist.
export const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'An uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'A lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { label: 'A number (0-9)', test: (p) => /[0-9]/.test(p) },
  { label: 'A symbol, like ! ? # $ %', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

// Returns each rule with ok = true or false
export function passwordChecks(password) {
  const text = String(password || '');
  return PASSWORD_RULES.map((rule) => ({ label: rule.label, ok: rule.test(text) }));
}

export function validatePassword(value) {
  const password = String(value || '');
  if (password === '') return 'Password is required';
  if (password.length > 64) return 'Password must be 64 characters or less';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Add an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Add a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Add a number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Add a symbol, like ! ? # $ %';
  return '';
}

// How strong a password is, for the strength bar: score 0 (nothing typed) to 4 (very strong)
export function passwordStrength(value) {
  const password = String(value || '');
  if (password === '') return { score: 0, label: '' };

  // One point for every rule the password follows (5 rules)
  const points = passwordChecks(password).filter((check) => check.ok).length;
  // A long password gets a bonus
  const bonus = password.length >= 12 ? 1 : 0;

  if (points <= 2) return { score: 1, label: 'Weak' };
  if (points <= 4) return { score: 2, label: 'Fair' };
  if (bonus === 0) return { score: 3, label: 'Good' };
  return { score: 4, label: 'Strong' };
}

// ---------- Confirm password ----------
export function validateConfirm(password, confirm) {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return '';
}

// ---------- The whole sign up form ----------
// Returns an object with one error per field. It is empty when everything is fine.
export function validateSignUp(values) {
  const errors = {
    firstName: validateFirstName(values.firstName),
    username: validateUsername(values.username),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirm: validateConfirm(values.password, values.confirm),
  };
  // Keep only the fields that have an error
  Object.keys(errors).forEach((field) => {
    if (errors[field] === '') delete errors[field];
  });
  return errors;
}
