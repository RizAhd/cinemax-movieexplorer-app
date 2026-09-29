import useScrollTrigger from '@mui/material/useScrollTrigger';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useAppContext } from '../context/AppContext';

// A round button that appears after scrolling down. Clicking it scrolls back to the top.
function BackToTop() {
  const { user } = useAppContext();

  // true once the user has scrolled down more than 400px
  const visible = useScrollTrigger({ disableHysteresis: true, threshold: 400 });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={visible}>
      <Fab
        color="primary"
        size="medium"
        onClick={handleClick}
        aria-label="back to top"
        sx={{
          position: 'fixed',
          right: 16,
          // On phones, a logged in user has the bottom bar, so we sit above it
          bottom: user ? { xs: 72, sm: 24 } : 24,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
}

export default BackToTop;
