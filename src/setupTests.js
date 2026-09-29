// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { webcrypto } from 'crypto';
import { TextEncoder } from 'util';

// The test environment (jsdom) is missing two things every real browser has. We add them:
// - crypto (used to hash passwords)
// - TextEncoder (turns text into bytes)
if (!global.crypto || !global.crypto.subtle) {
  Object.defineProperty(global, 'crypto', { value: webcrypto, configurable: true });
}
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
