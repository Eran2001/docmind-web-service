import type { Metadata } from "next";

import { UsageView } from "@/views/usage";

export const metadata: Metadata = { title: "Usage" };

export default function Page() {
  return <UsageView />;
}
