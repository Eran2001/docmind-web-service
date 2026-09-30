import type {
  Conversation,
  ConversationDetail,
  FeedbackInput,
  MessageFeedback,
  Paginated,
} from "@docmind/shared";

import { api } from "@/lib/axios";

export const chatService = {
  async listConversations(collectionId: string): Promise<Conversation[]> {
    const { data } = await api.get<Paginated<Conversation>>(
      `/collections/${collectionId}/conversations`,
      {
        params: { limit: 100 },
      },
    );
    return data.items;
  },
  async createConversation(collectionId: string): Promise<Conversation> {
    const { data } = await api.post<Conversation>(
      `/collections/${collectionId}/conversations`,
    );
    return data;
  },
  async getConversation(id: string): Promise<ConversationDetail> {
    const { data } = await api.get<ConversationDetail>(`/conversations/${id}`);
    return data;
  },
  async removeConversation(id: string): Promise<void> {
    await api.delete(`/conversations/${id}`);
  },
  async sendFeedback(
    messageId: string,
    input: FeedbackInput,
  ): Promise<MessageFeedback> {
    const { data } = await api.put<MessageFeedback>(
      `/messages/${messageId}/feedback`,
      input,
    );
    return data;
  },
};
