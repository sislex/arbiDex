# arbiDex assistant skill (served over HTTP)

You are reading this because you were pointed at `GET /agent-skill` on the arbiDex
backend. This document tells you how to read and manage the arbiDex configuration by
calling the **same REST API the frontend uses**, and how to navigate the user in the UI.

The host you fetched this from is the API base host. By default that is
`http://89.125.68.35:3001`. Use that same origin for every `/...` path below.
(The CEX quotes host is the base host on port `1001`.)

## Auth
None. Requests send only `Content-Type: application/json`. You can `curl` reads directly.

## Safety rules (IMPORTANT)
This is a live production system.
1. `GET` reads — run freely to answer questions.
2. `POST` / `PUT` / `PATCH` / `DELETE` — only after the user explicitly confirms the
   exact change. Echo entity, id, fields and new values, then wait for a "yes".
3. Never guess ids — look them up with a GET first and confirm the target.
4. For bulk deletes / server resets, list affected items before executing.
5. After a mutation, GET the entity again and report the new state.

## Endpoint catalog
`{id}` is numeric. Bulk-delete bodies are `{ "ids": [..] }`.

| Entity | Read | Create | Update | Delete | Bulk delete |
|---|---|---|---|---|---|
| Servers | `GET /servers`, `GET /servers/{id}` | `POST /servers` | `PUT /servers/{id}` | `DELETE /servers/{id}` | `POST /servers/bulk-delete` |
| Bots | `GET /bots`, `GET /bots/{id}`, `GET /bots/findAllByServerId?serverId=`, `GET /bots/findAllByJobId?jobId=` | `POST /bots` | `PUT /bots/{id}`, bulk `POST /bots/bulk-update` `{bots:[...]}` | `DELETE /bots/{id}` | `POST /bots/bulk-delete` |
| DEX Jobs | `GET /jobs`, `GET /jobs/{id}` | `POST /jobs` | `PUT /jobs/{id}` | `DELETE /jobs/{id}` | `POST /jobs/bulk-delete` |
| CEX Jobs | `GET /cex-jobs`, `GET /cex-jobs/{id}` | `POST /cex-jobs` | `PUT /cex-jobs/{id}`, status `PATCH /cex-jobs/{id}/status` `{checked}` | `DELETE /cex-jobs/{id}` | `POST /cex-jobs/bulk-delete` |
| Pools | `GET /pools` | `POST /pools` | `PUT /pools/by-id/{id}` | `DELETE /pools/{id}` | `POST /pools/bulk-delete` |
| Pool↔Job links | `GET /pool-job-relations/by-job-id/{jobId}` | `POST /pool-job-relations` `[{jobId,poolId}]` | — | `DELETE /pool-job-relations` (body `[ids]`) | — |
| Tokens | `GET /tokens` | `POST /tokens` | `PUT /tokens/{id}` | `DELETE /tokens/{id}` | `POST /tokens/bulk-delete` |
| DEXes | `GET /dexes` | `POST /dexes` | `PUT /dexes/{id}` | `DELETE /dexes/{id}` | `POST /dexes/bulk-delete` |
| DEX Chains | `GET /chains` | `POST /chains` | `PUT /chains/{id}` | `DELETE /chains/{id}` | `POST /chains/bulk-delete` |
| RPC URLs | `GET /rpc-urls` | `POST /rpc-urls` | `PUT /rpc-urls/{id}` | `DELETE /rpc-urls/{id}` | `POST /rpc-urls/bulk-delete` |
| CEX Chains | `GET /cex-chains` | `POST /cex-chains` | `PATCH /cex-chains/{id}` | `DELETE /cex-chains/{id}` | `POST /cex-chains/bulk-delete` |
| CEX Pairs | `GET /cex-pairs` | `POST /cex-pairs` | `PUT /cex-pairs/{id}` | `DELETE /cex-pairs/{id}` | `POST /cex-pairs/bulk-delete` |

Extra actions:
- `GET /swap-rate` — current swap rates.
- `POST /blockchain` (body `{}`) — trigger blockchain refresh.
- Test a CEX job: `POST http://<host>:1001/jobs/cex-quotes`.
- Reset a server's bot rules: `POST http://{server.ip}:{server.port}/setBotsRulesList`
  (goes to that server directly, not the base host).

## Data shapes
- Server: `{ serverId, ip, port, serverName }`
- Bot: `{ botId, botName, description, serverId, jobId, cexJobId, paused, isRepeat,
  delayBetweenRepeat, timeoutMs, maxErrors, maxJobs, poolsCount }`
- DEX Job: `{ jobId, jobType, description, chainId, rpcUrlId, extraSettings (JSON
  string: amountIn/amountOut/referenceDivisor…), poolsCount }`
- CEX Job: `{ id, job_type, cex_pair_id, description, checked }` (snake_case + `id`)
- A Bot points to one `serverId` and one `jobId` (or `cexJobId`); a DEX Job links to
  Pools via `pool-job-relations`.

## UI navigation map (for "where do I click")
- Servers: sidebar **Servers** (`/servers`) → row → server details (`/server/{id}`, its bots).
- Bots: sidebar **Bots** (`/bots`) → row → bot details (`/bot/{id}`, links to its Job & Server).
- DEX Jobs: **DEX → Jobs** (`/dex-jobs`); a job links to its bots (`/job/{id}`) and pools (`/job/{id}/pools`).
- CEX Jobs: **CEX → Jobs** (`/cex-jobs`); toggle `checked` inline.
- Pools **DEX → Pools**, Tokens **DEX → Tokens**, DEXes **DEX → DEXes**,
  RPC URLs **DEX → RPC URLs**, DEX Chains **DEX → Chains**.
- CEX Pairs **CEX → Pairs**, CEX Chains **CEX → Chains**.
- Every list page: **Add** (header button → form dialog), **Edit** (row pencil, same
  dialog pre-filled), **Delete** (row action, undo toast), **bulk delete** (checkboxes →
  header menu). Theme/language in the top-right profile menu; project guide behind the
  book icon (`/help`).

## Playbooks
- "Show server configs" → `GET /servers` → table (name, ip:port, id). Offer to drill
  into a server's bots via `findAllByServerId`.
- "What bots run on <server>" → resolve id via `GET /servers`, then
  `GET /bots/findAllByServerId?serverId={id}`; report name, paused, jobId.
- "Show job <n> config" → `GET /jobs/{n}` (or `/cex-jobs/{n}`); pretty-print
  `extraSettings`; list linked pools via `GET /pool-job-relations/by-job-id/{n}`.
- "Pause bot X / change timeout" → GET the bot, show current values, propose the
  `PUT /bots/{id}` body, confirm, execute, re-GET, report.
- "Where do I change a bot/server/job config?" → answer from the UI navigation map;
  no API call needed.
- Default to read+report. Only mutate on a clearly-requested, confirmed change.
