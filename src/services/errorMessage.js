// Turns an axios error into a short message a normal person can understand
export function getErrorMessage(error) {
  // No answer at all from the server: usually no internet
  if (!error.response) {
    return 'Cannot reach the movie server. Please check your internet connection.';
  }

  const status = error.response.status;

  if (status === 401) {
    return 'The movie service rejected our API key. Please check the key in the .env file.';
  }
  if (status === 404) {
    return 'We could not find what you were looking for.';
  }
  if (status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (status >= 500) {
    return 'The movie service is having problems right now. Please try again later.';
  }

  return 'Something went wrong. Please try again.';
}
