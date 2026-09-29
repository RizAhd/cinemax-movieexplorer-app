import { sha256Hex } from './sha256';
import {
  validateSignUp,
  validateFirstName,
  validateEmail,
  validatePassword,
  validateConfirm,
} from './validation';

// A demo account system. Everything is saved in this browser's localStorage, there is no server.
// Passwords are saved as a salted hash (never as plain text), but anyone who opens the browser
// tools can still see the accounts list, so this is NOT real security. It is fine for a demo.

const USERS_KEY = 'users';

// The message for every failed login. It is the same for "no such account" and "wrong password",
// so nobody can use the login form to find out which emails have accounts.
const LOGIN_ERROR = 'The email/username or the password is not correct.';

// Shown when the logged in person has no saved account (for example an old demo login)
const NO_ACCOUNT_ERROR = 'We could not find your account. Please log out and log in again.';

// Checks that a saved account has all the parts we need
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

// Reads all accounts. Broken or missing data gives an empty list instead of an error.
function readUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    const list = saved ? JSON.parse(saved) : [];
    return Array.isArray(list) ? list.filter(isStoredUser) : [];
  } catch (error) {
    return [];
  }
}

// Saves all accounts. Returns true if it worked, false if the browser refused (storage full or blocked).
function writeUsers(list) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
    return true;
  } catch (error) {
    return false;
  }
}

// A random text, different for every account, mixed into the password before hashing
function makeSalt() {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // Old browsers without crypto: less random, but still different for each account
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// The hash of a password with the salt of an account
export function hashPassword(password, salt) {
  return sha256Hex(`${salt}:${password}`);
}

// What the rest of the app is allowed to know about a logged in person (never the hash)
function toPublicUser(user) {
  return { firstName: user.firstName, username: user.username, email: user.email };
}

// Finds the account of a username (upper and lower case count as the same)
function findByUsername(users, username) {
  const name = String(username || '').toLowerCase();
  return users.find((user) => user.username.toLowerCase() === name);
}

// True if the password is the right one for this account
async function passwordMatches(account, password) {
  const hash = await hashPassword(password, account.salt);
  return hash === account.passwordHash;
}

// Gives the public details of an account, or null if there is no such account
export function getAccount(username) {
  const account = findByUsername(readUsers(), username);
  return account ? toPublicUser(account) : null;
}

// Creates an account.
// values = { firstName, username, email, password, confirm }
// Returns { ok: true, user } or { ok: false, errors: { field: message }, error: message }
export async function registerUser(values) {
  // Check the form again here, in case the form was skipped
  const errors = validateSignUp(values);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const firstName = values.firstName.trim();
  const username = values.username.trim();
  const email = values.email.trim().toLowerCase();

  // Emails and usernames must be new (upper and lower case count as the same)
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

// Checks a login. identifier is an email or a username.
// Returns { ok: true, user } or { ok: false, error: message }
export async function loginUser(identifier, password) {
  const name = String(identifier || '').trim().toLowerCase();
  if (name === '' || !password) {
    return { ok: false, error: 'Enter your email or username and your password.' };
  }

  const account = readUsers().find(
    (user) => user.email.toLowerCase() === name || user.username.toLowerCase() === name
  );

  // If there is no such account, we still calculate a hash, so a wrong email and a wrong password
  // take about the same time
  if (!account) {
    await hashPassword(password, 'no-such-account');
    return { ok: false, error: LOGIN_ERROR };
  }

  if (!(await passwordMatches(account, password))) {
    return { ok: false, error: LOGIN_ERROR };
  }

  return { ok: true, user: toPublicUser(account) };
}

// Changes the first name and/or the email of an account. The username can NOT be changed.
// username = the logged in person, values = { firstName, email, currentPassword }
// Changing the email needs the current password. Changing only the first name does not.
// Returns { ok: true, user } or { ok: false, errors: { field: message }, error: message }
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
    // Nobody else may use this email
    if (users.some((user) => user !== account && user.email.toLowerCase() === newEmail)) {
      return { ok: false, errors: { email: 'An account with this email already exists' } };
    }
    // To change the email you must prove who you are with your password
    if (!currentPassword) {
      return { ok: false, errors: { currentPassword: 'Enter your current password to change your email' } };
    }
    if (!(await passwordMatches(account, currentPassword))) {
      return { ok: false, errors: { currentPassword: 'Your current password is not correct' } };
    }
  }

  // The username and the password stay exactly as they were
  const updated = { ...account, firstName: firstName.trim(), email: newEmail };
  if (!writeUsers(users.map((user) => (user === account ? updated : user)))) {
    return { ok: false, error: 'We could not save your changes. Your browser storage may be full or blocked.' };
  }

  return { ok: true, user: toPublicUser(updated) };
}

// Changes the password of an account. It needs the current password.
// username = the logged in person, values = { currentPassword, newPassword, confirm }
// Returns { ok: true } or { ok: false, errors: { field: message }, error: message }
export async function changePassword(username, values) {
  const users = readUsers();
  const account = findByUsername(users, username);
  if (!account) {
    return { ok: false, error: NO_ACCOUNT_ERROR };
  }

  const { currentPassword = '', newPassword = '', confirm = '' } = values || {};

  // The current password must be filled in and correct
  if (!currentPassword) {
    return { ok: false, errors: { currentPassword: 'Enter your current password' } };
  }
  if (!(await passwordMatches(account, currentPassword))) {
    return { ok: false, errors: { currentPassword: 'Your current password is not correct' } };
  }

  // The new password must follow the rules, match the confirmation and be different from the old one
  const errors = {};
  const newPasswordError = validatePassword(newPassword);
  const confirmError = validateConfirm(newPassword, confirm);
  if (newPasswordError) errors.newPassword = newPasswordError;
  else if (newPassword === currentPassword) errors.newPassword = 'The new password must be different from the current one';
  if (confirmError) errors.confirm = confirmError;
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  // A new salt and a new hash. The old password stops working.
  const salt = makeSalt();
  const passwordHash = await hashPassword(newPassword, salt);
  const updated = { ...account, salt, passwordHash };
  if (!writeUsers(users.map((user) => (user === account ? updated : user)))) {
    return { ok: false, error: 'We could not save your new password. Your browser storage may be full or blocked.' };
  }

  return { ok: true };
}
