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

export const CONVERSATIONS_PAGE_SIZE = 30;

export interface ConversationPage {
  items: Conversation[];
  nextCursor: string | null;
}

export const chatService = {
  /** One page of conversations, newest activity first. `nextCursor` is null on the last page. */
  async listConversations(
    collectionId: string,
    cursor?: string,
  ): Promise<ConversationPage> {
    const { data } = await privateApi.get<{
      result: ConversationResource[];
      nextCursor: string | null;
    }>(`/collections/${collectionId}/conversations`, {
      params: { limit: CONVERSATIONS_PAGE_SIZE, cursor },
    });
    return {
      items: data.result.map(toConversation),
      nextCursor: data.nextCursor,
    };
  },
  async createConversation(collectionId: string): Promise<Conversation> {
    const { data } = await privateApi.post<ApiEnvelope<{ result: true }>>(
      `/collections/${collectionId}/conversations`,
      undefined,
      { preserveEnvelope: true },
    );
    if (!data.resourceId)
      throw new Error("Conversation creation returned no resourceId.");
    const detail = await this.getConversation(data.resourceId);
    return {
      id: detail.id,
      collectionId: detail.collectionId,
      title: detail.title,
      createdAt: detail.createdAt,
      updatedAt: detail.updatedAt,
    };
  },
  async getConversation(id: string): Promise<ConversationDetail> {
    const { data } = await privateApi.get<ConversationDetailResource>(
      `/conversations/${id}`,
    );
    return toConversationDetail(data);
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

function toConversation(resource: ConversationResource): Conversation {
  return {
    id: resource.resourceId,
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
