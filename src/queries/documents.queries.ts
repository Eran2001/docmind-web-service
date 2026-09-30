import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DOCUMENT_POLL_MS } from "@/configs/constants";
import { queryKeys } from "@/configs/query-keys";
import { documentsService } from "@/services/documents.service";

// Polls only while something is still being ingested.
export function useDocuments(collectionId: string) {
  return useQuery({
    queryKey: queryKeys.documents.list(collectionId),
    queryFn: () => documentsService.list(collectionId),
    refetchInterval: (query) =>
      query.state.data?.some(
        (d) => d.status === "queued" || d.status === "processing",
      )
        ? DOCUMENT_POLL_MS
        : false,
  });
}

function useInvalidateDocuments(collectionId: string) {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({
        queryKey: queryKeys.documents.list(collectionId),
      }),
      qc.invalidateQueries({ queryKey: queryKeys.collections.all }),
    ]);
}

export function useUploadDocument(collectionId: string) {
  const invalidate = useInvalidateDocuments(collectionId);
  return useMutation({
    mutationFn: (file: File) => documentsService.upload(collectionId, file),
    onSuccess: invalidate,
  });
}

export function useAddUrl(collectionId: string) {
  const invalidate = useInvalidateDocuments(collectionId);
  return useMutation({
    mutationFn: (url: string) => documentsService.addUrl(collectionId, url),
    onSuccess: invalidate,
  });
}

export function useReprocessDocument(collectionId: string) {
  const invalidate = useInvalidateDocuments(collectionId);
  return useMutation({
    mutationFn: (documentId: string) => documentsService.reprocess(documentId),
    onSuccess: invalidate,
  });
}

export function useDeleteDocument(collectionId: string) {
  const invalidate = useInvalidateDocuments(collectionId);
  return useMutation({
    mutationFn: (documentId: string) => documentsService.remove(documentId),
    onSuccess: invalidate,
  });
}

export function useChunk(
  documentId: string | undefined,
  chunkId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.documents.chunk(documentId ?? "", chunkId ?? ""),
    queryFn: () =>
      documentsService.getChunk(documentId as string, chunkId as string),
    enabled: !!documentId && !!chunkId,
    staleTime: Infinity,
  });
}
