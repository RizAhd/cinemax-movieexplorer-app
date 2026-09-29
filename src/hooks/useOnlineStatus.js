import { useState, useEffect } from 'react';

// Tells you if the browser thinks it has internet (true) or not (false).
// It updates by itself when the connection drops or comes back.
function useOnlineStatus() {
  const [online, setOnline] = useState(
    typeof navigator === 'undefined' ? true : navigator.onLine
  );

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    // The browser sends these two events when the connection changes
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // Cleanup: stop listening when the component goes away
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}

export default useOnlineStatus;
