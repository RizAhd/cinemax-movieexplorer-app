import { useState, useEffect, useRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import useOnlineStatus from '../hooks/useOnlineStatus';

const snackbarSx = { bottom: { xs: 80, sm: 24 } };

function OfflineBanner() {
  const online = useOnlineStatus();
  const [showBackOnline, setShowBackOnline] = useState(false);
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
      <Snackbar open={!online} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={snackbarSx}>
        <Alert severity="warning" variant="filled" sx={{ width: '100%' }}>
          You are offline. Some things may not load until you are back online.
        </Alert>
      </Snackbar>

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
