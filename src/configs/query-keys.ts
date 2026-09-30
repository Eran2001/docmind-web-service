export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  collections: {
    all: ["collections"] as const,
    list: (search = "") => ["collections", "list", search] as const,
    detail: (id: string) => ["collections", "detail", id] as const,
  },
  documents: {
    all: ["documents"] as const,
    list: (collectionId: string) =>
      ["documents", "list", collectionId] as const,
    chunk: (documentId: string, chunkId: string) =>
      ["documents", "chunk", documentId, chunkId] as const,
  },
  conversations: {
    all: ["conversations"] as const,
    list: (collectionId: string) =>
      ["conversations", "list", collectionId] as const,
    detail: (id: string) => ["conversations", "detail", id] as const,
  },
  usage: {
    all: ["usage"] as const,
    me: (days: number) => ["usage", "me", days] as const,
    admin: (days: number) => ["usage", "admin", days] as const,
  },
  evals: {
    all: ["evals"] as const,
    sets: () => ["evals", "sets"] as const,
    set: (id: string) => ["evals", "set", id] as const,
    run: (id: string) => ["evals", "run", id] as const,
  },
};
