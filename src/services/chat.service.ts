import type { FeedbackInput } from "@/schemas";
import type { Conversation, ConversationDetail, MessageFeedback, Paginated } from "@/types";

import { privateApi } from "@/lib/api/private.api";

export const chatService = {
  async listConversations(collectionId: string): Promise<Conversation[]> {
    const { data } = await privateApi.get<Paginated<Conversation>>(
      `/collections/${collectionId}/conversations`,
      {
        params: { limit: 100 },
      },
    );
    return data.items;
  },
  async createConversation(collectionId: string): Promise<Conversation> {
    const { data } = await privateApi.post<Conversation>(
      `/collections/${collectionId}/conversations`,
    );
    return data;
  },
  async getConversation(id: string): Promise<ConversationDetail> {
    const { data } = await privateApi.get<ConversationDetail>(`/conversations/${id}`);
    return data;
  },
  async removeConversation(id: string): Promise<void> {
    await privateApi.delete(`/conversations/${id}`);
  },
  async sendFeedback(
    messageId: string,
    input: FeedbackInput,
  ): Promise<MessageFeedback> {
    const { data } = await privateApi.put<MessageFeedback>(
      `/messages/${messageId}/feedback`,
      input,
    );
    return data;
  },
};
