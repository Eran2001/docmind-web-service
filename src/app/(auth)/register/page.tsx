import { Suspense } from "react";
import type { Metadata } from "next";

import { AuthView } from "@/views/auth";

export const metadata: Metadata = { title: "Create account" };

export default function Page() {
  return (
    <Suspense>
      <AuthView mode="register" />
    </Suspense>
  );
}
