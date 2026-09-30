import type { Metadata } from "next";

import { DocumentsView } from "@/views/documents";

export const metadata: Metadata = { title: "Documents" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DocumentsView collectionId={id} />;
}
