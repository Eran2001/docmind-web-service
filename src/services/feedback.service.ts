import type { RatedAnswer } from "@/types";

import { privateApi } from "@/lib/api/private.api";

export const feedbackService = {
  /** The answers you rated in a collection, newest rating first, each with its question. */
  async rated(collectionId: string, rating: -1 | 1): Promise<RatedAnswer[]> {
    const { data } = await privateApi.get<{ result: RatedAnswer[] }>(
      `/collections/${collectionId}/feedback`,
      { params: { rating } },
    );
    return data.result;
  },
};
