import { createHash } from 'crypto';
import { sha256Hex, sha256Fallback } from './sha256';

const official = (text) => createHash('sha256').update(text, 'utf8').digest('hex');

describe('sha256Fallback', () => {
  test('known answers', () => {
    expect(sha256Fallback('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(sha256Fallback('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(sha256Fallback('The quick brown fox jumps over the lazy dog')).toBe(
      'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592'
    );
  });

  test('matches node around the 64 byte block size', () => {
    [1, 54, 55, 56, 57, 63, 64, 65, 119, 120, 127, 128, 1000].forEach((length) => {
      const text = 'a'.repeat(length);
      expect(sha256Fallback(text)).toBe(official(text));
    });
  });

  test('matches node for accents and emoji', () => {
    ['héllo wörld', 'Riflan Mohamed', 'pässwörd-£€¥', '日本語のパスワード', 'movie 🎬🍿'].forEach((text) => {
      expect(sha256Fallback(text)).toBe(official(text));
    });
  });
});

describe('sha256Hex', () => {
  test('uses the built-in crypto when there is one', async () => {
    expect(await sha256Hex('abc')).toBe(official('abc'));
  });

  test('still works without crypto.subtle', async () => {
    const original = global.crypto;
    Object.defineProperty(global, 'crypto', { value: undefined, configurable: true });
    try {
      expect(await sha256Hex('Str0ng!Pass')).toBe(official('Str0ng!Pass'));
    } finally {
      Object.defineProperty(global, 'crypto', { value: original, configurable: true });
    }
  });
});
