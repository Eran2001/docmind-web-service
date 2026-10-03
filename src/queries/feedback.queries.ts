import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/configs/query-keys";
import { feedbackService } from "@/services/feedback.service";

/** Answers rated thumbs-down in a collection: the best source of new eval questions. */
export function useDownRatedAnswers(collectionId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.feedback.rated(collectionId, -1),
    queryFn: () => feedbackService.rated(collectionId, -1),
    enabled,
  });
}
