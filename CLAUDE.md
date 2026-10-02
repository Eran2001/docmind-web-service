# DocMind Web — Rules

Single Next.js project (no monorepo). Everything lives under `src/`. Source of truth for product/API behaviour: `01-docmind-rag-platform.md`
(spec). If something is in neither the spec nor the code, ASK before inventing it.

## Hard rules
- Do not change the stack below. No swapping libraries.
- TypeScript strict. No `any`.
- The browser only talks to the API (`NEXT_PUBLIC_API_URL`). Never call the AI service from the web.
- Entities identify themselves as `resourceId` (never `id`) in types and code for what the API returns. The API's DTOs use `resourceId`; chat and eval services still map it to `id` on the view types (`Conversation`, `EvalSetSummary`, ...), and new types should use `resourceId` directly (`AdminTopUser` already does).
- Writes (create/update/delete) answer `data: { result: true }` and do NOT return the record (a create puts the new id in `resourceId`): services return void and the mutation hooks invalidate the list query so it refetches. Use the form values in toasts.
- API response shape (real API; differs from spec 8.1): success `{ code: "OK", data, message, resourceId, requestId }`, lists as `data.result`;
  failure `{ code: "NotFound" | "ApiRouteFailed" | ..., error: { status, details? }, debug?, message, resourceId, requestId }`. `message` is OUTSIDE `error`.
  `lib/api/base.ts` unwraps `data` for callers and `normalizeError` (`lib/api/errors.ts`) reads `code`, `message`, `error.details` from the top level; `lib/sse.ts` does the same for the chat stream. Error codes are PascalCase (see `types/api.ts`).
- No hardcoded secrets. Env is validated with zod in `configs/env.ts`.
- API types and SSE event types live in `src/types` (`@/types`); zod schemas live in `src/schemas` (`@/schemas`). Never duplicate them. Keep them in sync with the API service.
- Endpoints not in the spec: `PATCH /auth/me`, `POST /auth/change-password`, `DELETE /auth/me`, `/auth/me/avatar` (Settings) and the `/usage/me/export`, `/admin/usage/export` CSV downloads. They all exist in the API.
- Update `README.md` after each phase. Tests per spec Section 13.

## Stack
Next.js 16 App Router · TypeScript · Tailwind CSS v4 · shadcn/ui · lucide-react
TanStack Query v5 (server state) · Zustand (UI state only) · Axios (JSON) · react-hook-form + zod
sonner (toasts) · next-themes · react-markdown · recharts · npm

## Structure (`src/`)
- `app/` ROUTING ONLY. `page.tsx`/`layout.tsx` stay thin and render a view. Groups: `(auth)` login/register, `(app)` shell + screens.
- `views/<screen>/index.tsx` + `components/*` (screen-private). Screens: landing, auth, collections, documents, chat, evals, eval-detail, usage, settings.
- `components/ui` shadcn only (added via `npx shadcn@latest add <name>`, restyle with tokens, don't rewrite) · `layout/` shell pieces · `common/` shared.
- `providers/` · `configs/` (env, routes, query-keys, constants) · `services/` (Axios per domain) · `queries/` (TanStack hooks per domain)
  `stores/` (Zustand) · `schemas/` (zod schemas per domain) · `types/` (API + SSE event types) · `hooks/` · `lib/` (api/ = axios instances, session, errors; sse, utils) · `utils/` (pure helpers) · `styles/globals.css` · `proxy.ts` (auth redirect).

## Frontend rules
- NEVER create `src/pages/` (Pages Router). Screens live in `src/views/`.
- Pages are Server Components that render a view; add `"use client"` only where needed.
- Data flow: component → `queries/` hook → `services/` function → `lib/api/private.api.ts` (signed-in calls) or `lib/api/public.api.ts` (register, login). Components never call axios directly.
- Server state ONLY in TanStack Query. Zustand is for UI state (sidebar, selected citation, streaming status). Never copy query data into Zustand.
- Time: everything except the screen is UTC (ISO strings ending in `Z`). Convert ONLY for display, through `utils/local-time.ts` (`formatLocalDate`, `formatLocalTime`, `formatLocalDateTime`, `formatLocalDateTimeWithZone`, `getLocalTimeZone`); relative labels ("2h ago") are in `utils/format-date.ts`, built on it.
  Send times to the API with `toUtcIso(...)` / `localDateTimeToUtcIso(date, time)`. Never `toLocaleString()`/`getHours()` an API timestamp by hand, and never store local times.
- Query keys from `configs/query-keys.ts` factories; mutations invalidate the right keys.
- Routes from `configs/routes.ts` builders, never string literals.
- API base URL comes from `NEXT_PUBLIC_API_URL` in `.env` (validated in `configs/env.ts`). Both axios instances are made by `lib/api/base.ts` (base URL, `withCredentials`, unwrapping of the `{ code, data, ... }` envelope to just `data`).
  `private.api.ts` adds `Authorization: Bearer <access token>` and, on a 401, clears the session and goes to `/login?next=...`. Errors become `ApiError` (`lib/api/errors.ts`; `fieldErrors` for form fields).
- Auth: register/login return `data: { accessToken, tokenType, expiresIn, user }`. `services/auth.service.ts` stores the access token in the `dm_access` cookie (`lib/api/session.ts`; JS-readable so `proxy.ts` can guard routes;
  the cookie lives 7 days but the JWT inside only ~15 min) and `useMe` (GET `/auth/me`, only when a session exists) confirms it and loads the user. The refresh token is an httpOnly cookie set by the API; JavaScript never reads it.
- Silent refresh (`lib/api/refresh.ts`): `private.api.ts` renews an expired JWT before a request and, on a 401, refreshes once and repeats the request. ONE refresh at a time (each refresh token works once); if another tab already refreshed, its token is reused.
  If the API refuses the refresh (expired/revoked), `endSession()` clears the cookie and goes to `/login?next=...` (only from protected pages; public pages stay put). `proxy.ts` does NOT check JWT expiry, on purpose: it can't see the refresh cookie.
- Ending a session (sign out, delete account, refresh refused) clears everything user-specific: the token cookie, the TanStack cache, chat/citation state (`lib/api/user-data.ts` → `clearUserData`).
  Anything new that stores per-user data client-side (a Zustand store, localStorage) must be added there. Theme and sidebar preferences are not user data and stay.
- A 401 means "session over" to the web app, so the API must never use 401 for anything else (a wrong current password is a 400 field error).
- Documents are real too (`services/documents.service.ts`: one multipart POST per file, a POST for URLs; write calls return void and the hooks invalidate the list; polling every 3 s while anything is `queued`/`processing`). A single collection comes from `GET /collections/:id` (`useCollection`).
- Collections are real (`services/collections.service.ts`: lists come back as `data.result`; search is `?search=`, debounced 300 ms, previous results stay visible while it loads).
- Chat stream: `fetch` + `ReadableStream` in `lib/sse.ts` (POST, so not EventSource; Axios can't stream). Same credentials + refresh logic. Event types from `src/types/sse-events.ts`.
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
`npm run dev` (http://localhost:3000) · `npm run typecheck && npm run lint && npm run build`
There is no mock: run the API (and its worker and the AI service) next to the web app. `./dev.sh` in the repo root starts everything.

## Deploy note
The access-token cookie is set by the web app itself, so `proxy.ts` sees it. The API's httpOnly refresh cookie is only sent to the API (path `/api/v1/auth`), so web and API must share a site (same parent domain, e.g. `app.` + `api.`; `localhost` on different ports counts).
Next 16: `middleware.ts` was renamed `proxy.ts` (exported function is `proxy`).
