import useScrollTrigger from '@mui/material/useScrollTrigger';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useAppContext } from '../context/AppContext';

function BackToTop() {
  const { user } = useAppContext();

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
