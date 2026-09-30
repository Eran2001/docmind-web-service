import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateCollectionInput } from "@docmind/shared";

import { queryKeys } from "@/configs/query-keys";
import { collectionsService } from "@/services/collections.service";

export function useCollections() {
  return useQuery({
    queryKey: queryKeys.collections.list(),
    queryFn: collectionsService.list,
  });
}

// The API has no GET /collections/:id, so a single collection is picked from the list.
export function useCollection(id: string) {
  return useQuery({
    queryKey: queryKeys.collections.list(),
    queryFn: collectionsService.list,
    select: (items) => items.find((c) => c.id === id) ?? null,
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
