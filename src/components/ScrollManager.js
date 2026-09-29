import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Where the user was scrolled on each page, for example { '/': 2400 }. It lives only in memory.
const savedPositions = {};

// Has no screen of its own. It keeps the scroll position in order:
// - Back / Forward buttons: go back to the exact place the user left on that page
// - Clicking a link to a new page: start at the top
// It must be inside the BrowserRouter, because it reads the current url.
function ScrollManager() {
  const { pathname } = useLocation();
  // 'POP' means the Back or Forward button. 'PUSH' means the user clicked a link.
  const navigationType = useNavigationType();

  // We restore the position ourselves, so the browser should not try to do it too
  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  // While the user is on this page, remember how far they have scrolled.
  // useLayoutEffect makes the cleanup run right when the page changes, before the browser
  // moves the scroll position because the next page is shorter.
  useLayoutEffect(() => {
    const rememberPosition = () => {
      savedPositions[pathname] = window.scrollY;
    };
    window.addEventListener('scroll', rememberPosition, { passive: true });
    return () => window.removeEventListener('scroll', rememberPosition);
  }, [pathname]);

  // When the page changes: Back/Forward go to the saved place, links go to the top
  useLayoutEffect(() => {
    const target = navigationType === 'POP' ? savedPositions[pathname] || 0 : 0;
    window.scrollTo(0, target);
  }, [pathname, navigationType]);

  return null;
}

export default ScrollManager;
