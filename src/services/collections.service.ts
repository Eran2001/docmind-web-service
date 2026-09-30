import type { CreateCollectionInput } from "@/schemas";
import type { Collection } from "@/types";

import { privateApi } from "@/lib/api/private.api";

export const collectionsService = {
  async list(): Promise<Collection[]> {
    const { data } = await privateApi.get<{ items: Collection[] }>("/collections");
    return data.items;
  },
  async create(input: CreateCollectionInput): Promise<Collection> {
    const { data } = await privateApi.post<Collection>("/collections", input);
    return data;
  },
  async update(
    id: string,
    input: Partial<CreateCollectionInput>,
  ): Promise<Collection> {
    const { data } = await privateApi.patch<Collection>(`/collections/${id}`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await privateApi.delete(`/collections/${id}`);
  },
};
