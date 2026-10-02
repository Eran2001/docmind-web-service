import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateCollectionInput } from "@/schemas";

import { queryKeys } from "@/configs/query-keys";
import { collectionsService } from "@/services/collections.service";

/** `search` is sent to the API. The previous list stays on screen while a new search loads, so typing doesn't flash skeletons. */
export function useCollections(search = "") {
  return useQuery({
    queryKey: queryKeys.collections.list(search),
    queryFn: () => collectionsService.list(search),
    placeholderData: keepPreviousData,
  });
}

/** One collection from `GET /collections/:id` (null when it doesn't exist or isn't yours). */
export function useCollection(id: string) {
  return useQuery({
    queryKey: queryKeys.collections.detail(id),
    queryFn: () => collectionsService.get(id),
  });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCollectionInput) =>
      collectionsService.create(input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.collections.all }),
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => collectionsService.remove(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.collections.all }),
  });
}
