import type { ChunkDetail, DocumentDto } from "@/types";

import { api } from "@/lib/axios";

export const documentsService = {
  async list(collectionId: string): Promise<DocumentDto[]> {
    const { data } = await api.get<{ items: DocumentDto[] }>(
      `/collections/${collectionId}/documents`,
    );
    return data.items;
  },
  async upload(collectionId: string, file: File): Promise<DocumentDto> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<DocumentDto>(
      `/collections/${collectionId}/documents`,
      form,
    );
    return data;
  },
  async addUrl(collectionId: string, url: string): Promise<DocumentDto> {
    const { data } = await api.post<DocumentDto>(
      `/collections/${collectionId}/documents/url`,
      { url },
    );
    return data;
  },
  async reprocess(documentId: string): Promise<DocumentDto> {
    const { data } = await api.post<DocumentDto>(
      `/documents/${documentId}/reprocess`,
    );
    return data;
  },
  async remove(documentId: string): Promise<void> {
    await api.delete(`/documents/${documentId}`);
  },
  async getChunk(documentId: string, chunkId: string): Promise<ChunkDetail> {
    const { data } = await api.get<ChunkDetail>(
      `/documents/${documentId}/chunks/${chunkId}`,
    );
    return data;
  },
};
