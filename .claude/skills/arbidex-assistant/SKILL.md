---
name: arbidex-assistant
description: >-
  Operate the arbiDex config system from chat: read live configuration and help
  manage it. Use whenever the user asks to see, check, explain, change, create,
  or delete Servers, Bots, Jobs (CEX/DEX), Pools, Tokens, DEXes, Chains, Pairs,
  RPC URLs, or asks "where do I click / how do I change X in the UI". Calls the
  same backend API the frontend uses, and maps every entity to its UI location.
---

# arbiDex assistant

Lets me answer config questions and assist with management by calling the **same
REST API the frontend (`front-new`) uses**, and by navigating the user around the UI.

## Served over HTTP too
This same runbook is exposed by the backend at **`GET /agent-skill`** (markdown),
`GET /agent-skill/json`, and a machine-readable **`GET /agent-skill/spec`** (JSON:
entities, endpoints, body shapes, recipes). If the user pastes that URL and asks you
to "read the skill", fetch it and follow it. Sources:
`back/src/agent-skill/arbidex-assistant.skill.md` and `.spec.json` — keep all three
(this file + those two) in sync when endpoints, shapes, or recipes change.

## Dry-run protocol for mutations
No backend dry-run flag exists — simulate it before any write:
1. Resolve targets with GETs. 2. Compute exact request(s) (method, url, body).
3. Compute the affected set + `before -> after` diff per item. 4. Present the plan and
WAIT for confirmation. 5. Execute, then re-GET and report the real new state.

## Recipes (typical chat requests)
Machine version in `GET /agent-skill/spec` → `recipes`.
- **Pause/resume all bots on server X** (mutating): `GET /servers` → resolve id →
  `GET /bots/findAllByServerId?serverId={id}` → dry-run bots whose `paused` differs →
  confirm → `POST /bots/bulk-update {bots:[...]}` with each bot as the FULL update shape
  (`botId,botName,description,jobId,cexJobId,serverId,paused,isRepeat,delayBetweenRepeat,
  maxJobs,maxErrors,timeoutMs`), `paused` overridden → verify. Not `{botId,paused}` only.
- **Pause/resume bot N** (mutating): `GET /bots/N` → dry-run → confirm →
  `PUT /bots/N` (full update shape, paused overridden) → verify.
- **Jobs without bots** (read-only): `GET /jobs` + `GET /bots`; jobs whose `jobId` is in
  no bot. Same for CEX via `cexJobId`.
- **Find invalid configs** (read-only): `GET /servers` (port not 1..65535 / empty ip /
  127.0.0.1), orphan bots (serverId/jobId with no record), jobs missing chainId/rpcUrlId
  or with unparseable `extraSettings`. Report; never fix without confirmation.

## How the API is reached
- Base host (`VITE_HOST_URL`): **`http://89.125.68.35:3001`** — almost all endpoints.
- CEX quotes host (`VITE_CEX_QUOTES_URL`): **`http://89.125.68.35:1001`** — only `checkCexJob`.
- Some actions hit a **specific server's own** `ip:port` (see `resetServerSettings`).
- **No authentication** — requests send only `Content-Type: application/json`.
- Source of truth for paths: `front-new/src/app/services/api-service.ts`. If an
  endpoint here ever disagrees with that file, trust the file and update this skill.

Call it with `curl` (reads are safe to run freely):
```
curl -s -m 8 http://89.125.68.35:3001/servers            # list
curl -s -m 8 http://89.125.68.35:3001/bots/263           # one bot (setBotById)
curl -s -m 8 "http://89.125.68.35:3001/bots/findAllByServerId?serverId=4"
```

## Safety rules (IMPORTANT)
This is a **live production system**.
1. **Reads** (`GET`) — run freely to answer questions.
2. **Mutations** (`POST` / `PUT` / `PATCH` / `DELETE`) — **only after the user
   explicitly confirms this specific change.** Echo back exactly what will change
   (entity, id, fields, new values) and wait for a yes.
3. Never guess ids — look them up with a GET first, confirm the target with the user.
4. For bulk deletes / resets, list the affected items before executing.
5. After a mutation, GET the entity again and report the new state.

## Endpoint catalog
`{id}` is the numeric id. Bulk-delete bodies are `{ "ids": [..] }`.

