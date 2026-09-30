"use client";

import { ErrorState } from "@/components/common/ErrorState";

// Keeps the sidebar visible; only the page area shows the error.
export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState {...props} />;
}
