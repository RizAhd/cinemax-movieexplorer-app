import { useState, useEffect } from 'react';

// Returns the value only after it has stopped changing for `delay` milliseconds.
// Useful for search: we wait until the user stops typing before calling the API.
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer. When it ends, save the latest value.
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If the value changes again before the timer ends, cancel the old timer
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
