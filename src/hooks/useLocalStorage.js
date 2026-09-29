import { useState, useEffect } from 'react';

// Works like useState, but the value is also saved in localStorage.
// key = the name used in localStorage, initialValue = used if nothing is saved yet
// isValid (optional) = a function that checks a saved value. If it says false,
// the saved value is thrown away and initialValue is used. This protects the app from
// broken or old values, for example when someone edits localStorage by hand.
function useLocalStorage(key, initialValue, isValid) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) {
        return initialValue;
      }

      // Turn the text back into a value
      const parsed = JSON.parse(saved);

      // If the value is not what we expect, do not use it
      if (isValid && !isValid(parsed)) {
        return initialValue;
      }
      return parsed;
    } catch (error) {
      // If reading or parsing fails, just use the starting value
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
