# DocMind Web — Rules

Frontend monorepo (`apps/web`, `packages/shared`). Source of truth for product/API behaviour: `01-docmind-rag-platform.md`
(spec). If something is in neither the spec nor the code, ASK before inventing it.

## Hard rules
- Do not change the stack below. No swapping libraries.
- TypeScript strict. No `any`.
- The browser only talks to the API (`NEXT_PUBLIC_API_URL`). Never call the AI service from the web.
- Error shape from the API: `{ error: { code, message, details? } }` (spec 8.1). Normalize all errors to it in `lib/axios.ts`.
- No hardcoded secrets. Env is validated with zod in `configs/env.ts`.
- API types, zod schemas and SSE event types live in `packages/shared` and are imported from `@docmind/shared`. Never duplicate them.
- Endpoints not in the spec (currently `PATCH /auth/me`, `POST /auth/change-password`, `DELETE /auth/me` for Settings) exist in the
  mock first; the API must add them before `NEXT_PUBLIC_USE_MOCKS=false`.
- Update `README.md` after each phase. Tests per spec Section 13.

## Stack
Next.js 15 App Router · TypeScript · Tailwind CSS v4 · shadcn/ui · lucide-react
TanStack Query v5 (server state) · Zustand (UI state only) · Axios (JSON) · react-hook-form + zod
sonner (toasts) · next-themes · react-markdown · recharts · pnpm workspaces

## Structure (`apps/web/src`)
- `app/` ROUTING ONLY. `page.tsx`/`layout.tsx` stay thin and render a view. Groups: `(auth)` login/register, `(app)` shell + screens.
- `views/<screen>/index.tsx` + `components/*` (screen-private). Screens: landing, auth, collections, documents, chat, evals, eval-detail, usage, settings.
- `components/ui` shadcn only (added via `pnpm dlx shadcn@latest add <name>`, restyle with tokens, don't rewrite) · `layout/` shell pieces · `common/` shared.
- `providers/` · `configs/` (env, routes, query-keys, constants) · `services/` (Axios per domain) · `queries/` (TanStack hooks per domain)
  `stores/` (Zustand) · `schemas/` (re-export shared zod) · `hooks/` · `lib/` (axios, sse, utils, mock) · `utils/` (pure helpers) · `styles/globals.css` · `middleware.ts`.

## Frontend rules
- NEVER create `src/pages/` (Pages Router). Screens live in `src/views/`.
- Pages are Server Components that render a view; add `"use client"` only where needed.
- Data flow: component → `queries/` hook → `services/` function → `lib/axios.ts`. Components never call axios directly.
- Server state ONLY in TanStack Query. Zustand is for UI state (sidebar, selected citation, streaming status). Never copy query data into Zustand.
- Query keys from `configs/query-keys.ts` factories; mutations invalidate the right keys.
- Routes from `configs/routes.ts` builders, never string literals.
- Axios: `baseURL = env.NEXT_PUBLIC_API_URL`, `withCredentials: true`. On 401 call `/auth/refresh` ONCE (share one in-flight promise across concurrent 401s), retry; if refresh fails → `/login`.
- Chat stream: `fetch` + `ReadableStream` in `lib/sse.ts` (POST, so not EventSource; Axios can't stream). Same credentials + refresh logic. Event types from `packages/shared/src/sse-events.ts`.
- Polling: document list every 3s ONLY while a doc is queued/processing (`refetchInterval` as a function); poll eval runs while queued/running.
- Tailwind v4 is CSS-first: NO `tailwind.config.js`. Tokens in `globals.css` via `@theme inline`; dark mode via `.dark` class (`next-themes attribute="class"`).
- Icons: lucide-react only.
- Responsive down to 375px; sidebar becomes a Sheet below 768px.
- Forms: react-hook-form + zodResolver; show field errors under inputs, server errors as sonner toasts.

## Design vs spec decisions (spec wins)
- No reranker in copy: "…merged with Reciprocal Rank Fusion".
- No "Continue with SSO" / "Forgot password?" (out of scope).
- "Admin usage" (global stats + top 10 users), admin-only. No team/org wording.
- Eval detail shows the judge model from run data, never hardcoded.
- Landing "Try the demo" logs in `demo@docmind.dev` (spec Section 10).

## Commands
`pnpm dev` (http://localhost:3000) · `pnpm typecheck && pnpm lint && pnpm build`
Mock API (`NEXT_PUBLIC_USE_MOCKS=true`, default) lives in `lib/mock`; state is in localStorage key `docmind.mock.v2`.

## Deploy note
Cross-site cookies won't reach `middleware.ts`. Serve web and API on one parent domain (`app.` + `api.`) or proxy `/api/v1/*` via Next `rewrites()`.
In Next 16, `middleware.ts` is renamed `proxy.ts`.