| Entity | List / Read | Create | Update | Delete | Bulk delete |
|---|---|---|---|---|---|
| Servers | `GET /servers`, `GET /servers/{id}` | `POST /servers` | `PUT /servers/{id}` | `DELETE /servers/{id}` | `POST /servers/bulk-delete` |
| Bots | `GET /bots`, `GET /bots/{id}`, `GET /bots/findAllByServerId?serverId=`, `GET /bots/findAllByJobId?jobId=` | `POST /bots` | `PUT /bots/{id}`, bulk `POST /bots/bulk-update` `{bots:[...]}` | `DELETE /bots/{id}` | `POST /bots/bulk-delete` |
| DEX Jobs | `GET /jobs`, `GET /jobs/{id}` | `POST /jobs` | `PUT /jobs/{id}` | `DELETE /jobs/{id}` | `POST /jobs/bulk-delete` |
| CEX Jobs | `GET /cex-jobs`, `GET /cex-jobs/{id}` | `POST /cex-jobs` | `PUT /cex-jobs/{id}`, status `PATCH /cex-jobs/{id}/status` `{checked}` | `DELETE /cex-jobs/{id}` | `POST /cex-jobs/bulk-delete` |
| Pools | `GET /pools` | `POST /pools` | `PUT /pools/by-id/{id}` | `DELETE /pools/{id}` | `POST /pools/bulk-delete` |
| Pool↔Job links | `GET /pool-job-relations/by-job-id/{jobId}` | `POST /pool-job-relations` `[{jobId,poolId}]` | — | `DELETE /pool-job-relations` (body: `[ids]`) | — |
| Tokens | `GET /tokens` | `POST /tokens` | `PUT /tokens/{id}` | `DELETE /tokens/{id}` | `POST /tokens/bulk-delete` |
| DEXes | `GET /dexes` | `POST /dexes` | `PUT /dexes/{id}` | `DELETE /dexes/{id}` | `POST /dexes/bulk-delete` |
| DEX Chains | `GET /chains` | `POST /chains` | `PUT /chains/{id}` | `DELETE /chains/{id}` | `POST /chains/bulk-delete` |
| RPC URLs | `GET /rpc-urls` | `POST /rpc-urls` | `PUT /rpc-urls/{id}` | `DELETE /rpc-urls/{id}` | `POST /rpc-urls/bulk-delete` |
| CEX Chains | `GET /cex-chains` | `POST /cex-chains` | `PATCH /cex-chains/{id}` | `DELETE /cex-chains/{id}` | `POST /cex-chains/bulk-delete` |
| CEX Pairs | `GET /cex-pairs` | `POST /cex-pairs` | `PUT /cex-pairs/{id}` | `DELETE /cex-pairs/{id}` | `POST /cex-pairs/bulk-delete` |

Extra actions:
- `GET /swap-rate` — current swap rates.
- `POST /blockchain` (body `{}`) — trigger blockchain refresh.
- `checkCexJob`: `POST http://89.125.68.35:1001/jobs/cex-quotes` — test a CEX job.
- `resetServerSettings`: `POST http://{server.ip}:{server.port}/setBotsRulesList`
  — pushes the bot rules list to that server directly (not the base host).

## Data shapes (field reference for reporting configs)
- **Server**: `{ serverId, ip, port, serverName }`
- **Bot**: `{ botId, botName, description, serverId, jobId, cexJobId, paused,
  isRepeat, delayBetweenRepeat, timeoutMs, maxErrors, maxJobs, poolsCount }`
- **DEX Job**: `{ jobId, jobType, description, chainId, rpcUrlId, extraSettings
  (JSON string: amountIn/amountOut/referenceDivisor…), poolsCount }`
- **CEX Job**: `{ id, job_type, cex_pair_id, description, checked }`
  (note snake_case + `id`, unlike DEX jobs)
- **Relations**: a Bot points to one `serverId` and one `jobId` (or `cexJobId`);
  a DEX Job links to Pools via `pool-job-relations`.

## UI navigation map (for "where do I click")
Sidebar groups → pages (the panel uses in-app routes, not separate URLs the user types):
- **Servers**: sidebar `Servers` (`/servers`). Click a row → server details
  (`/server/{id}`) showing that server's bots. Edit/Delete via row actions; add via
  the button in the table header; bulk actions via the header menu.
- **Bots**: sidebar `Bots` (`/bots`). Click a row → bot details (`/bot/{id}`), where
  you can jump to its Job and its Server. Edit a bot with the row's edit (pencil).
- **DEX Jobs**: sidebar `DEX → Jobs` (`/dex-jobs`). A job row links to its **bots**
  (`/job/{id}`) and its **pools** (`/job/{id}/pools`, where you attach/detach pools).
- **CEX Jobs**: sidebar `CEX → Jobs` (`/cex-jobs`). Toggle `checked` status inline.
- **Pools**: `DEX → Pools` (`/pools`). **Tokens**: `DEX → Tokens` (`/tokens`).
  **DEXes**: `DEX → DEXes` (`/dexes`). **RPC URLs**: `DEX → RPC URLs` (`/dex-rpc-urls`).
  **DEX Chains**: `DEX → Chains` (`/dex-chains`).
- **CEX Pairs**: `CEX → Pairs` (`/cex-pairs`). **CEX Chains**: `CEX → Chains` (`/cex-chains`).
- Every list page: **Add** (header button, opens a form dialog), **Edit** (row action,
  same dialog pre-filled), **Delete** (row action, with an undo toast), **bulk delete**
  (select checkboxes → header menu). Theme/language live in the top-right profile menu.
- In-app **guide** at the book icon in the top bar (`/help`).

## Playbooks
- **"Show me the server configs"** → `GET /servers` → summarize as a table
  (name, ip:port, id). Offer to drill into a server's bots (`findAllByServerId`).
- **"What bots run on <server>"** → resolve server id via `GET /servers`, then
  `GET /bots/findAllByServerId?serverId={id}`; report name, paused, jobId.
- **"Show job <n> config"** → `GET /jobs/{n}` (or `/cex-jobs/{n}`); pretty-print
  `extraSettings`; note linked pools via `GET /pool-job-relations/by-job-id/{n}`.
- **"Pause bot X" / "change timeout"** → GET the bot, show current values, propose
  the `PUT /bots/{id}` body, **confirm**, execute, re-GET, report.
- **"Where do I change a bot/server/job config?"** → answer from the UI navigation
  map above (sidebar path + which button), no API call needed.
- **Prefer read+report by default.** Only mutate when the user clearly asked to change
  something and confirmed the exact change.
