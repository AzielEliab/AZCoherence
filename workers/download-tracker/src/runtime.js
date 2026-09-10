/**
 * AZCoherence hosted runtime.
 * /v1 never touches DOWNLOADS KV.
 * Door paths (`/v1/fraggate/*`, `/v1/runtime/*`, `/v1/mesh/*`) PROXY to aziel-runtime via AZIEL_RUNTIME.
 * Local ops are single-segment `/v1/{op}` only.
 * Author: Aziel Eliab only.
 */
import { classifyV1Path, doorTargetUrl } from "./door.js";
import {
  LIVE_OPS,
  STUB_OPS,
  PRODUCT,
  SLUG,
  VERSION,
  SPEC,
  AUTHOR,
  MOTTO,
  ROLE,
  HONEST,
  RefuseError,
  health as engineHealth,
  doctor as engineDoctor,
  reviewTriad,
  alternateScore,
  coherenceCheck,
  neutralizeHallucination,
  verifyReceipt,
  refuseStub,
} from "./engine.js";
import { attachQnsCd, meshOpenApiPaths, meshPointer } from "./mesh.js";

const HOST = "https://azcoherence-download-tracker.vibelock.workers.dev";
const CATALOG = "https://aziel-runtime.vibelock.workers.dev/";
const CATALOG_MCP = "https://aziel-runtime.vibelock.workers.dev/mcp";
const FRAGGATE_CALL = "https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call";
const FRAGGATE_LIVE_OPS = LIVE_OPS.slice();
const FULL_CLIENTS =
  "Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants.";

