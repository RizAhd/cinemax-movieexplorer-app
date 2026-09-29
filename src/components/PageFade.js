import { useLocation } from 'react-router-dom';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';

function PageFade({ children }) {
  const { pathname } = useLocation();

  // a new key mounts the page again, which plays the fade again
  return (
    <Fade in key={pathname} timeout={400}>
      <Box>{children}</Box>
    </Fade>
  );
}

export default PageFade;
