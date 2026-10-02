import type { Metadata } from "next";

import { EvalDetailView } from "@/views/eval-detail";

export const metadata: Metadata = { title: "Eval set" };

export default async function Page({
  params,
}: {
  params: Promise<{ setId: string }>;
}) {
  const { setId } = await params;
  return <EvalDetailView setId={setId} />;
}
