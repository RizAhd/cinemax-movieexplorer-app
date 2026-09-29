import { getErrorMessage } from './errorMessage';

// Makes a fake axios error that has a response with the given status code
const errorWithStatus = (status) => ({ response: { status } });

describe('getErrorMessage', () => {
  test('says the internet is down when there is no response at all', () => {
    // axios gives an error without a response when the server cannot be reached
    const message = getErrorMessage({ request: {} });
    expect(message).toMatch(/internet connection/i);
  });

  test('explains a wrong API key for status 401', () => {
    expect(getErrorMessage(errorWithStatus(401))).toMatch(/API key/i);
  });

  test('says nothing was found for status 404', () => {
    expect(getErrorMessage(errorWithStatus(404))).toMatch(/could not find/i);
  });

  test('asks the user to wait for status 429 (too many requests)', () => {
    expect(getErrorMessage(errorWithStatus(429))).toMatch(/too many requests/i);
  });

  test('blames the movie service for server errors (500 and up)', () => {
    expect(getErrorMessage(errorWithStatus(500))).toMatch(/having problems/i);
    expect(getErrorMessage(errorWithStatus(503))).toMatch(/having problems/i);
  });

  test('gives a general message for any other status', () => {
    expect(getErrorMessage(errorWithStatus(400))).toBe('Something went wrong. Please try again.');
  });
});
