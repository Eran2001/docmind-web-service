import type { Metadata } from "next";

import { EvalsView } from "@/views/evals";

export const metadata: Metadata = { title: "Evals" };

export default function Page() {
  return <EvalsView />;
}
