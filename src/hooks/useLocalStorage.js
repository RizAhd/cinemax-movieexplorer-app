import { useState, useEffect } from 'react';

// Like useState, but saved in localStorage. isValid is optional: a saved value that fails it
// is ignored, so a broken or hand-edited value cannot crash the app.
function useLocalStorage(key, initialValue, isValid) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) {
        return initialValue;
      }

      const parsed = JSON.parse(saved);

      if (isValid && !isValid(parsed)) {
        return initialValue;
      }
      return parsed;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // storage can be full or blocked, the value then only lives in memory
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
