import type { Collection, CreateCollectionInput } from "@docmind/shared";

import { api } from "@/lib/axios";

export const collectionsService = {
  async list(): Promise<Collection[]> {
    const { data } = await api.get<{ items: Collection[] }>("/collections");
    return data.items;
  },
  async create(input: CreateCollectionInput): Promise<Collection> {
    const { data } = await api.post<Collection>("/collections", input);
    return data;
  },
  async update(
    id: string,
    input: Partial<CreateCollectionInput>,
  ): Promise<Collection> {
    const { data } = await api.patch<Collection>(`/collections/${id}`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/collections/${id}`);
  },
};
