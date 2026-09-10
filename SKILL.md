---
name: AZCoherence
description: Use when double-checking an alternate triad score against a primary claim+score to prevent / neutralize / eliminate AI hallucination in scoring (AZC-WP-0.1). Receipts PASS / FLAG / NEUTRALIZE / REFUSE. Never invent evidence. Confidence is not truth. Dual surface: Worker /v1 + POST /mcp, or aziel-runtime FragGate slug azcoherence. This Worker /v1/fraggate/* and /v1/mesh/* PROXY to aziel-runtime via AZIEL_RUNTIME. Suite mesh default OFF. GET /v1/mesh never enables. Product-local mesh_enable is stub/REFUSE. QNM-BUILD-1.0 live|locked|isolated. QNS-CD-1.0 photon QNS1 hub cite (local qnsd in qnm-node). Not a Softwares-tab product. No Node Gate. No public qnsd proxy. No auto-heal. Not anonymity. Does not merge AZ-CLCE or AKM-TRIAD-1.0. Author Aziel Eliab.
---

# AZCoherence

Coherence reviewer — primary triad/claim+score versus an alternate independent path.

Author: **Aziel Eliab**.

Use when an AI score needs a second, independent check. AZCoherence does
not invent evidence. Confidence is not truth. Receipts are PASS / FLAG /
NEUTRALIZE / REFUSE. History rewrite, invent citations, publish-as-truth,
and mesh enable are stub and refuse.

Always send \`User-Agent: Mozilla/5.0\`. Cloudflare Workers may 403 an empty agent.

## Endpoints (this Worker)

Host: \`https://azcoherence-download-tracker.vibelock.workers.dev\`

| Method | Path | What |
|--------|------|------|
| GET | \`/v1/health\` | Liveness. FragGate LIVE_OPS. Does not increment downloads. |
| GET | \`/v1/skill\` | This markdown. FragGate LIVE_OPS. Does not increment downloads. |
| GET | \`/v1/example\` | Sample review payload. Worker-local. Does not increment downloads. |
| GET | \`/v1/doctor\` | Self-check (no writes). FragGate LIVE_OPS. |
| GET | \`/v1/fraggate/list\` | PROXY to aziel-runtime GET /v1/fraggate/list via AZIEL_RUNTIME. Not a local op. |
| GET | \`/v1/fraggate/describe\` | PROXY to aziel-runtime GET /v1/fraggate/describe (\`?name=\` / \`?slug=\`). Not a local op. |
| POST | \`/v1/fraggate/call\` | PROXY to aziel-runtime POST /v1/fraggate/call. Not a local op. |
| GET | \`/v1/mesh\` | PROXY suite mesh status. Default OFF. QNM live\\|locked\\|isolated. QNS-CD-1.0 hub cite. Never enables. |
| GET | \`/v1/mesh/nodes\` | PROXY Live Nodes roster (5-minute presence) + QNS-CD-1.0 cross-map. |
| POST | \`/v1/mesh/{enable,disable,join,heartbeat,leave,broadcast}\` | PROXY. Bearer required to enable. Product-local \`mesh_enable\` is stub/REFUSE. No auto-heal. Anon-broadcast is not a publish path. |
| POST | \`/v1/review_triad\` | Review primary triad vs alternate path. FragGate LIVE_OPS. |
| POST | \`/v1/alternate_score\` | Independent score from provided evidence only. Never invented. FragGate LIVE_OPS. |
| POST | \`/v1/coherence_check\` | Compare two scores. FragGate LIVE_OPS. |
| POST | \`/v1/neutralize_hallucination\` | Advisory neutralize. Not publish-as-truth. FragGate LIVE_OPS. |
| POST | \`/v1/verify\` | Hash-walk a receipt. FragGate LIVE_OPS. |
| POST | \`/v1/history_rewrite\` | Stub. REFUSE. |
| POST | \`/v1/invent_citations\` | Stub. REFUSE. |
| POST | \`/v1/publish_as_truth\` | Stub. REFUSE. |
| POST | \`/v1/mesh_enable\` | Stub. REFUSE. GET /v1/mesh never enables. |
| GET | \`/mcp\` | Dual-surface MCP docs + FragGate pointer. Does not increment downloads. |
| POST | \`/mcp\` | JSON-RPC MCP-over-HTTP. Thin doubles of catalog labels. |

OpenAPI: \`https://azcoherence-download-tracker.vibelock.workers.dev/openapi.json\`

Catalog OpenAPI: \`https://aziel-runtime.vibelock.workers.dev/openapi.json\`

This Worker MCP: \`POST https://azcoherence-download-tracker.vibelock.workers.dev/mcp\`

Catalog MCP: \`POST https://aziel-runtime.vibelock.workers.dev/mcp\` (FragGate slug \`azcoherence\`)

Catalog aliases under \`/p/azcoherence/…\` when listed.

AZ-CLCE (peer, do not merge): \`https://github.com/AzielEliab/az-clce\`

AKM-TRIAD-1.0 is LIVE fabric memory on aziel-runtime — not a Softwares slug.

FragGate kernel: \`https://github.com/AzielEliab/fraggate\`

## How to call (Mozilla/5.0)

\`\`\`bash
curl -s -A 'Mozilla/5.0' https://azcoherence-download-tracker.vibelock.workers.dev/v1/health
curl -s -A 'Mozilla/5.0' -X POST https://azcoherence-download-tracker.vibelock.workers.dev/v1/review_triad \\
  -H 'content-type: application/json' \\
  -d '{"claim":"login succeeds","primary":{"score":0.91,"path":"primary","evidence":["operator cite A"]},"alternate":{"score":0.88,"path":"independent","evidence":["operator cite B"]}}'
curl -s -A 'Mozilla/5.0' https://azcoherence-download-tracker.vibelock.workers.dev/v1/skill
curl -s -A 'Mozilla/5.0' https://azcoherence-download-tracker.vibelock.workers.dev/v1/mesh
\`\`\`

FragGate LIVE_OPS (slug \`azcoherence\`): health, skill, doctor, verify, review_triad, alternate_score, coherence_check, neutralize_hallucination.
UI labels match that catalog set: Review triad / Alternate score / Coherence check / Neutralize / Verify / Health / Skill / Doctor.

Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants. Import the catalog or Worker OpenAPI as a GPT Action, custom HTTP tool, or custom OpenAPI tool. MCP clients (Cursor, Glama, Claude, and others): \`POST\` this Worker \`/mcp\` (thin doubles of the human buttons) or the catalog MCP endpoint (FragGate slug azcoherence). This Worker \`/v1/fraggate/*\` and \`/v1/mesh/*\` PROXY to aziel-runtime via AZIEL_RUNTIME. Catalog MCP \`mesh_*\` + FragGate \`slug=mesh\`. Suite mesh default OFF. QNM-BUILD-1.0 live|locked|isolated. QNS-CD-1.0 photon QNS1 packet transfer is a hub cite / mesh cross-map only (local qnsd: https://github.com/AzielEliab/qnm-node ; runtime cites: https://github.com/AzielEliab/aziel-runtime). Not a Softwares-tab product. No Node Gate. No public qnsd proxy. No auto-heal. Not anonymity.

## Local (after one-click install)

\`\`\`bash
curl -fsSL https://azcoherence-download-tracker.vibelock.workers.dev/install.sh | bash
azcoherence ui
azcoherence doctor
\`\`\`

Then open http://127.0.0.1:8871 (this computer only).

## Honest banner

THIS IS: an advisory coherence reviewer (AZC-WP-0.1). Primary triad/claim+score versus an alternate independent path. Receipts are PASS / FLAG / NEUTRALIZE / REFUSE. THIS IS NOT: AZ-CLCE (R/D/P inconsistency, not intent), not AKM-TRIAD-1.0 fabric memory, not a truth verdict, not a citation inventor, not a history rewrite, not publish-as-truth. Confidence is not truth. Never invent evidence. Author Aziel Eliab only.

Cite the GitHub repository and this Worker. No Zenodo DOI is invented here; a software deposit is still needed.

Apache-2.0 (or the repo LICENSE). Forks are welcome and always allowed.

## Catalog + local UI

Author: **Aziel Eliab**. Honest scope: coherence review, not truth.

- Product homepage (workspace + counted download): https://azcoherence-download-tracker.vibelock.workers.dev/
- Catalog product (when listed): https://aziel-runtime.vibelock.workers.dev/p/azcoherence/
- Catalog OpenAPI: https://aziel-runtime.vibelock.workers.dev/openapi.json
- Catalog MCP: \`POST https://aziel-runtime.vibelock.workers.dev/mcp\`
- This Worker MCP (dual surface): \`POST https://azcoherence-download-tracker.vibelock.workers.dev/mcp\`
- This Worker skill: \`GET https://azcoherence-download-tracker.vibelock.workers.dev/v1/skill\`
- This Worker OpenAPI: https://azcoherence-download-tracker.vibelock.workers.dev/openapi.json
- Sample payload: \`GET https://azcoherence-download-tracker.vibelock.workers.dev/v1/example\`

Local UI labels match catalog: Review triad / Alternate score / Coherence check / Neutralize / Verify / Health / Skill / Doctor. Worker homepage Live Nodes strip polls \`GET /v1/mesh\` (default OFF) and shows the QNS-CD-1.0 cross-map.

Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants. Import catalog or Worker OpenAPI as a GPT Action, custom HTTP tool, or custom OpenAPI tool. MCP clients: \`POST https://azcoherence-download-tracker.vibelock.workers.dev/mcp\` or catalog \`POST https://aziel-runtime.vibelock.workers.dev/mcp\`. Suite mesh: \`GET /v1/mesh\` PROXY (default OFF). QNS-CD-1.0 hub cite only. Catalog MCP \`mesh_*\` + FragGate \`slug=mesh\`.

Counted download (gzip HTTP 200, no 302): https://azcoherence-download-tracker.vibelock.workers.dev/download?asset=azcoherence-0.1.0.tar.gz
GitHub: https://github.com/AzielEliab/AZCoherence
