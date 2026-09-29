import '@testing-library/jest-dom';
import { webcrypto } from 'crypto';
import { TextEncoder } from 'util';

// jsdom has no crypto or TextEncoder, browsers do

if (!global.crypto || !global.crypto.subtle) {
  Object.defineProperty(global, 'crypto', { value: webcrypto, configurable: true });
}
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
