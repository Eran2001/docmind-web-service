"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { routes } from "@/configs/routes";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  /** Error thrown by the route. Only its digest is shown, never the message (it may contain internals). */
  error: Error & { digest?: string };
  reset: () => void;
  /** Whole-page layout with the logo; otherwise it fills the space inside the app shell. */
  fullScreen?: boolean;
}

// Shared body for app/error.tsx, app/(app)/error.tsx and app/global-error.tsx.
export function ErrorState({ error, reset, fullScreen = false }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 px-4 text-center",
        fullScreen ? "min-h-screen" : "min-h-[60vh]",
      )}
    >
      {fullScreen && <Logo href={routes.home} size="lg" />}
      <div>
        <div className="mx-auto grid size-11 place-items-center rounded-full border text-muted-foreground">
          <TriangleAlert className="size-5" />
        </div>
        <h1 className="mt-4 mb-0 text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-1.5 mb-0 max-w-[400px] text-muted-foreground">
          An unexpected error stopped this page from loading. Try again, or go back to your collections.
        </p>
        {error.digest && <p className="mt-3 mb-0 font-mono text-xs text-faint">Error ID: {error.digest}</p>}
      </div>
      <div className="flex gap-2">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href={routes.collections}>Go to collections</Link>
        </Button>
      </div>
    </div>
  );
}