export const SKILL = `---
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

AZ-CLCE (peer scorer, do not merge): \`https://github.com/AzielEliab/az-clce\` · Worker \`https://azclce-download-tracker.vibelock.workers.dev/\`

AKM-TRIAD-1.0 is LIVE fabric memory on aziel-runtime — cite as neighbor, not a Softwares slug. Do not merge.

AZInterface (custodial OE): \`https://github.com/AzielEliab/azinterface\` · Worker \`https://azinterface-download-tracker.vibelock.workers.dev/\`

FragGate kernel: \`https://github.com/AzielEliab/fraggate\`

## Cross-map (do not merge)

- **aziel-runtime FragGate** — THE single door. \`GET /v1/fraggate/list\`, \`GET /v1/fraggate/describe?slug=azcoherence\`, \`POST /v1/fraggate/call\` \`{slug:azcoherence,op,payload}\`, \`GET /v1/software\`, \`POST /mcp\`. Host: \`https://aziel-runtime.vibelock.workers.dev\`. This Worker \`/v1/fraggate/*\` PROXY via AZIEL_RUNTIME.
- **AZ-CLCE / azclce** — peer scorer, separate product. R/D/P inconsistency, not intent.
- **AKM-TRIAD-1.0** — fabric neighbor only. Posterior ≠ truth. Not a Softwares slug.
- **AZInterface** — custodial operating environment (page cycles / pair custody).
- **Softwares hubs** — https://www.azieleliab.com/ · https://www.azielcorpuslibrary.net/ · https://godlock.uk/
- **Dual surface** — agent MCP + human Worker UI + \`/download\`. Do not gut either surface.
- Machine cites: this Worker \`/cite.json\` and \`/llms.txt\`.

## How to call (Mozilla/5.0)

\`\`\`bash
curl -s -A 'Mozilla/5.0' https://azcoherence-download-tracker.vibelock.workers.dev/v1/health
curl -s -A 'Mozilla/5.0' -X POST https://azcoherence-download-tracker.vibelock.workers.dev/v1/review_triad \\
  -H 'content-type: application/json' \\
  -d '{"claim":"login succeeds","primary":{"score":0.91,"path":"primary","evidence":["operator cite A"]},"alternate":{"score":0.88,"path":"independent","evidence":["operator cite B"]}}'
curl -s -A 'Mozilla/5.0' https://azcoherence-download-tracker.vibelock.workers.dev/v1/skill
curl -s -A 'Mozilla/5.0' https://azcoherence-download-tracker.vibelock.workers.dev/v1/mesh
curl -s -A 'Mozilla/5.0' -X POST https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call \\
  -H 'content-type: application/json' \\
  -d '{"slug":"azcoherence","op":"health","payload":{}}'
\`\`\`

FragGate LIVE_OPS (slug \`azcoherence\`): health, skill, doctor, verify, review_triad, alternate_score, coherence_check, neutralize_hallucination.
UI labels match that catalog set: Review triad / Alternate score / Coherence check / Neutralize / Verify / Health / Skill / Doctor.

${FULL_CLIENTS} Import the catalog or Worker OpenAPI as a GPT Action, custom HTTP tool, or custom OpenAPI tool. MCP clients (Cursor, Glama, Claude, and others): \`POST\` this Worker \`/mcp\` (thin doubles of the human buttons) or the catalog MCP endpoint (FragGate slug azcoherence). This Worker \`/v1/fraggate/*\` and \`/v1/mesh/*\` PROXY to aziel-runtime via AZIEL_RUNTIME. Catalog MCP \`mesh_*\` + FragGate \`slug=mesh\`. Suite mesh default OFF. QNM-BUILD-1.0 live|locked|isolated. QNS-CD-1.0 photon QNS1 packet transfer is a hub cite / mesh cross-map only (local qnsd: https://github.com/AzielEliab/qnm-node ; runtime cites: https://github.com/AzielEliab/aziel-runtime). Not a Softwares-tab product. No Node Gate. No public qnsd proxy. No auto-heal. Not anonymity.

## Local (after one-click install)

\`\`\`bash
curl -fsSL https://azcoherence-download-tracker.vibelock.workers.dev/install.sh | bash
azcoherence ui
azcoherence doctor
\`\`\`

Then open http://127.0.0.1:8871 (this computer only).

## Honest banner

${HONEST}

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

${FULL_CLIENTS} Import catalog or Worker OpenAPI as a GPT Action, custom HTTP tool, or custom OpenAPI tool. MCP clients: \`POST https://azcoherence-download-tracker.vibelock.workers.dev/mcp\` or catalog \`POST https://aziel-runtime.vibelock.workers.dev/mcp\`. Suite mesh: \`GET /v1/mesh\` PROXY (default OFF). QNS-CD-1.0 hub cite only. Catalog MCP \`mesh_*\` + FragGate \`slug=mesh\`.

Counted download (gzip HTTP 200, no 302): https://azcoherence-download-tracker.vibelock.workers.dev/download?asset=azcoherence-0.1.0.tar.gz
GitHub: https://github.com/AzielEliab/AZCoherence
`;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, mcp-session-id, User-Agent, Authorization",
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() },
  });
}

function examplePayload() {
  return {
    claim: "login succeeds",
    primary: { score: 0.91, path: "primary", evidence: ["operator-provided cite A"] },
    alternate: { score: 0.88, path: "independent", evidence: ["operator-provided cite B"] },
    author: AUTHOR,
    spec: SPEC,
    note: "Sample only. Evidence must be operator-provided. Never invented.",
  };
}

function mcpInitialize() {
  return {
    protocolVersion: "2024-11-05",
    capabilities: { tools: {} },
    serverInfo: { name: "azcoherence", version: VERSION, title: "AZCoherence" },
    instructions: "AZCoherence is a coherence reviewer. FragGate is THE single door. Prefer catalog POST " + CATALOG_MCP + " slug=azcoherence. Confidence is not truth. Never invent evidence.",
  };
}

function mcpDocs() {
  return {
    product: PRODUCT,
    slug: SLUG,
    version: VERSION,
    author: AUTHOR,
    spec: SPEC,
    door: "fraggate",
    kv_increment: false,
    note: "GET /mcp documents the dual surface. POST /mcp is JSON-RPC. Does not increment downloads. Canonical catalog MCP: " + CATALOG_MCP + " (FragGate slug azcoherence).",
    catalog_mcp: CATALOG_MCP,
    agent_path: FRAGGATE_CALL,
    live_ops: FRAGGATE_LIVE_OPS,
    stub_ops: STUB_OPS.slice(),
    mesh: meshPointer(),
    clients: FULL_CLIENTS,
    honest: HONEST,
  };
}

