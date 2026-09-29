import { useLocation } from 'react-router-dom';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';

// Fades the page in every time the user goes to a different page.
// It must be inside the BrowserRouter, because it reads the current url.
function PageFade({ children }) {
  const { pathname } = useLocation();

  // A new key makes React build the page again, so the fade starts again
  return (
    <Fade in key={pathname} timeout={400}>
      <Box>{children}</Box>
    </Fade>
  );
}

export default PageFade;
