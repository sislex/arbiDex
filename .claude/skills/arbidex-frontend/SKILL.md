---
name: arbidex-frontend
description: >-
  Conventions and architecture for the arbiDex config admin panel (front-new).
  Use whenever working in front-new/ — adding or editing pages, forms, store
  slices/sagas, routes, or wiring the crypto-arbitrage config UI (CEX/DEX chains,
  pairs, pools, jobs, tokens, dexes, rpc-urls, bots, servers).
---

# arbiDex frontend (front-new)

`front-new/` is the **active** frontend (the old Angular `front/` was removed).
It is an admin panel for configuring a crypto-arbitrage system.

## Stack
- React + Vite + TypeScript, package manager **pnpm**.
- State: **Redux Toolkit + redux-saga** (server data), local React state for UI.
- UI: **Tailwind + shadcn/ui** (Radix), icons from **lucide-react**, toasts via **sonner**.
- Data grid: **ag-grid** wrapped by `components/DataTable.tsx`.
- Routing: **custom parser** in `routing/appRoutes.ts` on top of `react-router`
  (no `<Routes>`; `App.tsx` parses the URL and renders the matching page).

## Commands (run from `front-new/`)
```
pnpm install
pnpm dev      # Vite dev server → http://localhost:5173
pnpm build    # production build
pnpm test     # vitest (see *.test.ts next to sources)
```
Docker (repo root): `docker compose up --build -d` → `frontend-new`
(DockerfileFrontendReact, port 4203), `backend` (3001), postgres, pgadmin.

## Layout — `front-new/src/app/`
- `components/` — shared UI (TopBar, Sidebar, ProfileMenu, DataTable, Dialog, …).
- `components/pages/` — one component per screen (e.g. `PoolsPage`, `JobsPage`).
- `components/forms/` — create/edit dialogs (e.g. `PoolForm`, `DexJobForm`).
- `store/db-config/` — `dbConfig.slice.ts`, `dbConfig.sagas.ts`,
  `dbConfig.selectors.ts`, `dbConfig.api.ts` (+ `*.test.ts`). All server data.
- `routing/appRoutes.ts` — `parseAppRoute`, `ParsedRoute`, path helpers.
- `services/api-service.ts` — HTTP client; base URLs from
  `VITE_HOST_URL` and `VITE_CEX_QUOTES_URL`.
- `utils/` — toast helpers, pending-delete scheduler, auth session, normalizers.

## Domain model
Markets **CEX** and **DEX** plus shared **Bots** and **Servers**.
- DEX: Chains → RPC URLs → Tokens → DEXes → Pools → Jobs (attach pools) → Bots on Servers.
- CEX: Chains → Pairs → Jobs → Bots on Servers.
- Relations: a Job has Bots and (DEX) Pools; a Bot belongs to one Server and one Job.

## Conventions — follow these when editing
1. **i18n without a library.** Every component takes a `language: 'en' | 'ru'`
   prop and defines a local `const t = { en: {...}, ru: {...} }`, reading
   `t[language].key`. Add both languages for any new user-facing string.
2. **Semantic Tailwind tokens only** — `bg-background`, `bg-card`, `text-foreground`,
   `text-muted-foreground`, `border-border`, `bg-primary`, `bg-muted`, `bg-accent`,
   `text-destructive`. Do not hardcode hex/raw colors; the theme (dark/light) depends on it.
3. **Server state via the slice.** Load data by dispatching `dbConfigActions`
   (sagas fetch it), read with selectors + `useAppSelector`. Don't fetch ad-hoc in pages.
4. **Deletes are optimistic with undo.** Use the pending-delete scheduler +
   `showDeleteToast` / `showBulkDeleteToast` (see any page's `scheduleDelete`).
5. **New route =** extend `ParsedRoute`, add a match in `parseAppRoute`, a path
   helper (e.g. `helpPath()`), a `sidebarIdFromRoute` case, then render it in
   `App.tsx`'s `renderPage()` and set its `pageTitle`.
6. **New entity page =** mirror an existing page (e.g. `DexesPage`) — DataTable +
   form dialog + slice actions/selectors + api methods; keep the same structure.

## Gotchas
- The app renders pages manually from a parsed route — there is no `<Route>` table.
- `pageTitles` in `App.tsx` and the sidebar labels in `Sidebar.tsx` are separate;
  update both when adding a screen.
- No TypeScript installed as a dep — typecheck happens via the Vite build, not `tsc`.
- Vite alias `@` → `src`.

## In-app guide
There is a user + developer guide page at route `/help`
(`components/pages/GuidePage.tsx`), opened from the book icon in the TopBar.
Keep it in sync when the domain model or setup flow changes.
