"use client";

import { useSyncExternalStore } from "react";

// Tailwind's `lg` breakpoint.
export const LG_QUERY = "(min-width: 1024px)";

// Live match state of a CSS media query. `serverDefault` is what the server render (and hydration) assumes.
export function useMediaQuery(query: string, serverDefault = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverDefault,
  );
}

// True at `lg` and wider. The server render assumes desktop.
export function useIsDesktop(): boolean {
  return useMediaQuery(LG_QUERY, true);
}
