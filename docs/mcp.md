# AZCoherence MCP notes

Agents do **not** treat MCP chrome as the product. FragGate is THE
single door.

## Canonical catalog door

1. `fraggate_list` or `GET https://aziel-runtime.vibelock.workers.dev/v1/software`
2. `fraggate_describe` slug `azcoherence`
3. `fraggate_call` `{ slug: "azcoherence", op, payload }`

Catalog MCP: `POST https://aziel-runtime.vibelock.workers.dev/mcp`

Kernel: https://github.com/AzielEliab/fraggate

## This Worker (thin double)

`GET` / `POST` https://azcoherence-download-tracker.vibelock.workers.dev/mcp

JSON-RPC: `initialize`, `tools/list`, `tools/call`, `ping`.

Tools: `azcoherence_health`, `azcoherence_skill`, `azcoherence_doctor`,
`azcoherence_verify`, `azcoherence_review_triad`,
`azcoherence_alternate_score`, `azcoherence_coherence_check`,
`azcoherence_neutralize_hallucination`.

Stub tools (`history_rewrite`, `invent_citations`, `publish_as_truth`,
`mesh_enable`) refuse with `AZC-REFUSE`.

`/v1/fraggate/*` and `/v1/mesh/*` PROXY to aziel-runtime via the
`AZIEL_RUNTIME` service binding. GET `/v1/mesh` never enables.

## Dual surface

Agent MCP (`POST /mcp` + catalog FragGate) **and** the human Worker UI
**and** counted `/download`. Agent output stays in the AI client
(`display.title` / `display.summary`). Humans keep the complete Worker
UI, Flutter `mobile/`, and counted `/download`. Do not gut either
surface.

## Cross-map (do not merge)

- aziel-runtime FragGate: `/v1/fraggate/list`, `/v1/fraggate/describe`,
  `/v1/fraggate/call`, `/v1/software`, `/mcp`
- AZ-CLCE / `azclce` — peer scorer, separate product
- AKM-TRIAD-1.0 — fabric neighbor only (cite only)
- AZInterface — custodial operating environment
- Softwares hubs: azieleliab.com, azielcorpuslibrary.net, godlock.uk

Machine cites: `/cite.json`, `/llms.txt`.

Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude
(Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot /
Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence
surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other
MCP/OpenAPI-capable assistants.

Author: Aziel Eliab only.
