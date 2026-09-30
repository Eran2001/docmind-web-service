export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  collections: "/collections",
  collection: (id: string) => `/collections/${id}`,
  chat: (collectionId: string, conversationId?: string) =>
    conversationId
      ? `/collections/${collectionId}/chat/${conversationId}`
      : `/collections/${collectionId}/chat`,
  evals: "/evals",
  evalSet: (setId: string) => `/evals/${setId}`,
  usage: "/usage",
  adminUsage: "/admin/usage",
} as const;

export const AUTH_ROUTES: string[] = [routes.login, routes.register];
