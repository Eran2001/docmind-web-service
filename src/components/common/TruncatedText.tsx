"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TruncatedTextProps {
  children: string;
  /** Lines shown before the text is cut with an ellipsis. */
  lines?: 1 | 2 | 3;
  className?: string;
  /** Let keyboard users focus the text (when it is cut) to read the tooltip. Turn off inside a link or button. */
  focusable?: boolean;
}

const CLAMP = { 1: "truncate", 2: "line-clamp-2 break-words", 3: "line-clamp-3 break-words" } as const;

// Clamps text to `lines`; the full text shows in a tooltip only when it was actually cut.
export function TruncatedText({ children, lines = 1, className, focusable = true }: TruncatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [cut, setCut] = useState(false);

  const isCut = () => {
    const el = ref.current;
    return !!el && (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
  };

  // Track whether the text is currently cut so it only becomes a tab stop when there is something to reveal.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setCut(isCut());
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, lines]);

  return (
    <Tooltip open={open} onOpenChange={(next) => setOpen(next && isCut())}>
      <TooltipTrigger asChild>
        <span ref={ref} tabIndex={focusable && cut ? 0 : undefined} className={cn("block min-w-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40", CLAMP[lines], className)}>
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="start" className="max-w-sm break-words">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
