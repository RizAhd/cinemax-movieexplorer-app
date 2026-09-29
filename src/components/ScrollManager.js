import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// where the user was scrolled on each page, kept in memory
const savedPositions = {};

// Back/Forward return to the saved spot, a new page starts at the top.
// Layout effects, so the scroll listener is removed before the next page
// is shorter and the browser moves the scroll position.
function ScrollManager() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useLayoutEffect(() => {
    const rememberPosition = () => {
      savedPositions[pathname] = window.scrollY;
    };
    window.addEventListener('scroll', rememberPosition, { passive: true });
    return () => window.removeEventListener('scroll', rememberPosition);
  }, [pathname]);

  useLayoutEffect(() => {
    const target = navigationType === 'POP' ? savedPositions[pathname] || 0 : 0;
    window.scrollTo(0, target);
  }, [pathname, navigationType]);

  return null;
}

export default ScrollManager;
