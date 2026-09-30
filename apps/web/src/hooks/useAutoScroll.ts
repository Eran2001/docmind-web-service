"use client";

import { useCallback, useEffect, useRef } from "react";

// Keeps a scroll container pinned to the bottom unless the user scrolled up.
export function useAutoScroll<T extends HTMLElement>(deps: unknown[]) {
  const ref = useRef<T | null>(null);
  const pinned = useRef(true);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    const el = ref.current;
    if (!el) return;
    if (force || pinned.current)
      requestAnimationFrame(() => (el.scrollTop = el.scrollHeight));
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => scrollToBottom(), deps);

  return { ref, onScroll, scrollToBottom };
}
