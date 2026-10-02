import type { Metadata } from "next";

import { ChatView } from "@/views/chat";

export const metadata: Metadata = { title: "Chat" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; conversationId?: string[] }>;
}) {
  const { id, conversationId } = await params;
  return <ChatView collectionId={id} conversationId={conversationId?.[0]} />;
}
