import { useState, useEffect } from 'react';

// Works like useState, but the value is also saved in localStorage.
// key = the name used in localStorage, initialValue = used if nothing is saved yet
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      // If something was saved, turn the text back into a value
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch (error) {
      // If reading fails, just use the starting value
      return initialValue;
    }
  });

  // Save to localStorage every time the value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Saving can fail (for example if storage is full), so we ignore it
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
