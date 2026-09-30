import type { Metadata } from "next";

import { CollectionsView } from "@/views/collections";

export const metadata: Metadata = { title: "Collections" };

export default function Page() {
  return <CollectionsView />;
}
