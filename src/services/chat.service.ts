import type { FeedbackInput } from "@/schemas";
import type {
  ApiEnvelope,
  Conversation,
  ConversationDetail,
  ConversationDetailResource,
  ConversationResource,
  MessageFeedback,
  MessageResource,
} from "@/types";

import { privateApi } from "@/lib/api/private.api";

export const chatService = {
  async listConversations(collectionId: string): Promise<Conversation[]> {
    const { data } = await privateApi.get<
      { result: ConversationResource[] } | { items: Conversation[] }
    >(`/collections/${collectionId}/conversations`, {
      params: { limit: 100 },
    });
    return "result" in data ? data.result.map(toConversation) : data.items;
  },
  async createConversation(collectionId: string): Promise<Conversation> {
    const { data } = await privateApi.post<
      ApiEnvelope<{ result: true }> | Conversation
    >(`/collections/${collectionId}/conversations`, undefined, {
      preserveEnvelope: true,
    });
    if ("code" in data) {
      if (!data.resourceId)
        throw new Error("Conversation creation returned no resourceId.");
      return toConversation(await this.getConversation(data.resourceId));
    }
    return data;
  },
  async getConversation(id: string): Promise<ConversationDetail> {
    const { data } = await privateApi.get<
      ConversationDetailResource | ConversationDetail
    >(`/conversations/${id}`);
    return "resourceId" in data ? toConversationDetail(data) : data;
  },
  async removeConversation(id: string): Promise<void> {
    await privateApi.delete(`/conversations/${id}`);
  },
  async sendFeedback(
    messageId: string,
    input: FeedbackInput,
  ): Promise<MessageFeedback> {
    await privateApi.put(`/messages/${messageId}/feedback`, input);
    return { rating: input.rating, comment: input.comment ?? null };
  },
};

function toConversation(
  resource: ConversationResource | ConversationDetail,
): Conversation {
  return {
    id: "resourceId" in resource ? resource.resourceId : resource.id,
    collectionId: resource.collectionId,
    title: resource.title,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
}

function toConversationDetail(
  resource: ConversationDetailResource,
): ConversationDetail {
  return {
    ...toConversation(resource),
    messages: resource.messages.map(toMessage),
  };
}

function toMessage(
  resource: MessageResource,
): ConversationDetail["messages"][number] {
  const { resourceId, ...message } = resource;
  return { ...message, id: resourceId };
}
