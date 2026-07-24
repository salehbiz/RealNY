import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Disable browser automatic scroll restoration on load/reload/navigation
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    // Immediately scroll to the top left of the page on route change before paint
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
