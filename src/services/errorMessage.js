// Turns an error into a short message a normal person can understand
export function getErrorMessage(error) {
  const generalMessage = 'Something went wrong. Please try again.';

  // We got something that is not an error object at all
  if (!error) {
    return generalMessage;
  }

  // The server did not answer in time (axios uses these codes for a timeout)
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'The movie server took too long to answer. Please try again.';
  }

  // No answer at all from the server
  if (!error.response) {
    // The request was sent but nothing came back: usually no internet
    if (error.request || error.code === 'ERR_NETWORK') {
      return 'Cannot reach the movie server. Please check your internet connection.';
    }
    // Any other error without a response is a problem inside our own code, not the network
    return generalMessage;
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

  return generalMessage;
}
