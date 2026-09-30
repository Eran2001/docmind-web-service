# DocMind

Chat with your documents. Monorepo layout:

- `apps/web` — Next.js 15 frontend (built from `docmind-design/*.html`)
- `packages/shared` — API types, zod schemas and SSE event types shared by web and (later) api

`apps/api` and `services/ai` are not built yet; see `01-docmind-rag-platform.md`.

## Run the web app

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm typecheck && pnpm lint && pnpm build
```

The web app talks to the Node API described in spec section 8 through `apps/web/src/services`.
Until that API exists it runs against an in-browser mock (`apps/web/src/lib/mock`), enabled by
`NEXT_PUBLIC_USE_MOCKS=true` (the default, see `apps/web/.env.example`). Mock data is kept in
`localStorage`; clear the `docmind.mock.v2` key to reset it. Any email/password signs in
(password `wrong-password` fails, to exercise the error toast), and every mock user is an admin.

To use the real API, set `NEXT_PUBLIC_USE_MOCKS=false` and `NEXT_PUBLIC_API_URL`.

## Frontend structure

Routing only in `src/app`; screens in `src/views/<screen>`. Data flows
component → `queries/` hook → `services/` function → `lib/axios.ts`. Server state lives in TanStack
Query, UI state in Zustand (`stores/`). The chat stream uses `lib/sse.ts` (fetch + ReadableStream).

Settings (`09-Settings.html`) is intentionally not built: the spec has no endpoints for it.