const MCP_OPS = ["health", "skill", "doctor", "verify", "review_triad", "alternate_score", "coherence_check", "neutralize_hallucination", "example"];
const MCP_REFUSED = STUB_OPS.slice();

function mcpToolSchemas() {
  const claim = { type: "string" };
  const scoreObj = { type: "object", additionalProperties: true };
  return [
    { name: "azcoherence_health", description: "Liveness. Same as GET /v1/health. FragGate LIVE_OPS.", inputSchema: { type: "object", properties: {} } },
    { name: "azcoherence_skill", description: "Skill markdown. Same as GET /v1/skill. FragGate LIVE_OPS.", inputSchema: { type: "object", properties: {} } },
    { name: "azcoherence_doctor", description: "Self-check. Same as GET /v1/doctor. FragGate LIVE_OPS.", inputSchema: { type: "object", properties: {} } },
    { name: "azcoherence_verify", description: "Verify a receipt hash. Same as POST /v1/verify.", inputSchema: { type: "object", properties: { receipt: { type: "object" }, receipt_hash: { type: "string" } } } },
    { name: "azcoherence_review_triad", description: "Review primary triad vs alternate path. Same as POST /v1/review_triad.", inputSchema: { type: "object", properties: { claim, primary: scoreObj, alternate: scoreObj, primary_score: { type: "number" }, alternate_score: { type: "number" } } } },
    { name: "azcoherence_alternate_score", description: "Independent score from provided evidence only. Never invented.", inputSchema: { type: "object", properties: { claim, evidence: { type: "array", items: { type: "string" } } } } },
    { name: "azcoherence_coherence_check", description: "Compare two scores. Same as POST /v1/coherence_check.", inputSchema: { type: "object", properties: { claim, primary: scoreObj, alternate: scoreObj } } },
    { name: "azcoherence_neutralize_hallucination", description: "Advisory neutralize. Not publish-as-truth.", inputSchema: { type: "object", properties: { claim, primary: scoreObj, alternate: scoreObj } } },
    { name: "azcoherence_example", description: "Sample review payload. Same as GET /v1/example.", inputSchema: { type: "object", properties: {} } },
  ];
}

function resolveMcpOp(name) {
  if (typeof name !== "string" || !name) return null;
  const raw = name.trim();
  const stripped = raw.startsWith("azcoherence_") ? raw.slice("azcoherence_".length) : raw;
  if (MCP_OPS.includes(stripped)) return stripped;
  return null;
}

function refusedMcpOp(name) {
  if (typeof name !== "string" || !name) return null;
  const raw = name.trim();
  const stripped = raw.startsWith("azcoherence_") ? raw.slice("azcoherence_".length) : raw;
  return MCP_REFUSED.includes(stripped) ? stripped : null;
}

async function runMcpOp(op, body) {
  const payload = body && typeof body === "object" ? body : {};
  if (op === "health") return engineHealth(meshPointer());
  if (op === "skill") return { skill: SKILL };
  if (op === "doctor") return engineDoctor();
  if (op === "example") return examplePayload();
  if (op === "review_triad") return reviewTriad(payload);
  if (op === "alternate_score") return alternateScore(payload);
  if (op === "coherence_check") return coherenceCheck(payload);
  if (op === "neutralize_hallucination") return neutralizeHallucination(payload);
  if (op === "verify") return verifyReceipt(payload);
  throw new RefuseError("unknown op");
}

