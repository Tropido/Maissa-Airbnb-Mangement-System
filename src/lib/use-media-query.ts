'use client';

import { useSyncExternalStore } from 'react';

/**
 * Subscribes to a media query. The server snapshot is always `false`, so the
 * first client render matches the server and the real value follows without a
 * hydration mismatch.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
