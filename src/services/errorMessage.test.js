import { getErrorMessage } from './errorMessage';

const errorWithStatus = (status) => ({ response: { status } });
const GENERAL = 'Something went wrong. Please try again.';

describe('getErrorMessage', () => {
  test('no response means no internet', () => {
    expect(getErrorMessage({ request: {} })).toMatch(/internet connection/i);
    expect(getErrorMessage({ code: 'ERR_NETWORK' })).toMatch(/internet connection/i);
  });

  test('401 is the api key', () => {
    expect(getErrorMessage(errorWithStatus(401))).toMatch(/API key/i);
  });

  test('404 is not found', () => {
    expect(getErrorMessage(errorWithStatus(404))).toMatch(/could not find/i);
  });

  test('429 is too many requests', () => {
    expect(getErrorMessage(errorWithStatus(429))).toMatch(/too many requests/i);
  });

  test('500 and up is a server problem', () => {
    expect(getErrorMessage(errorWithStatus(500))).toMatch(/having problems/i);
    expect(getErrorMessage(errorWithStatus(503))).toMatch(/having problems/i);
  });

  test('a timeout says the server took too long', () => {
    expect(getErrorMessage({ code: 'ECONNABORTED' })).toMatch(/took too long/i);
    expect(getErrorMessage({ code: 'ETIMEDOUT' })).toMatch(/took too long/i);
  });

  test('any other status gets the general message', () => {
    expect(getErrorMessage(errorWithStatus(400))).toBe(GENERAL);
  });

  test('a bug in our own code is not blamed on the internet', () => {
    expect(getErrorMessage(new TypeError('x is undefined'))).toBe(GENERAL);
  });

  test('no error object gets the general message', () => {
    expect(getErrorMessage(undefined)).toBe(GENERAL);
    expect(getErrorMessage(null)).toBe(GENERAL);
  });
});