async function callMcpTool(name, args) {
  const refused = refusedMcpOp(name);
  if (refused) {
    const stub = refuseStub(refused);
    return {
      isError: true,
      content: [{ type: "text", text: JSON.stringify(stub, null, 2) }],
    };
  }
  const op = resolveMcpOp(name);
  if (!op) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: false,
          error: "Unknown MCP tool. Use azcoherence_health, azcoherence_skill, azcoherence_doctor, azcoherence_verify, azcoherence_review_triad, azcoherence_alternate_score, azcoherence_coherence_check, azcoherence_neutralize_hallucination. Stub verbs refuse AZC-REFUSE. Canonical catalog MCP: " + CATALOG_MCP + " slug=azcoherence.",
          door: "fraggate",
          slug: SLUG,
          agent_path: FRAGGATE_CALL,
        }, null, 2),
      }],
    };
  }
  try {
    if (op === "skill") return { content: [{ type: "text", text: SKILL }] };
    const data = await runMcpOp(op, args);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: JSON.stringify({ ok: false, error: String(err.message || err), motto: MOTTO }, null, 2) }],
    };
  }
}

async function handleMcpJson(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400);
  }
  const id = body && Object.prototype.hasOwnProperty.call(body, "id") ? body.id : null;
  const method = body && body.method;
  const params = (body && body.params) || {};
  if (method === "initialize") return json({ jsonrpc: "2.0", id, result: mcpInitialize() });
  if (method === "notifications/initialized" || method === "initialized") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (method === "ping") return json({ jsonrpc: "2.0", id, result: {} });
  if (method === "tools/list") return json({ jsonrpc: "2.0", id, result: { tools: mcpToolSchemas() } });
  if (method === "tools/call") {
    const name = params.name;
    const args = params.arguments && typeof params.arguments === "object" ? params.arguments : {};
    return json({ jsonrpc: "2.0", id, result: await callMcpTool(name, args) });
  }
  return json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Method not found. Use initialize, tools/list, tools/call." },
  });
}

async function handleMcp(request) {
  if (request.method === "GET" || request.method === "HEAD") {
    if (request.method === "HEAD") return new Response(null, { status: 200, headers: corsHeaders() });
    return json(mcpDocs());
  }
  if (request.method === "POST") return handleMcpJson(request);
  return json({ error: "method not allowed", hint: "GET or POST /mcp" }, 405);
}

function opPath(name) {
  return {
    post: {
      operationId: "azcoherence_" + name,
      summary: name.replace(/_/g, " "),
      tags: ["azcoherence"],
      requestBody: { content: { "application/json": { schema: { type: "object" } } } },
      responses: { "200": { description: "AZCoherence receipt" } },
    },
  };
}

function openapiSpec() {
  return {
    openapi: "3.0.3",
    info: {
      title: "AZCoherence",
      version: VERSION,
      description: HONEST + " " + FULL_CLIENTS + " FragGate slug azcoherence. Catalog MCP " + CATALOG_MCP + ".",
      contact: { name: AUTHOR, url: "https://github.com/AzielEliab/AZCoherence" },
      license: { name: "Apache-2.0", url: "https://www.apache.org/licenses/LICENSE-2.0" },
    },
    servers: [{ url: HOST, description: "AZCoherence Worker" }, { url: CATALOG.replace(/\/$/, ""), description: "aziel-runtime catalog" }],
    paths: {
      "/v1/health": { get: { operationId: "azcoherence_health", summary: "Liveness. Does not increment downloads.", tags: ["azcoherence"], responses: { "200": { description: "health" } } } },
      "/v1/skill": { get: { operationId: "azcoherence_skill", summary: "Skill markdown. Does not increment downloads.", tags: ["azcoherence"], responses: { "200": { description: "markdown" } } } },
      "/v1/doctor": { get: { operationId: "azcoherence_doctor", summary: "Doctor self-check. FragGate LIVE_OPS.", tags: ["azcoherence"], responses: { "200": { description: "doctor" } } } },
      "/v1/example": { get: { operationId: "azcoherence_example", summary: "Sample payload.", tags: ["azcoherence"], responses: { "200": { description: "example" } } } },
      "/v1/review_triad": opPath("review_triad"),
      "/v1/alternate_score": opPath("alternate_score"),
      "/v1/coherence_check": opPath("coherence_check"),
      "/v1/neutralize_hallucination": opPath("neutralize_hallucination"),
      "/v1/verify": opPath("verify"),
      "/v1/history_rewrite": opPath("history_rewrite"),
      "/v1/invent_citations": opPath("invent_citations"),
      "/v1/publish_as_truth": opPath("publish_as_truth"),
      "/v1/mesh_enable": opPath("mesh_enable"),
      "/v1/fraggate/list": { get: { operationId: "azcoherence_fraggate_list_proxy", summary: "PROXY to aziel-runtime GET /v1/fraggate/list via AZIEL_RUNTIME. Not a local op.", tags: ["fraggate"], responses: { "200": { description: "catalog" } } } },
      "/v1/fraggate/describe": { get: { operationId: "azcoherence_fraggate_describe_proxy", summary: "PROXY to aziel-runtime GET /v1/fraggate/describe. Not a local op.", tags: ["fraggate"], responses: { "200": { description: "describe" } } } },
      "/v1/fraggate/call": { post: { operationId: "azcoherence_fraggate_call_proxy", summary: "PROXY to aziel-runtime POST /v1/fraggate/call. Not a local op.", tags: ["fraggate"], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "call" } } } },
      ...meshOpenApiPaths(),
    },
  };
}

