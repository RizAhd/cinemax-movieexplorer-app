import { useState, useEffect, useRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import useOnlineStatus from '../hooks/useOnlineStatus';

// Position of the messages. On a phone they sit above the bottom bar.
const snackbarSx = { bottom: { xs: 80, sm: 24 } };

// Shows a message at the bottom when the internet drops, and a short one when it comes back
function OfflineBanner() {
  const online = useOnlineStatus();
  // true for a few seconds after the connection came back
  const [showBackOnline, setShowBackOnline] = useState(false);
  // remembers that we were offline, so "back online" is not shown when the app first opens
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      setShowBackOnline(false);
    } else if (wasOffline.current) {
      wasOffline.current = false;
      setShowBackOnline(true);
    }
  }, [online]);

  return (
    <>
      {/* Stays on screen as long as there is no internet */}
      <Snackbar open={!online} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={snackbarSx}>
        <Alert severity="warning" variant="filled" sx={{ width: '100%' }}>
          You are offline. Some things may not load until you are back online.
        </Alert>
      </Snackbar>

      {/* Goes away by itself after 3 seconds */}
      <Snackbar
        open={showBackOnline}
        autoHideDuration={3000}
        onClose={() => setShowBackOnline(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={snackbarSx}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          You are back online.
        </Alert>
      </Snackbar>
    </>
  );
}

export default OfflineBanner;
