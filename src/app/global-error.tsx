"use client";

import { ErrorState } from "@/components/common/ErrorState";
import "@/styles/globals.css";

// Replaces the root layout when it crashes, so it renders its own <html> and <body>.
export default function GlobalError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <ErrorState {...props} fullScreen />
      </body>
    </html>
  );
}