function aiHtml() {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>AZCoherence — AI assistants</title>
<meta name="author" content="Aziel Eliab">
<style>body{font:16px/1.5 system-ui;background:#0b0b0b;color:#e8e0d0;max-width:44rem;margin:0 auto;padding:2rem 1.2rem}a{color:#e6d19a}h2{color:#c9a227}</style>
</head><body>
<h1>AZCoherence</h1>
<p>Author: <strong>Aziel Eliab</strong> only. FragGate slug <code>azcoherence</code>.</p>
<h2>Use with AI assistants</h2>
<p>${FULL_CLIENTS}</p>
<h2>OpenAPI import</h2>
<p>Worker: <a href="/openapi.json">/openapi.json</a> · Catalog: <a href="https://aziel-runtime.vibelock.workers.dev/openapi.json">aziel-runtime OpenAPI</a></p>
<h2>MCP catalog</h2>
<p>This Worker <code>POST /mcp</code> or catalog <code>POST https://aziel-runtime.vibelock.workers.dev/mcp</code> (FragGate slug azcoherence). Agents prefer FragGate list → describe → call. Dual surface: do not gut the human UI.</p>
<p>${HONEST}</p>
</body></html>`;
}

function runtimeFetcher(env) {
  if (env && env.AZIEL_RUNTIME && typeof env.AZIEL_RUNTIME.fetch === "function") return env.AZIEL_RUNTIME;
  return null;
}

function isMeshCitePath(pathname) {
  const path = String(pathname || "").replace(/\/+$/, "") || "/";
  return path === "/v1/mesh" || path === "/v1/mesh/status" || path === "/v1/mesh/nodes";
}

async function decorateMeshCite(request, pathname, res, headers) {
  if (request.method === "HEAD" || request.method !== "GET") return null;
  if (!isMeshCitePath(pathname)) return null;
  const ctype = String(headers.get("content-type") || "").toLowerCase();
  if (!ctype.includes("json")) return null;
  try {
    const body = await res.clone().json();
    headers.delete("content-length");
    headers.set("X-Aziel-Qns-Cd", "QNS-CD-1.0");
    return new Response(JSON.stringify(attachQnsCd(body), null, 2), {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  } catch {
    return null;
  }
}

async function proxyDoor(request, url, env) {
  const dest = doorTargetUrl(url.pathname, request.url, env);
  if (!dest) return json({ ok: false, error: "not a door path", path: url.pathname, door: "fraggate" }, 404);
  const headers = new Headers();
  const pass = ["content-type", "accept", "authorization", "user-agent", "mcp-protocol-version", "mcp-session-id", "x-aziel-runtime-token"];
  for (const name of pass) {
    const v = request.headers.get(name);
    if (v) headers.set(name, v);
  }
  if (!headers.has("User-Agent")) headers.set("User-Agent", "Mozilla/5.0 AZCoherence/0.1.0");
  const init = { method: request.method, headers, redirect: "follow" };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }
  try {
    const fetcher = runtimeFetcher(env);
    const res = fetcher ? await fetcher.fetch(dest, init) : await fetch(dest, init);
    const outHeaders = new Headers(res.headers);
    for (const [k, v] of Object.entries(corsHeaders())) outHeaders.set(k, v);
    outHeaders.set("X-Aziel-Door", "proxy");
    outHeaders.set("X-Aziel-Door-Origin", dest);
    const decorated = await decorateMeshCite(request, url.pathname, res, outHeaders);
    if (decorated) return decorated;
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: outHeaders });
  } catch (exc) {
    return json({
      ok: false,
      error: "fraggate_proxy_failed",
      detail: String(exc).slice(0, 240),
      origin: dest,
      agent_path: FRAGGATE_CALL,
      door: "fraggate",
      slug: SLUG,
    }, 502);
  }
}

export async function handleRuntimeApi(request, url, env) {
  const stripped = url.pathname.replace(/\/+$/, "") || "/";
  if (stripped === "/mcp") {
    try {
      return await handleMcp(request);
    } catch (err) {
      return json({ error: String(err.message || err), motto: MOTTO, ok: false }, 400);
    }
  }
  const classified = classifyV1Path(url.pathname);
  if (classified.kind === "door") return proxyDoor(request, url, env);
  const path = url.pathname;
  const isApi = path === "/v1" || path.startsWith("/v1/") || path === "/openapi.json" || path === "/ai";
  if (!isApi) return null;
  if (classified.kind === "multi") {
    return json({
      ok: false,
      error: "not a local op",
      code: "NOT_LOCAL_OP",
      path: classified.path,
      hint: "Local ops are GET|POST /v1/{op} only (single segment). FragGate door is /v1/fraggate/list, /v1/fraggate/describe, /v1/fraggate/call (proxied to aziel-runtime via AZIEL_RUNTIME). Suite mesh is /v1/mesh/* (proxied to aziel-runtime; default OFF). Product-local mesh_enable is stub/REFUSE.",
      agent_path: FRAGGATE_CALL,
      live_ops: FRAGGATE_LIVE_OPS,
    }, 404);
  }
  try {
    if (path === "/v1/health" && request.method === "GET") return json(engineHealth(meshPointer()));
    if (path === "/v1/skill" && request.method === "GET") {
      return new Response(SKILL, { status: 200, headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "private, no-store", ...corsHeaders() } });
    }
    if (path === "/openapi.json" && request.method === "GET") return json(openapiSpec());
    if (path === "/ai" && request.method === "GET") {
      return new Response(aiHtml(), { headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders() } });
    }
    if (path === "/v1/doctor" && request.method === "GET") return json(engineDoctor());
    if (path === "/v1/example" && request.method === "GET") return json(examplePayload());
    async function readBody() {
      try { return await request.json(); } catch { return {}; }
    }
    const localOp = classified.kind === "local" ? classified.op : null;
    if (localOp && STUB_OPS.includes(localOp) && request.method === "POST") return json(refuseStub(localOp));
    if (path === "/v1/review_triad" && request.method === "POST") return json(await reviewTriad(await readBody()));
    if (path === "/v1/alternate_score" && request.method === "POST") return json(await alternateScore(await readBody()));
    if (path === "/v1/coherence_check" && request.method === "POST") return json(await coherenceCheck(await readBody()));
    if (path === "/v1/neutralize_hallucination" && request.method === "POST") return json(await neutralizeHallucination(await readBody()));
    if (path === "/v1/verify" && request.method === "POST") return json(await verifyReceipt(await readBody()));
    return json({ error: "not found", hint: "GET /v1/health GET /v1/skill GET /v1/doctor POST /v1/{review_triad,alternate_score,coherence_check,neutralize_hallucination,verify} GET /v1/fraggate/list GET /v1/fraggate/describe POST /v1/fraggate/call GET /v1/mesh", live_ops: FRAGGATE_LIVE_OPS }, 404);
  } catch (err) {
    return json({ error: String(err.message || err), motto: MOTTO, ok: false }, 400);
  }
}
