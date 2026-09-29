import { sha256Hex } from './sha256';
import {
  validateSignUp,
  validateFirstName,
  validateEmail,
  validatePassword,
  validateConfirm,
} from './validation';

// Demo accounts stored in localStorage, there is no server. Passwords are saved as a salted hash,
// but anyone can open the dev tools and read the list, so this is not real security.
const USERS_KEY = 'users';

// Same text for an unknown account and a wrong password, so the form does not reveal which emails exist
const LOGIN_ERROR = 'The email/username or the password is not correct.';

const NO_ACCOUNT_ERROR = 'We could not find your account. Please log out and log in again.';

function isStoredUser(user) {
  return (
    user &&
    typeof user === 'object' &&
    typeof user.firstName === 'string' &&
    typeof user.username === 'string' &&
    typeof user.email === 'string' &&
    typeof user.salt === 'string' &&
    typeof user.passwordHash === 'string'
  );
}

function readUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    const list = saved ? JSON.parse(saved) : [];
    return Array.isArray(list) ? list.filter(isStoredUser) : [];
  } catch (error) {
    return [];
  }
}

function writeUsers(list) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
    return true;
  } catch (error) {
    return false;
  }
}

function makeSalt() {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // very old browsers
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function hashPassword(password, salt) {
  return sha256Hex(`${salt}:${password}`);
}

function toPublicUser(user) {
  return { firstName: user.firstName, username: user.username, email: user.email };
}

function findByUsername(users, username) {
  const name = String(username || '').toLowerCase();
  return users.find((user) => user.username.toLowerCase() === name);
}

async function passwordMatches(account, password) {
  const hash = await hashPassword(password, account.salt);
  return hash === account.passwordHash;
}

export function getAccount(username) {
  const account = findByUsername(readUsers(), username);
  return account ? toPublicUser(account) : null;
}

export async function registerUser(values) {
  const errors = validateSignUp(values);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const firstName = values.firstName.trim();
  const username = values.username.trim();
  const email = values.email.trim().toLowerCase();

  const users = readUsers();
  const duplicates = {};
  if (users.some((user) => user.email.toLowerCase() === email)) {
    duplicates.email = 'An account with this email already exists';
  }
  if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    duplicates.username = 'This username is already taken';
  }
  if (Object.keys(duplicates).length > 0) {
    return { ok: false, errors: duplicates };
  }

  const salt = makeSalt();
  const passwordHash = await hashPassword(values.password, salt);
  const newUser = { firstName, username, email, salt, passwordHash, createdAt: Date.now() };

  if (!writeUsers([...users, newUser])) {
    return {
      ok: false,
      error: 'We could not save your account. Your browser storage may be full or blocked.',
    };
  }

  return { ok: true, user: toPublicUser(newUser) };
}

export async function loginUser(identifier, password) {
  const name = String(identifier || '').trim().toLowerCase();
  if (name === '' || !password) {
    return { ok: false, error: 'Enter your email or username and your password.' };
  }

  const account = readUsers().find(
    (user) => user.email.toLowerCase() === name || user.username.toLowerCase() === name
  );

  if (!account) {
    // hash anyway, so a missing account takes as long as a wrong password
    await hashPassword(password, 'no-such-account');
    return { ok: false, error: LOGIN_ERROR };
  }

  if (!(await passwordMatches(account, password))) {
    return { ok: false, error: LOGIN_ERROR };
  }

  return { ok: true, user: toPublicUser(account) };
}

export async function updateProfile(username, values) {
  const users = readUsers();
  const account = findByUsername(users, username);
  if (!account) {
    return { ok: false, error: NO_ACCOUNT_ERROR };
  }

  const { firstName = '', email = '', currentPassword = '' } = values || {};

  const errors = {};
  const firstNameError = validateFirstName(firstName);
  const emailError = validateEmail(email);
  if (firstNameError) errors.firstName = firstNameError;
  if (emailError) errors.email = emailError;
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const newEmail = email.trim().toLowerCase();
  const emailChanged = newEmail !== account.email.toLowerCase();

  if (emailChanged) {
    if (users.some((user) => user !== account && user.email.toLowerCase() === newEmail)) {
      return { ok: false, errors: { email: 'An account with this email already exists' } };
    }
    if (!currentPassword) {
      return { ok: false, errors: { currentPassword: 'Enter your current password to change your email' } };
    }
    if (!(await passwordMatches(account, currentPassword))) {
      return { ok: false, errors: { currentPassword: 'Your current password is not correct' } };
    }
  }

  const updated = { ...account, firstName: firstName.trim(), email: newEmail };
  if (!writeUsers(users.map((user) => (user === account ? updated : user)))) {
    return { ok: false, error: 'We could not save your changes. Your browser storage may be full or blocked.' };
  }

  return { ok: true, user: toPublicUser(updated) };
}

export async function changePassword(username, values) {
  const users = readUsers();
  const account = findByUsername(users, username);
  if (!account) {
    return { ok: false, error: NO_ACCOUNT_ERROR };
  }

  const { currentPassword = '', newPassword = '', confirm = '' } = values || {};

  if (!currentPassword) {
    return { ok: false, errors: { currentPassword: 'Enter your current password' } };
  }
  if (!(await passwordMatches(account, currentPassword))) {
    return { ok: false, errors: { currentPassword: 'Your current password is not correct' } };
  }

  const errors = {};
  const newPasswordError = validatePassword(newPassword);
  const confirmError = validateConfirm(newPassword, confirm);
  if (newPasswordError) errors.newPassword = newPasswordError;
  else if (newPassword === currentPassword) errors.newPassword = 'The new password must be different from the current one';
  if (confirmError) errors.confirm = confirmError;
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const salt = makeSalt();
  const passwordHash = await hashPassword(newPassword, salt);
  const updated = { ...account, salt, passwordHash };
  if (!writeUsers(users.map((user) => (user === account ? updated : user)))) {
    return { ok: false, error: 'We could not save your new password. Your browser storage may be full or blocked.' };
  }

  return { ok: true };
}
