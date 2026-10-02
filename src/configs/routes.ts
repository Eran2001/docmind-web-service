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
  settings: "/settings",
  adminUsage: "/admin/usage",
} as const;

export const AUTH_ROUTES: string[] = [routes.login, routes.register];

// Pages that need a signed-in user (guarded by proxy.ts). Everything else, like the landing page, is public.
export const PROTECTED_PREFIXES = [
  "/collections",
  "/evals",
  "/usage",
  "/settings",
  "/admin",
] as const;

export const isProtectedPath = (pathname: string): boolean =>
  PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
