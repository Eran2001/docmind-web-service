"use client";

import { Toaster } from "@/components/ui/sonner";

export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      closeButton
      duration={5000}
      visibleToasts={3}
    />
  );
}
