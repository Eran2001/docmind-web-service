import type { ChunkDetail, DocumentDto } from "@/types";

import { privateApi } from "@/lib/api/private.api";

// Writes answer `{ result: true }` (an upload/URL also returns the new id as `resourceId`), never the record: the mutation hooks
// invalidate the list, which refetches and shows the document with its real status.
export const documentsService = {
  async list(collectionId: string): Promise<DocumentDto[]> {
    const { data } = await privateApi.get<{ result: DocumentDto[] }>(
      `/collections/${collectionId}/documents`,
    );
    return data.result;
  },
  /** multipart/form-data with one `file` field (one request per file). */
  async upload(collectionId: string, file: File): Promise<void> {
    const form = new FormData();
    form.append("file", file);
    await privateApi.post(`/collections/${collectionId}/documents`, form);
  },
  async addUrl(collectionId: string, url: string): Promise<void> {
    await privateApi.post(`/collections/${collectionId}/documents/url`, {
      url,
    });
  },
  async reprocess(documentId: string): Promise<void> {
    await privateApi.post(`/documents/${documentId}/reprocess`);
  },
  async remove(documentId: string): Promise<void> {
    await privateApi.delete(`/documents/${documentId}`);
  },
  async getChunk(documentId: string, chunkId: string): Promise<ChunkDetail> {
    const { data } = await privateApi.get<
      Omit<ChunkDetail, "id"> & { resourceId: string }
    >(`/documents/${documentId}/chunks/${chunkId}`);
    return { ...data, id: data.resourceId };
  },
};
