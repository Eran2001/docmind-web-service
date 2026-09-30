"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";

// Width of an element (ResizeObserver). Returns null until first measured.
export function useElementWidth<T extends HTMLElement>(): [
  RefObject<T | null>,
  number | null,
] {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}
