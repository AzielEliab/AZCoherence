# azcoherence download tracker

Isolated Worker `azcoherence-download-tracker`. Project `azcoherence`.
v0.1.0 serves the coherence reviewer (AZC-WP-0.1).
KV namespace `AZCOHERENCE_DOWNLOADS` bound as `DOWNLOADS` (`36ae4779a4e04502b8ca8043349a0160`).
Does **not** 302 to GitHub on `/download`. Serves gzip via `ASSETS.fetch`,
`Cache-Control: private, no-store`.

GET `/` is the product homepage (Use UI + counted download). Increments a **page-view** counter (separate from downloads).
GET `/download` increments **downloads**.
GET `/count` returns `{project, views, downloads, total}` (azhub convention: `total` = downloads).
`/v1` never increments DOWNLOADS KV.
GET `/install.sh` one-click install (does not increment; script curls `/download`).
GET `/v1/skill` returns skill markdown (`text/markdown`). Does not increment views or downloads.
GET `/v1/fraggate/list`, GET `/v1/fraggate/describe`, POST `/v1/fraggate/call` PROXY to aziel-runtime via the `AZIEL_RUNTIME` service binding. `/v1/runtime/{list,describe,call}` aliases map to those door paths.
`/v1/mesh/*` PROXY to aziel-runtime suite mesh (AZIEL_RUNTIME). Default OFF. GET never enables. Product-local `mesh_enable` is stub/REFUSE. QNM-BUILD-1.0 live|locked|isolated. QNS-CD-1.0 photon QNS1 hub cite / Worker mesh cross-map (local qnsd in https://github.com/AzielEliab/qnm-node ; runtime catalog in https://github.com/AzielEliab/aziel-runtime). No Node Gate. No public qnsd proxy. No auto-heal. Identity-bearing QNM mesh. Human UI Live Nodes strip polls `GET /v1/mesh`.
GET `/mcp` returns dual-surface MCP docs + FragGate pointer (`slug=azcoherence`). Does not increment.
POST `/mcp` is JSON-RPC MCP-over-HTTP (`initialize`, `tools/list`, `tools/call`) doubling catalog labels health/skill/doctor/verify/review_triad/alternate_score/coherence_check/neutralize_hallucination.
UI Review triad / Alternate score / Coherence check / Neutralize / Verify / Health / Skill / Doctor map to catalog LIVE_OPS.
GET `/cite.json`, `/sitemap.xml`, `/robots.txt`, `/llms.txt` are SEO / cite surfaces (suite peers + FragGate door + dual-surface law). Do not increment downloads.
Human UI shows Softwares-style peer links (AZ-CLCE, AKM-TRIAD cite-only, AZInterface, aziel-runtime, hubs) and the runtime FragGate call path (`POST /v1/fraggate/call` PROXY). Dual surface: agent MCP + human Worker UI + `/download`.

Host: https://azcoherence-download-tracker.vibelock.workers.dev

## Human / bot schema (`/stats` and `/count`)

Additive dual-count (Whitestone canary). Classification lives in `src/classify.js`
and response shaping in `src/stats-shape.js`.

Invariant: `views === views_human + views_bot` and
`downloads === downloads_human + downloads_bot`.

Legacy strategy (b): existing KV totals are never reset. Pre-split remainder
is shown as bot on read (`views_bot = views - views_human`). Author: Aziel Eliab only.

