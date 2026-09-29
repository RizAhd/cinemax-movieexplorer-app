// Settings for the pop-up list of every dropdown, so they all open the same fast, smooth way.
// Use it like this: slotProps={{ select: { MenuProps: smoothMenuProps } }}
export const smoothMenuProps = {
  // Do not lock the page scroll while the list is open. Locking hides the scrollbar,
  // which makes the whole page jump sideways and forces the browser to redraw every poster.
  disableScrollLock: true,
  // A short opening animation (in milliseconds), so the list feels instant
  transitionDuration: 120,
  slotProps: {
    paper: {
      // A long list (like the years) scrolls inside the box instead of covering the screen
      sx: { maxHeight: 320, borderRadius: '12px', mt: 0.5 },
    },
  },
};
