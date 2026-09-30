# DocMind

**Chat with your documents. Get answers you can check.**

DocMind lets you upload your own files (PDF, Word, text, Markdown) or web pages into collections, then ask questions in plain
language. The AI answers **only from your documents** and shows **exactly where each claim came from**: the document, the
page, and the passage.

This repository is the **web app** (Next.js). It is one of three services; see [The three services](#the-three-services).

> **Project status:** work in progress, built phase by phase as an AI full-stack training project.
> All screens are built. Sign-in, sessions and account settings use the real API; the rest of the app still runs on an
> in-browser mock until the backend catches up. See [Status](#status) for the honest list.

---

## Why this exists

Most company knowledge sits in documents nobody has time to read: HR handbooks, contracts, board reports, API docs, security policies.

- **Keyword search** misses answers that use different words ("parental leave" vs "time off for new parents").
- **A general chatbot** doesn't know your documents, and when it doesn't know, it can invent a confident answer.

DocMind fixes both: it searches *your* documents by meaning and by keyword, hands the best passages to an AI model, and tells the model to
answer from those passages only and to cite them. If the answer isn't in the documents, it says so.

## How the AI helps you

1. **Ask in your own words.** "How long is parental leave, and who is eligible?" There is no special syntax.
2. **Get a direct answer with sources.** The answer streams in as it is written, with numbered citations like `[1]`, `[2]`.
   Click one to open the exact passage, the document title and the page number, so you can verify it instead of trusting it.
3. **Ask follow-ups naturally.** "What about part-time staff?" is rewritten behind the scenes into a standalone search
   ("What is the parental leave policy for part-time employees?"), so the conversation keeps its context.
4. **Honest when it doesn't know.** If the documents don't contain the answer, you get "I couldn't find that in your documents", not a guess.
5. **Rate the answers.** Thumbs up or down (with a reason) on every reply.
6. **Measure quality.** Build a test set of questions with known answers and run it after changing documents or settings.
   An AI judge scores each answer for correctness and faithfulness, and checks that the right document was retrieved.
7. **See what it costs.** Tokens and estimated spend per request, with a usage dashboard (and a global view for admins).

## How it works (RAG)

RAG (retrieval-augmented generation) means the AI is given the relevant text at question time instead of relying on memory.

```
  UPLOAD                                          ASK
  ──────                                          ───
  file / URL                                      question ("what about part-time?")
     │  parse (PDF, DOCX, web page)                  │  rewrite into a standalone query (follow-ups only)
     │  clean, split into ~500-token chunks          │  turn the query into an embedding
     │  turn each chunk into an embedding            ▼
     ▼                                            hybrid search in Postgres
  store chunks + embeddings (pgvector)            ├─ vector similarity  (finds meaning)
                                                  └─ keyword search     (finds exact terms, numbers, names)
                                                       merged with Reciprocal Rank Fusion → top 8 passages
                                                       │
                                                       ▼
                                                  Claude writes the answer from those passages only,
                                                  citing them as [1], [2] … and streams it to the browser
                                                       │
                                                       ▼
                                                  citations are extracted and linked to document + page + passage
```

Why hybrid search: meaning-based search finds "time off for new parents", keyword search finds "policy 4.2" or "SKU-9912". Together they cover both.

## The three services

```
┌───────────────┐    HTTPS + SSE    ┌────────────────────┐   internal HTTP   ┌────────────────────┐
│  Next.js web  │ ────────────────► │  NestJS API        │ ────────────────► │  Python AI service │
│  (this repo)  │ ◄──────────────── │  :4000             │ ◄──────────────── │  FastAPI :8000     │
│  :3000        │                   └───────┬─────┬──────┘                   └─────────┬──────────┘
└───────────────┘                           │     │                                    │
                                            ▼     ▼                                    ▼
                                    ┌──────────┐ ┌───────┐                   Anthropic (answers, judge)
                                    │ Postgres │ │ Redis │                   OpenAI (embeddings)
                                    │ +pgvector│ │ queue │
                                    └──────────┘ └───────┘
```

| Service | Folder | Job |
|---|---|---|
| **Web** | `docmind-web-service` (this one) | The UI: sign-in, collections, uploads, chat with citations, evals, usage |
| **API** | `docmind-api-service` | Owns users, data and auth; orchestrates uploads, background jobs and chat; the only service that touches the database |
| **AI** | `docmind-ai-service` | Everything AI: parsing, chunking, embeddings, LLM calls, judging. Stateless and internal; the browser never talks to it |

The browser only talks to the API. Keeping the AI work in its own service means the model code can change without touching the
web or the data layer.

## Screens

| Route | What it is |
|---|---|
| `/` | Landing page with a live-looking demo of a cited answer |
| `/login`, `/register` | Sign in / create an account |
| `/collections` | Your collections (folders of documents), with search and a ⋯ menu to delete |
| `/collections/:id` | Documents in a collection: drag-and-drop upload, add a URL, processing status |
| `/collections/:id/chat` | Chat: conversation list, streaming answers, citation panel |
| `/evals`, `/evals/:id` | Test sets, run history, per-question results with the judge's reasoning |
| `/usage`, `/admin/usage` | Tokens and cost over time; global stats and top users for admins |
| `/settings` | Profile and password |

Works from phone to desktop, in light and dark mode.

## Status

| Area | State |
|---|---|
| All screens and interactions | Built (see above) |
| Register, login, sign out, silent session refresh | **Real**: talks to the API, accounts stored in Postgres, argon2id-hashed passwords |
| Settings: edit profile, change password, delete account | **Real** |
| Collections: create, list, search, delete | **Real** (search is done by the API: `GET /collections?search=`) |
| Documents: upload (drag and drop), add URL, list, delete, reprocess | **Real** (files are saved by the API and queued) |
| Ingestion (status moving from Queued to Ready) | Needs the worker and the AI service; documents stay **Queued** for now |
| Chat, citations, streaming | Mock stream in the UI; real one needs API + AI service |
| Feedback, usage, evals | Mock; API next |
| Tests | Not yet for the web app (the API has its own test suite) |

The mock lives in `src/lib/mock` and answers everything except the calls listed in `src/lib/api/real-routes.ts`. As each
endpoint is built in the API, it gets one line there.

## Tech stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · TanStack Query · Zustand · Axios · react-hook-form + zod ·
react-markdown · Recharts · npm.

## Run it

Needs Node 22+ and the API running (for sign-in).

```bash
# 1. API and its database (in ../docmind-api-service)
npm run infra:up && npm run db:migrate && npm run start:dev      # http://localhost:4000

# 2. This app (in this folder)
npm install
npm run dev                                                      # port comes from PORT in .env (8080), else 3000
npm run typecheck && npm run lint && npm run build
```

Then open the app and register an account. Configuration is in `.env` (see `.env.example`):

| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the API (`http://localhost:4000/api/v1`) |
| `NEXT_PUBLIC_USE_MOCKS` | `true`: the mock answers everything except the real routes. Set `false` once the API is complete |
| `NEXT_PUBLIC_QUERY_DEVTOOLS` | `true` shows the TanStack Query devtools button |

Notes:
- New accounts have role `user`. To see the Admin pages: `UPDATE users SET role = 'admin' WHERE email = '...'` in the API's database.
- The landing page's "Try the demo" needs a `demo@docmind.dev` account, which the API's seed script will create later.
- Mock data is kept in `localStorage`; clear the `docmind.mock.v3` key to reset it.

## How the code is organised

```
src/
├── app/          routing only (Next.js App Router); pages are thin and render a view
├── views/        one folder per screen, with its private components
├── components/   ui (shadcn), layout (shell, sidebar), common (shared pieces)
├── queries/      TanStack Query hooks
├── services/     API calls per domain
├── lib/api/      the two axios instances (public / private), session token, error handling
├── stores/       Zustand (UI state only)
├── types/        API and SSE event types      schemas/   zod schemas
└── configs/ providers/ hooks/ lib/ utils/ styles/ proxy.ts
```

Data flows **component → `queries/` hook → `services/` function → `lib/api/private.api.ts`** (or `public.api.ts` for sign-in). Server
state lives in TanStack Query, UI state in Zustand. The chat stream uses `fetch` and a `ReadableStream` in `lib/sse.ts` because it is a POST.
`proxy.ts` sends signed-out visitors to `/login`. More detail and the conventions are in `CLAUDE.md`; the full product spec is `01-docmind-rag-platform.md`.

## Where to read next

- [`01-docmind-rag-platform.md`](./01-docmind-rag-platform.md): the full spec (features, database, API, AI details, build phases)
- `../docmind-api-service/README.md`: the backend
- `../docmind-ai-service/README.md`: the AI service
