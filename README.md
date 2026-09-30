# DocMind Web

Chat with your documents. Next.js 16 frontend for the DocMind platform (spec: `01-docmind-rag-platform.md`).
Sibling services: `docmind-api-service` (NestJS) and `docmind-ai-service` (FastAPI).

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

The web app talks to the API described in spec section 8 through `src/services`.
Until that API exists it runs against an in-browser mock (`src/lib/mock`), enabled by
`NEXT_PUBLIC_USE_MOCKS=true` (the default, see `.env.example`). Mock data is kept in
`localStorage`; clear the `docmind.mock.v2` key to reset it. Any email/password signs in
(password `wrong-password` fails, to exercise the error toast), and every mock user is an admin.

To use the real API, set `NEXT_PUBLIC_USE_MOCKS=false` and `NEXT_PUBLIC_API_URL`.

## Structure

```
src/
├── app/          routing only (Next.js App Router)
├── views/        one folder per screen
├── components/   ui (shadcn), layout, common
├── queries/      TanStack Query hooks
├── services/     Axios calls per domain
├── stores/       Zustand UI state
├── types/        API + SSE event types (mirror of what the API returns)
├── schemas/      zod schemas per domain
├── configs/ providers/ hooks/ lib/ utils/ styles/
└── proxy.ts       (auth redirect; called middleware.ts before Next 16)
```

Data flows component → `queries/` hook → `services/` function → `lib/axios.ts`. Server state lives in TanStack
Query, UI state in Zustand. The chat stream uses `lib/sse.ts` (fetch + ReadableStream).

Settings (`/settings`) is not in the spec's API; the mock adds `PATCH /auth/me`, `POST /auth/change-password` and
`DELETE /auth/me`, and the real API needs the same three.
