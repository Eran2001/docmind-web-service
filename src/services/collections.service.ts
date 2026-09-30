import type { CreateCollectionInput } from "@/schemas";
import type { Collection } from "@/types";

import { normalizeError } from "@/lib/api/errors";
import { privateApi } from "@/lib/api/private.api";

export const collectionsService = {
  /** `GET /collections?search=...`: the API filters (name or description, case-insensitive) and counts documents. */
  async list(search = ""): Promise<Collection[]> {
    const { data } = await privateApi.get<{ result: Collection[] }>("/collections", {
      params: search ? { search } : undefined,
    });
    return data.result;
  },
  // Writes answer `{ result: true }` (a create also returns the new id as `resourceId`), never the record: the list query is
  // invalidated by the mutation hooks and refetched, so the screen always shows what the server actually stored.
  /** One collection (the documents page header). Resolves to null when it doesn't exist or isn't yours. */
  async get(id: string): Promise<Collection | null> {
    try {
      const { data } = await privateApi.get<Collection>(`/collections/${id}`);
      return data;
    } catch (err) {
      if (normalizeError(err).status === 404) return null;
      throw err;
    }
  },
  async create(input: CreateCollectionInput): Promise<void> {
    await privateApi.post("/collections", input);
  },
  async update(id: string, input: Partial<CreateCollectionInput>): Promise<void> {
    await privateApi.patch(`/collections/${id}`, input);
  },
  async remove(id: string): Promise<void> {
    await privateApi.delete(`/collections/${id}`);
  },
};
