import { sha256Hex } from './sha256';
import { validateSignUp } from './validation';

// A demo account system. Everything is saved in this browser's localStorage, there is no server.
// Passwords are saved as a salted hash (never as plain text), but anyone who opens the browser
// tools can still see the accounts list, so this is NOT real security. It is fine for a demo.

const USERS_KEY = 'users';

// The message for every failed login. It is the same for "no such account" and "wrong password",
// so nobody can use the login form to find out which emails have accounts.
const LOGIN_ERROR = 'The email/username or the password is not correct.';

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

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  } catch (error) {
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

  const hash = await hashPassword(password, account.salt);
  if (hash !== account.passwordHash) {
    return { ok: false, error: LOGIN_ERROR };
  }

  return { ok: true, user: toPublicUser(account) };
}
