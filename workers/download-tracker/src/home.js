/**
 * AZCoherence product homepage — software UI, not a downloads shell.
 * Author: Aziel Eliab only. Apache-2.0. Forks welcome.
 * No Zenodo DOI is invented here.
 */

const HOST = "https://azcoherence-download-tracker.vibelock.workers.dev";
const GITHUB_REPO = "https://github.com/AzielEliab/AZCoherence";
const GITHUB_LATEST = "https://github.com/AzielEliab/AZCoherence/releases/latest";
const CATALOG = "https://aziel-runtime.vibelock.workers.dev/";
const CATALOG_PRODUCT = "https://aziel-runtime.vibelock.workers.dev/p/azcoherence/";
const FRAGGATE_LIST = "https://aziel-runtime.vibelock.workers.dev/v1/fraggate/list";
const FRAGGATE_DESCRIBE = "https://aziel-runtime.vibelock.workers.dev/v1/fraggate/describe?slug=azcoherence";
const FRAGGATE_CALL = "https://aziel-runtime.vibelock.workers.dev/v1/fraggate/call";
const SOFTWARE_TAB = "https://aziel-runtime.vibelock.workers.dev/v1/software";
const AZCLCE_HOST = "https://azclce-download-tracker.vibelock.workers.dev";
const AZINTERFACE_HOST = "https://azinterface-download-tracker.vibelock.workers.dev";
const DECISIONGATE_HOST = "https://decisiongate-download-tracker.vibelock.workers.dev";
const HUB_AZIELELIAB = "https://www.azieleliab.com/";
const HUB_LIBRARY = "https://www.azielcorpuslibrary.net/";
const HUB_GODLOCK = "https://godlock.uk/";
const LICENSE = "https://www.apache.org/licenses/LICENSE-2.0";
const FULL_CLIENTS = [
  "ChatGPT (GPT Actions / OpenAI)",
  "Grok (xAI)",
  "Venice",
  "Claude (Anthropic)",
  "Cursor (MCP)",
  "Glama (MCP)",
  "Perplexity",
  "Microsoft Copilot / Bing",
  "Google Gemini / Vertex",
  "Mistral",
  "Meta AI",
  "Apple Intelligence surfaces",
  "Amazon Q tooling",
  "DuckAssist",
  "You.com",
  "Cohere",
  "other MCP/OpenAPI-capable assistants",
];
const VERSION = "0.1.0";
const AUTHOR = "Aziel Eliab";
const TITLE = "AZCoherence — Aziel Eliab";
const DEFAULT_ASSET = "azcoherence-0.1.0.tar.gz";
const INSTALL_LINE = "curl -fsSL https://azcoherence-download-tracker.vibelock.workers.dev/install.sh | bash";
const DESCRIPTION =
  "AZCoherence is Aziel Eliab software: alternate-triad double-check to neutralize AI hallucination in scores (AZC-WP-0.1). Confidence is not truth. Never invent evidence. Apache-2.0.";
const HONEST =
  "THIS IS: an advisory coherence reviewer (AZC-WP-0.1). Primary triad/claim+score versus an alternate independent path. Receipts are PASS / FLAG / NEUTRALIZE / REFUSE. THIS IS NOT: AZ-CLCE (R/D/P inconsistency, not intent), not AKM-TRIAD-1.0 fabric memory, not a truth verdict, not a citation inventor, not a history rewrite, not publish-as-truth. Confidence is not truth. Never invent evidence. Author Aziel Eliab only.";
const HOW_TO_CITE =
  "Eliab, Aziel. (2026). AZCoherence 0.1.0 [Software]. Apache-2.0. https://github.com/AzielEliab/AZCoherence · https://azcoherence-download-tracker.vibelock.workers.dev/";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, mcp-session-id, User-Agent, Authorization",
  };
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function citePayload() {
  return {
    author: AUTHOR,
    title: "AZCoherence",
    version: VERSION,
    spec: "AZC-WP-0.1",
    class: "Plain",
    slug: "azcoherence",
    placement: "scoring-review",
    door: "fraggate",
    homepage: HOST + "/",
    github: GITHUB_REPO,
    download: HOST + "/download",
    install: HOST + "/install.sh",
    openapi: HOST + "/openapi.json",
    skill: HOST + "/v1/skill",
    mcp: HOST + "/mcp",
    catalog_mcp: CATALOG + "mcp",
    catalog: CATALOG,
    catalog_product: CATALOG_PRODUCT,
    license: "Apache-2.0",
    license_url: LICENSE,
    one_line: DESCRIPTION,
    how_to_cite: HOW_TO_CITE,
    apa: "Eliab, A. (2026). AZCoherence (Version 0.1.0) [Computer software]. https://azcoherence-download-tracker.vibelock.workers.dev/",
    bibtex:
      "@software{eliab_azcoherence_2026, author = {Eliab, Aziel}, title = {AZCoherence}, version = {0.1.0}, year = {2026}, license = {Apache-2.0}, url = {https://azcoherence-download-tracker.vibelock.workers.dev/}, publisher = {GitHub}, howpublished = {\\url{https://github.com/AzielEliab/AZCoherence}}}",
    zenodo_status: "placeholder_no_doi_invented",
    software_deposit_needed: true,
    note: "No DOI is invented here. Cite GitHub and this Worker. Identity is Aziel Eliab only. Forks welcome. Peer of AZ-CLCE (azclce), not merged. Not AKM-TRIAD. FragGate is THE single door.",
    identity: "Aziel Eliab only",
    forks: "welcome and always allowed",
    dual_surface: {
      agent_mcp: HOST + "/mcp",
      catalog_mcp: CATALOG + "mcp",
      catalog_fraggate_call: FRAGGATE_CALL,
      catalog_fraggate_list: FRAGGATE_LIST,
      catalog_software: SOFTWARE_TAB,
      human_worker_ui: HOST + "/",
      download: HOST + "/download",
      law: "Agent MCP + human Worker UI + /download. FragGate is THE single door. Do not gut either surface.",
    },
    fraggate: {
      kernel: "https://github.com/AzielEliab/fraggate",
      runtime: "https://github.com/AzielEliab/aziel-runtime",
      list: FRAGGATE_LIST,
      describe: FRAGGATE_DESCRIBE,
      call: FRAGGATE_CALL,
      software: SOFTWARE_TAB,
      mcp: CATALOG + "mcp",
      worker_proxy: {
        list: HOST + "/v1/fraggate/list",
        describe: HOST + "/v1/fraggate/describe",
        call: HOST + "/v1/fraggate/call",
      },
      slug: "azcoherence",
      note: "FragGate is THE single door. Worker /v1/fraggate/* PROXY via AZIEL_RUNTIME.",
    },
    peers: {
      aziel_runtime: {
        role: "catalog + FragGate door",
        github: "https://github.com/AzielEliab/aziel-runtime",
        homepage: CATALOG,
        paths: ["/v1/fraggate/list", "/v1/fraggate/describe", "/v1/fraggate/call", "/v1/software", "/mcp"],
        merge: false,
      },
      azclce: {
        role: "peer scorer — separate product",
        slug: "azclce",
        name: "AZ-CLCE",
        github: "https://github.com/AzielEliab/az-clce",
        homepage: AZCLCE_HOST + "/",
        note: "R/D/P inconsistency, not intent. Peer of AZCoherence. Do not merge.",
        merge: false,
      },
      akm_triad: {
        role: "fabric neighbor — cite only",
        spec: "AKM-TRIAD-1.0",
        note: "LIVE fabric memory on aziel-runtime. Not a Softwares slug. Posterior ≠ truth. Do not merge.",
        merge: false,
        software_tab: false,
      },
      azinterface: {
        role: "custodial operating environment",
        slug: "azinterface",
        name: "AZInterface",
        github: "https://github.com/AzielEliab/azinterface",
        homepage: AZINTERFACE_HOST + "/",
        note: "Custodial OE / page cycles. Pair custody. Not a merge.",
        merge: false,
      },
      hubs: {
        azieleliab: HUB_AZIELELIAB,
        azielcorpuslibrary: HUB_LIBRARY,
        godlock: HUB_GODLOCK,
      },
    },
    clients: FULL_CLIENTS.slice(),
  };
}

export function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AZCoherence",
    alternateName: TITLE,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS, Windows, Cloudflare Workers",
    softwareVersion: VERSION,
    author: { "@type": "Person", name: AUTHOR, url: "https://github.com/AzielEliab" },
    creator: { "@type": "Person", name: AUTHOR, url: "https://github.com/AzielEliab" },
    codeRepository: GITHUB_REPO,
    downloadUrl: HOST + "/download",
    installUrl: HOST + "/install.sh",
    license: LICENSE,
    url: HOST + "/",
    description: DESCRIPTION,
    keywords: "AZCoherence, triad, hallucination, coherence, Aziel Eliab, AZC-WP-0.1, Aziel Elroi Eliab",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    sameAs: [GITHUB_REPO, CATALOG_PRODUCT, AZCLCE_HOST + "/", AZINTERFACE_HOST + "/", HUB_AZIELELIAB, HUB_LIBRARY, HUB_GODLOCK],
  };
}

function sitemapXml() {
  const paths = ["/", "/download", "/install.sh", "/v1/skill", "/v1/example", "/v1/health", "/v1/doctor", "/v1/fraggate/list", "/v1/mesh", "/openapi.json", "/mcp", "/cite.json", "/llms.txt", "/ai"];
  const urls = paths.map((p) => `  <url><loc>${HOST}${p === "/" ? "/" : p}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
  <url><loc>${GITHUB_REPO}</loc></url>
</urlset>
`;
}

function robotsTxt() {
  return `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Diffbot
Allow: /

User-agent: Omgilibot
Allow: /

User-agent: Amazonbot
Allow: /

Sitemap: ${HOST}/sitemap.xml
`;
}

function llmsTxt() {
  return `# AZCoherence

Author: Aziel Eliab only
Identity: Aziel Eliab only
One-line: ${DESCRIPTION}
Spec: AZC-WP-0.1 / AZC-0.1
Class: Plain
Slug: azcoherence
Placement: scoring-review (Softwares tab placement, not a domain door)
Door: FragGate is THE single door
GitHub: ${GITHUB_REPO}
Homepage: ${HOST}/
Download: ${HOST}/download
Install: ${HOST}/install.sh
OpenAPI: ${HOST}/openapi.json
Skill: ${HOST}/v1/skill
Cite: ${HOST}/cite.json

## Dual surface (do not gut either)

Agent MCP: POST ${HOST}/mcp
Catalog MCP: POST ${CATALOG}mcp (FragGate slug azcoherence)
Human Worker UI: ${HOST}/
Counted download: ${HOST}/download
Law: agent MCP + human Worker UI + /download. FragGate is THE single door.

## aziel-runtime FragGate (catalog door)

Kernel: https://github.com/AzielEliab/fraggate
Runtime: https://github.com/AzielEliab/aziel-runtime
GET ${FRAGGATE_LIST}
GET ${FRAGGATE_DESCRIBE}
POST ${FRAGGATE_CALL}  { "slug": "azcoherence", "op": "<LIVE_OP>", "payload": {} }
GET ${SOFTWARE_TAB}
POST ${CATALOG}mcp
Worker PROXY: GET|POST ${HOST}/v1/fraggate/{list,describe,call}

## Peers (do not merge)

AZ-CLCE / azclce — peer scorer, separate product. R/D/P inconsistency, not intent.
  https://github.com/AzielEliab/az-clce
  ${AZCLCE_HOST}/
AKM-TRIAD-1.0 — fabric neighbor only. LIVE memory on aziel-runtime. Not a Softwares slug. Posterior ≠ truth. Do not merge.
AZInterface — custodial operating environment (AIH page cycles / pair custody).
  https://github.com/AzielEliab/azinterface
  ${AZINTERFACE_HOST}/

## Softwares hubs

${HUB_AZIELELIAB}
${HUB_LIBRARY}
${HUB_GODLOCK}

## Ops

POST /v1/review_triad, POST /v1/alternate_score, POST /v1/coherence_check, POST /v1/neutralize_hallucination, POST /v1/verify, GET /v1/health, GET /v1/skill, GET /v1/doctor
FragGate proxy: GET /v1/fraggate/list, GET /v1/fraggate/describe, POST /v1/fraggate/call (via AZIEL_RUNTIME)
Suite mesh: GET ${HOST}/v1/mesh PROXY to aziel-runtime. Default OFF. GET never enables. Product-local mesh_enable is stub/REFUSE. QNM-BUILD-1.0 live|locked|isolated. No Node Gate. No auto-heal. Not anonymity. Catalog MCP mesh_* + FragGate slug=mesh.
Catalog LIVE_OPS: health, skill, doctor, verify, review_triad, alternate_score, coherence_check, neutralize_hallucination
MCP tools: azcoherence_health, azcoherence_skill, azcoherence_doctor, azcoherence_verify, azcoherence_review_triad

## AI clients (full set — never the short triad only)

Works with ${FULL_CLIENTS.join(", ")}.
Law: Confidence is not truth. Never invent evidence. Peer of AZ-CLCE, not merged. Not AKM-TRIAD.
License: Apache-2.0
Forks: welcome and always allowed
DOI: none invented; software deposit still needed.

Indexing, metadata scrape, and AI grounding of public pages are allowed.
`;
}

export function handleSeoRoutes(request, url) {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const headers = { ...corsHeaders(), "Cache-Control": "private, no-store" };
  if (url.pathname === "/cite.json") {
    return new Response(JSON.stringify(citePayload(), null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
    });
  }
  if (url.pathname === "/sitemap.xml") {
    return new Response(sitemapXml(), { status: 200, headers: { "Content-Type": "application/xml; charset=utf-8", ...headers } });
  }
  if (url.pathname === "/robots.txt") {
    return new Response(robotsTxt(), { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8", ...headers } });
  }
  if (url.pathname === "/llms.txt" || url.pathname === "/ai.txt") {
    return new Response(llmsTxt(), { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8", ...headers } });
  }
  return null;
}

function breakdownList(stats) {
  const rows = stats.breakdown || [];
  if (!rows.length) return "<li>none yet</li>";
  return rows
    .map((b) => `<li><code>${escapeHtml(b.owner)}/${escapeHtml(b.repo)}</code> branch <code>${escapeHtml(b.branch)}</code> fork=${escapeHtml(b.fork)} → ${escapeHtml(b.count)}</li>`)
    .join("");
}

export function renderHome(stats) {
  const views = Number(stats.views) || 0;
  const downloads = Number(stats.downloads != null ? stats.downloads : stats.total) || 0;
  const v = views.toLocaleString("en-US");
  const n = downloads.toLocaleString("en-US");
  const gh = stats.github || {};
  const ld = JSON.stringify(jsonLd());
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<meta name="description" content="${escapeHtml(DESCRIPTION)}">
<meta name="author" content="${AUTHOR}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${HOST}/">
<link rel="sitemap" type="application/xml" href="${HOST}/sitemap.xml">
<link rel="icon" type="image/png" href="/sigil.png">
<meta property="og:type" content="website">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${escapeHtml(DESCRIPTION)}">
<meta property="og:url" content="${HOST}/">
<meta property="og:site_name" content="Aziel Eliab">
<meta property="og:image" content="${HOST}/sigil.png">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${TITLE}">
<meta name="twitter:description" content="${escapeHtml(DESCRIPTION)}">
<meta name="twitter:image" content="${HOST}/sigil.png">
<script type="application/ld+json">${ld}</script>
<style>
  :root {
    color-scheme: dark;
    --bg: #0b0b0b; --panel: #141414; --ink: #e8e0d0; --muted: #9aa3b2;
    --line: #2a2414; --gold: #c9a227; --gold-dim: #c9a227; --pass: #3dba7a; --bad: #d4534b; --focus: #e6d19a;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--bg); color: var(--ink); }
  body { font: 16px/1.5 system-ui, "Segoe UI", sans-serif; }
  a { color: #e6d19a; }
  code, pre, .mono { font-family: ui-monospace, Menlo, Consolas, monospace; }
  .wrap { max-width: 58rem; margin: 0 auto; padding: 1.4rem 1.2rem 4.5rem; }
  .brandrow { display: flex; align-items: center; gap: 12px; margin: 0 0 12px; }
  .brandmark { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; flex: 0 0 auto; box-shadow: 0 0 0 1px #d4af3733; }
  .stamp { margin: 0; color: var(--gold); font-size: .88rem; letter-spacing: .02em; }
  .appbar { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
  h1 { font-size: 2rem; letter-spacing: .02em; margin: 0 0 .2rem; }
  .motto { color: var(--gold); font-style: italic; margin: 0 0 .7rem; }
  .lede { color: var(--muted); margin: 0 0 1rem; max-width: 46rem; }
  .pill { font: 650 .78rem/1 ui-monospace, Menlo, Consolas, monospace; letter-spacing: .06em; text-transform: uppercase; border: 1px solid var(--line); border-radius: 999px; padding: .4rem .7rem; color: var(--muted); background: #101010; }
  .pill.ok { color: var(--pass); border-color: #2f6b48; }
  .pill.bad { color: var(--bad); border-color: #7a2f2c; }
  nav.toc { display: flex; flex-wrap: wrap; gap: .55rem; margin: 0 0 1.1rem; }
  nav.toc a { text-decoration: none; color: var(--ink); border: 1px solid var(--line); background: var(--panel); border-radius: 999px; padding: .35rem .75rem; font-size: .88rem; }
  .banner { border: 1px solid #5c4a1a; background: #241c0d; color: #f0d78c; padding: .9rem 1rem; border-radius: 10px; margin: 0 0 1.15rem; font-size: .94rem; }
  .card, .workspace, .cite { border: 1px solid var(--line); border-radius: 14px; padding: 1.15rem 1.2rem 1.25rem; background: var(--panel); margin: 0 0 1.1rem; }
  .workspace { box-shadow: 0 0 0 1px #d4af3714, 0 16px 40px #0006; }
  h2 { font-size: 1.12rem; margin: 0 0 .45rem; letter-spacing: .04em; }
  .kicker { display: block; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: var(--gold); margin-bottom: .15rem; font-family: ui-monospace, Menlo, Consolas, monospace; }
  .workgrid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 1rem; }
  @media (max-width: 820px) { .workgrid { grid-template-columns: 1fr; } }
  label { display: block; font-size: .92rem; margin: .75rem 0 .28rem; }
  input[type="text"], input[type="number"], textarea { width: 100%; padding: .58rem .7rem; border: 1px solid var(--line); border-radius: 8px; background: #0e0e0e; color: var(--ink); font: inherit; }
  input:focus, textarea:focus { outline: 2px solid var(--focus); outline-offset: 1px; }
  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; }
  @media (max-width: 520px) { .row2 { grid-template-columns: 1fr; } }
  .actions { display: flex; flex-wrap: wrap; gap: .5rem; margin: .95rem 0 .2rem; }
  button, a.btn { font: 700 .88rem/1.1 ui-monospace, Menlo, Consolas, monospace; letter-spacing: .03em; padding: .72rem .9rem; border-radius: 9px; border: 1px solid transparent; cursor: pointer; text-decoration: none; display: inline-block; }
  button.gold, a.btn.gold { background: var(--gold-dim); color: #14110a; }
  button.ink, a.btn.ink { background: var(--ink); color: var(--bg); }
  button.ghost, a.btn.ghost { background: transparent; color: var(--ink); border-color: var(--line); }
  button.copied { background: var(--pass); color: #0e1014; }
  .status { margin: 0 0 .8rem; padding: .75rem .85rem; border-radius: 10px; border: 1px solid var(--line); background: #101010; color: var(--muted); }
  .status.ok { color: var(--pass); border-color: #2f6b48; }
  .status.bad { color: var(--bad); border-color: #7a2f2c; }
  .metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .55rem; margin: 0 0 .85rem; }
  @media (max-width: 720px) { .metrics { grid-template-columns: 1fr 1fr; } }
  .metric { border: 1px solid var(--line); border-radius: 10px; padding: .55rem .65rem; background: #101010; }
  .metric b { display: block; font-size: .72rem; color: var(--muted); font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
  .metric span { display: block; font-size: .78rem; word-break: break-all; color: var(--ink); }
  .nums { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; margin: 0 0 1rem; }
  .count { font-size: 2.1rem; font-variant-numeric: tabular-nums; font-weight: 700; margin: 0; }
  .count span { display: block; font-size: .92rem; font-weight: 500; color: var(--muted); }
  .btns { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin: 0 0 .85rem; }
  @media (max-width: 520px) { .btns { grid-template-columns: 1fr; } }
  a.btn.block, button.btn.block { display: block; width: 100%; text-align: center; font-size: 1.15rem; padding: 1rem 1.1rem; }
  a.btn.primary { background: #e8eaef; color: #0e1014; }
  button.btn.install { background: var(--gold-dim); color: #14110a; }
  pre { background: #0e0e0e; padding: .75rem .9rem; overflow: auto; border-radius: 8px; font-size: .82rem; }
  .meta { margin-top: 1rem; color: var(--muted); font-size: .92rem; }
  .iso { margin-top: .75rem; font-size: .85rem; color: #7d8696; }
  details.raw { margin-top: .8rem; }
  details.raw pre { max-height: 18rem; }
  footer { color: var(--muted); font-size: .9rem; }
  #meshStrip { border: 1px solid var(--gold); border-radius: 14px; padding: .85rem 1rem; background: var(--panel); margin: 0 0 1.1rem; display: flex; flex-wrap: wrap; align-items: center; gap: .7rem 1rem; font-size: .88rem; color: var(--muted); }
  #meshStrip .live { color: var(--ink); }
  #meshStrip .live b { color: var(--gold); font-size: 1.35rem; margin-right: .35rem; }
  #meshStrip .rollup b { color: var(--gold); }
  #meshStrip button { font: 700 .78rem/1 ui-monospace, Menlo, Consolas, monospace; height: 2rem; padding: 0 .75rem; border-radius: 8px; background: #101010; color: var(--ink); border: 1px solid var(--gold); cursor: pointer; }
  #meshStrip button:hover { background: #241c0d; color: var(--gold); }
  #meshStrip input { width: 10rem; padding: .4rem .55rem; border: 1px solid var(--gold); border-radius: 8px; background: #0e0e0e; color: var(--ink); font: inherit; }
  #meshProducts { flex-basis: 100%; margin: 0; }
  .peergrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .7rem; margin: .7rem 0 0; }
  @media (max-width: 720px) { .peergrid { grid-template-columns: 1fr; } }
  .peer { border: 1px solid var(--line); border-radius: 10px; padding: .75rem .85rem; background: #101010; }
  .peer h3 { margin: 0 0 .25rem; font-size: .95rem; }
  .peer p { margin: 0; color: var(--muted); font-size: .86rem; }
  .peer .role { color: var(--gold); font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; font-family: ui-monospace, Menlo, Consolas, monospace; }
  .doorpath { background: #0e0e0e; border: 1px dashed var(--gold); border-radius: 10px; padding: .75rem .9rem; margin: .7rem 0; font-size: .82rem; }
  .surfaces { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .55rem; margin: .7rem 0; }
  @media (max-width: 720px) { .surfaces { grid-template-columns: 1fr; } }
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="brandrow">
        <img class="brandmark" src="/sigil.png" width="40" height="40" alt="Everblooming sigil — Aziel Eliab" decoding="async">
        <p class="stamp">Everblooming sigil · Aziel Eliab</p>
      </div>
      <div class="appbar">
        <div>
          <h1>AZCoherence</h1>
          <p class="motto">Coherence reviewer — alternate triad vs primary score. Confidence is not truth.</p>
        </div>
        <p class="pill" id="api-pill">API · checking</p>
      </div>
      <p class="lede">v${VERSION} software by <strong>${AUTHOR}</strong> only. Review a primary triad/claim+score against an alternate independent path. Receipts PASS / FLAG / NEUTRALIZE / REFUSE. Never invent evidence. Forks are welcome and always allowed.</p>
      <nav class="toc" aria-label="Product sections">
        <a href="#workspace">Use UI</a>
        <a href="#surfaces">Dual surface</a>
        <a href="#peers">Softwares peers</a>
        <a href="#meshStrip">Live Nodes</a>
        <a href="#install">Download / install</a>
        <a href="#cite">Cite</a>
        <a href="/v1/skill">Skill</a>
        <a href="/mcp">MCP</a>
        <a href="/v1/fraggate/list">FragGate list</a>
        <a href="/openapi.json">OpenAPI</a>
        <a href="${GITHUB_REPO}">GitHub</a>
      </nav>
      <p class="banner">${escapeHtml(HONEST)}</p>
    </header>

    <div id="meshStrip" aria-label="Suite Live Nodes">
      <div class="live"><b id="meshLiveCount">0</b> Live Nodes</div>
      <div id="meshLine">Suite mesh: off (default). QNM-BUILD-1.0. QNS-CD-1.0. Not an anonymity network.</div>
      <div class="rollup">live <b id="qnmLive">0</b> · locked <b id="qnmLocked">0</b> · isolated <b id="qnmIsolated">0</b></div>
      <div>No Node Gate · No public qnsd proxy · No auto-heal · Aziel Eliab only</div>
      <div>
        <input id="meshBearer" type="text" maxlength="80" placeholder="bearer (required to enable)" aria-label="mesh bearer">
        <button id="meshEnable" type="button" title="Suite proxy enable. Product-local mesh_enable is stub/REFUSE. GET never enables. Default off.">Enable</button>
        <button id="meshDisable" type="button" title="Disable suite mesh (always allowed)">Disable</button>
        <button id="meshJoin" type="button" title="Join as azcoherence. Refused while mesh is OFF. No auto-join.">Join</button>
        <button id="meshLeave" type="button" title="Leave this node. No auto-heal.">Leave</button>
      </div>
      <div id="meshProducts">Catalog MCP mesh_* · FragGate slug=mesh · /v1/mesh/* PROXY · QNS-CD-1.0 photon QNS1 (qnm-node local qnsd; hub cite only) · not AnonBroadcast · not AZMail ring · not a Node Gate · not a Softwares-tab product</div>
    </div>

    <section class="workspace" id="workspace">
      <h2><span class="kicker">Live software</span>Coherence workspace</h2>
      <p class="lede">Use UI: catalog labels on this Worker — Review triad / Alternate score / Coherence check / Neutralize / Verify / Health / Skill / Doctor (<code>POST /v1/review_triad</code>, <code>/v1/alternate_score</code>, <code>/v1/coherence_check</code>, <code>/v1/neutralize_hallucination</code>, <code>/v1/verify</code>, <code>GET /v1/health</code>, <code>GET /v1/skill</code>, <code>GET /v1/doctor</code>). FragGate door proxy: <code>/v1/fraggate/list</code>, <code>/describe</code>, <code>/call</code> via AZIEL_RUNTIME. Suite mesh: <code>/v1/mesh/*</code> PROXY (default OFF; QNM live|locked|isolated; QNS-CD-1.0 hub cite; no Node Gate; no public qnsd proxy; no auto-heal; not anonymity). Product-local <code>mesh_enable</code> is stub/REFUSE. The Worker does not store your scores. Evidence must be operator-provided.</p>
      <div class="workgrid">
        <form id="ws-form" autocomplete="off">
          <label for="claim"><span class="kicker">Claim</span></label>
          <textarea id="claim" rows="3">login succeeds</textarea>
          <div class="row2">
            <div>
              <label for="primary_score"><span class="kicker">Primary score</span></label>
              <input id="primary_score" type="number" step="0.01" value="0.91">
              <label for="primary_path"><span class="kicker">Primary path</span></label>
              <input id="primary_path" type="text" value="primary">
              <label for="primary_evidence"><span class="kicker">Primary evidence</span> Citations only. Never invented.</label>
              <input id="primary_evidence" type="text" value="operator-provided cite A">
            </div>
            <div>
              <label for="alternate_score"><span class="kicker">Alternate score</span> Optional.</label>
              <input id="alternate_score" type="number" step="0.01" value="0.88">
              <label for="alternate_path"><span class="kicker">Alternate path</span></label>
              <input id="alternate_path" type="text" value="independent">
              <label for="alternate_evidence"><span class="kicker">Alternate evidence</span></label>
              <input id="alternate_evidence" type="text" value="operator-provided cite B">
            </div>
          </div>
          <div class="actions">
            <button type="button" class="gold" id="btn-review">Review triad</button>
            <button type="button" class="ink" id="btn-alt">Alternate score</button>
            <button type="button" class="ghost" id="btn-check">Coherence check</button>
            <button type="button" class="ghost" id="btn-neu">Neutralize</button>
            <button type="button" class="ghost" id="btn-verify">Verify</button>
            <button type="button" class="ghost" id="btn-health">Health</button>
            <button type="button" class="ghost" id="btn-skill">Skill</button>
            <button type="button" class="ghost" id="btn-doctor">Doctor</button>
            <button type="button" class="gold" id="btn-fraggate">FragGate call</button>
            <button type="button" class="ghost" id="btn-example">Fill sample</button>
          </div>
        </form>
        <div>
          <div class="status" id="ws-status">No receipt yet. Review triad writes the first advisory receipt. Confidence is not truth.</div>
          <div class="metrics">
            <div class="metric"><b>Verdict</b><span id="last-verdict">—</span></div>
            <div class="metric"><b>Delta</b><span id="last-delta">—</span></div>
            <div class="metric"><b>Receipt hash</b><span id="last-hash">—</span></div>
            <div class="metric"><b>Advisory</b><span>confidence ≠ truth</span></div>
          </div>
          <details class="raw" open>
            <summary>Raw API result / debug</summary>
            <pre id="raw-json">{}</pre>
          </details>
        </div>
      </div>
    </section>

    <section class="card" id="surfaces">
      <h2><span class="kicker">Dual-surface law</span>Agent MCP · human Worker UI · /download</h2>
      <p class="lede">FragGate is THE single door. Agents stay in chat (<code>display.title</code> / <code>display.summary</code>). Humans keep this complete Worker UI and the counted package. Do not gut either surface.</p>
      <div class="surfaces">
        <div class="peer"><span class="role">Agent</span><h3>MCP + FragGate</h3><p><a href="/mcp">POST /mcp</a> on this Worker, or catalog <a href="${CATALOG}mcp">POST /mcp</a> · slug <code>azcoherence</code>.</p></div>
        <div class="peer"><span class="role">Human</span><h3>This Worker UI</h3><p>Catalog labels on <a href="${HOST}/">the homepage</a>. Local <code>azcoherence ui</code> at 127.0.0.1:8871.</p></div>
        <div class="peer"><span class="role">Package</span><h3>Counted /download</h3><p><a href="/download?asset=${DEFAULT_ASSET}">gzip HTTP 200</a>. Isolated KV <code>AZCOHERENCE_DOWNLOADS</code>. /v1 does not increment.</p></div>
      </div>
      <div class="doorpath" id="fraggate-path">
        <span class="kicker">Runtime FragGate call path</span>
        <p>Catalog door: <code>POST ${FRAGGATE_CALL}</code> body <code>{"slug":"azcoherence","op":"review_triad","payload":{…}}</code></p>
        <p>List: <a href="${FRAGGATE_LIST}">${FRAGGATE_LIST}</a> · Describe: <a href="${FRAGGATE_DESCRIBE}">${FRAGGATE_DESCRIBE}</a> · Softwares: <a href="${SOFTWARE_TAB}">${SOFTWARE_TAB}</a></p>
        <p>This Worker PROXY (same door, not a second door): <a href="/v1/fraggate/list">GET /v1/fraggate/list</a> · <a href="/v1/fraggate/describe?slug=azcoherence">GET /v1/fraggate/describe</a> · <code>POST /v1/fraggate/call</code>. The <strong>FragGate call</strong> button uses the Worker proxy.</p>
      </div>
    </section>

    <section class="card" id="peers">
      <h2><span class="kicker">Softwares · Plain · scoring-review</span>Suite peers — do not merge</h2>
      <p class="lede">AZCoherence is a Softwares-tab <strong>scoring-review</strong> placement. Peer of AZ-CLCE (azclce). Not AKM-TRIAD. FragGate remains THE single door.</p>
      <div class="peergrid">
        <div class="peer"><span class="role">Catalog door</span><h3><a href="${CATALOG}">aziel-runtime</a></h3><p>FragGate <code>/v1/fraggate/*</code>, <code>/v1/software</code>, <code>/mcp</code>. Kernel <a href="https://github.com/AzielEliab/fraggate">fraggate</a>.</p></div>
        <div class="peer"><span class="role">Peer scorer</span><h3><a href="${AZCLCE_HOST}/">AZ-CLCE / azclce</a></h3><p>R/D/P inconsistency, not intent. Separate product. <a href="https://github.com/AzielEliab/az-clce">github.com/AzielEliab/az-clce</a></p></div>
        <div class="peer"><span class="role">Fabric neighbor</span><h3>AKM-TRIAD-1.0</h3><p>LIVE fabric memory on aziel-runtime. Cite only. Not a Softwares slug. Posterior ≠ truth. Do not merge.</p></div>
        <div class="peer"><span class="role">Custodial OE</span><h3><a href="${AZINTERFACE_HOST}/">AZInterface</a></h3><p>Page cycles / pair custody. <a href="https://github.com/AzielEliab/azinterface">github.com/AzielEliab/azinterface</a></p></div>
      </div>
      <p class="meta">Hubs: <a href="${HUB_AZIELELIAB}">azieleliab.com</a> · <a href="${HUB_LIBRARY}">azielcorpuslibrary.net</a> · <a href="${HUB_GODLOCK}">godlock.uk</a> · also <a href="${DECISIONGATE_HOST}/">DecisionGATE</a></p>
    </section>

    <section class="card" id="install">
      <h2><span class="kicker">Counted package</span>Download and one-click install</h2>
      <div class="nums">
        <p class="count">${v}<span>Views</span></p>
        <p class="count">${n}<span>Downloads</span></p>
      </div>
      <p>Download saves the gzip from this Worker (HTTP 200, counted). One-click install copies a Terminal command. After it finishes, run <code>azcoherence ui</code> and open http://127.0.0.1:8871 on this computer only.</p>
      <div class="btns">
        <a class="btn block primary" href="/download?asset=${DEFAULT_ASSET}">Download</a>
        <button type="button" class="btn block install" id="install-btn">One-click install</button>
      </div>
      <pre id="install-cmd">${INSTALL_LINE}</pre>
      <p class="meta">The download count ticks on the Download click. No 302 to GitHub. Forks using this same link are counted automatically. ${DEFAULT_ASSET} — ${n} counted.</p>
      <p class="iso">Isolated counter: Worker <code>azcoherence-download-tracker</code>, project <code>azcoherence</code>, KV <code>AZCOHERENCE_DOWNLOADS</code>. Not mixed with any other product. /v1 does not increment downloads.</p>
      <p class="meta">GitHub: stars ${gh.stars || 0} · forks ${gh.forks || 0} · watchers ${gh.watchers || 0} · release assets ${gh.release_download_count || 0}</p>
      <p class="meta">Peers (do not merge): <a href="${AZCLCE_HOST}/">AZ-CLCE / azclce</a> · AKM-TRIAD-1.0 (fabric neighbor, cite only) · <a href="${AZINTERFACE_HOST}/">AZInterface</a> · <a href="${DECISIONGATE_HOST}/">DecisionGATE</a> · <a href="https://github.com/AzielEliab/fraggate">FragGate</a> · <a href="${CATALOG}">aziel-runtime</a> · hubs <a href="${HUB_LIBRARY}">azielcorpuslibrary.net</a> · <a href="${HUB_GODLOCK}">godlock.uk</a> · <a href="${HUB_AZIELELIAB}">azieleliab.com</a></p>
      <p class="meta"><a href="/stats">JSON stats</a> · <a href="/count">/count</a> · <a href="/openapi.json">OpenAPI</a> · <a href="/mcp">MCP</a> · <a href="/v1/fraggate/list">FragGate list</a> · <a href="/v1/mesh">/v1/mesh</a> · <a href="/v1/skill">Skill</a> · <a href="/v1/example">Example</a> · <a href="/ai">AI runtime</a> · <a href="${GITHUB_REPO}">GitHub</a> · <a href="${GITHUB_LATEST}">releases</a></p>
      <h3>Per repo / branch / fork</h3>
      <ul>${breakdownList(stats)}</ul>
    </section>

    <section class="cite" id="cite">
      <h2>How to cite</h2>
      <p>${escapeHtml(HOW_TO_CITE)}</p>
      <p>Author: <strong>${AUTHOR}</strong> only · License: Apache-2.0 · Forks welcome and always allowed · Machine-readable: <a href="/cite.json">/cite.json</a></p>
      <p class="meta">No DOI is invented here. Software deposit still needed. Cite GitHub and this Worker.</p>
      <p><a href="${CATALOG}">Catalog</a> · <a href="${CATALOG_PRODUCT}">Catalog product</a> · <a href="${GITHUB_REPO}">GitHub</a> · <a href="${HOST}/download">Download</a> · <a href="/llms.txt">llms.txt</a></p>
    </section>

    <footer>
      <p>Apache-2.0 · ${AUTHOR} · AZCoherence v${VERSION}</p>
      <p>Confidence is not truth. Never invent evidence. Mesh GET never enables.</p>
    </footer>
  </div>
  <script>
    (function () {
      var lastReceipt = null;
      var lastResult = null;
      function $(id) { return document.getElementById(id); }
      function fields() {
        var alt = $("alternate_score").value;
        return {
          claim: $("claim").value,
          primary_score: Number($("primary_score").value),
          alternate_score: alt === "" ? null : Number(alt),
          primary_path: $("primary_path").value,
          alternate_path: $("alternate_path").value,
          primary_evidence: $("primary_evidence").value,
          alternate_evidence: $("alternate_evidence").value,
          evidence: $("alternate_evidence").value
        };
      }
      function setStatus(kind, text) {
        var el = $("ws-status");
        el.className = "status" + (kind ? " " + kind : "");
        el.textContent = text;
      }
      function render() {
        var rec = lastReceipt || {};
        $("last-verdict").textContent = rec.verdict || (lastResult && lastResult.verdict) || "—";
        $("last-delta").textContent = rec.delta != null ? String(rec.delta) : "—";
        $("last-hash").textContent = rec.receipt_hash || "—";
        $("raw-json").textContent = JSON.stringify(lastResult || {}, null, 2);
      }
      function isGetOp(path) {
        return path === "/v1/health" || path === "/v1/skill" || path === "/v1/doctor" || path === "/v1/example";
      }
      async function api(path, body) {
        var get = isGetOp(path);
        var res = await fetch(path, {
          method: get ? "GET" : "POST",
          headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
          body: get ? undefined : JSON.stringify(body || {})
        });
        var ctype = (res.headers.get("Content-Type") || "");
        if (path === "/v1/skill" || ctype.indexOf("text/markdown") !== -1) {
          var text = await res.text();
          if (!res.ok) throw new Error("HTTP " + res.status);
          return { ok: true, action: "skill", skill: text };
        }
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
        return data;
      }
      function applyResult(data, fallbackMsg) {
        lastResult = data;
        if (data && data.receipt) lastReceipt = data.receipt;
        var ok = data && data.ok !== false && data.verdict !== "REFUSE";
        var msg = (data && (data.verdict || data.note || data.action || data.error)) || fallbackMsg;
        setStatus(ok ? "ok" : "bad", msg || "Done.");
        render();
      }
      async function run(fn, label) {
        try { applyResult(await fn(), label); }
        catch (err) { setStatus("bad", String(err.message || err)); }
      }
      $("btn-review").onclick = function () { run(function () { return api("/v1/review_triad", fields()); }, "Reviewed. Advisory only."); };
      $("btn-alt").onclick = function () { run(function () { return api("/v1/alternate_score", fields()); }, "Alternate score from provided evidence only."); };
      $("btn-check").onclick = function () { run(function () { return api("/v1/coherence_check", fields()); }, "Coherence check."); };
      $("btn-neu").onclick = function () { run(function () { return api("/v1/neutralize_hallucination", fields()); }, "Advisory neutralize. Not publish-as-truth."); };
      $("btn-verify").onclick = function () { run(function () { return api("/v1/verify", { receipt: lastReceipt || {} }); }, "Verify walked the receipt hash."); };
      $("btn-health").onclick = function () { run(function () { return api("/v1/health", {}); }, "Health. Catalog FragGate op. No writes."); };
      $("btn-skill").onclick = function () { run(function () { return api("/v1/skill", {}); }, "Skill. Catalog FragGate op."); };
      $("btn-doctor").onclick = function () { run(function () { return api("/v1/doctor", {}); }, "Doctor. Catalog FragGate LIVE_OPS."); };
      $("btn-fraggate").onclick = function () {
        run(function () {
          return api("/v1/fraggate/call", { slug: "azcoherence", op: "review_triad", payload: fields() });
        }, "FragGate call via Worker PROXY to aziel-runtime. Same door as catalog POST /v1/fraggate/call.");
      };
      $("btn-example").onclick = function () {
        $("claim").value = "login succeeds";
        $("primary_score").value = "0.91";
        $("alternate_score").value = "0.88";
        $("primary_path").value = "primary";
        $("alternate_path").value = "independent";
        $("primary_evidence").value = "operator-provided cite A";
        $("alternate_evidence").value = "operator-provided cite B";
        setStatus("ok", "Sample filled. Evidence is operator-provided. Never invented.");
      };
      var installBtn = $("install-btn");
      var installPre = $("install-cmd");
      var installCmd = ${JSON.stringify(INSTALL_LINE)};
      if (installBtn) {
        installBtn.addEventListener("click", function () {
          function done(ok) {
            installBtn.textContent = ok ? "Copied! Paste in Terminal, then run azcoherence ui" : "Select the command, copy it, then run azcoherence ui";
            installBtn.classList.add("copied");
          }
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(installCmd).then(function () { done(true); }).catch(function () { done(false); });
          } else {
            done(false);
            if (installPre && window.getSelection) {
              var r = document.createRange();
              r.selectNodeContents(installPre);
              var sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(r);
            }
          }
        });
      }
      fetch("/v1/health").then(function (res) { return res.json(); }).then(function (data) {
        var pill = $("api-pill");
        if (!pill) return;
        if (data && data.ok) {
          pill.textContent = "API live · v" + (data.version || "${VERSION}");
          pill.className = "pill ok";
        } else {
          pill.textContent = "API down";
          pill.className = "pill bad";
        }
      }).catch(function () {
        var pill = $("api-pill");
        if (pill) { pill.textContent = "API down"; pill.className = "pill bad"; }
      });
      function meshNum() {
        for (var i = 0; i < arguments.length; i++) {
          var raw = arguments[i];
          if (raw == null || raw === "") continue;
          var n = typeof raw === "number" ? raw : Number(String(raw).replace(/,/g, ""));
          if (Number.isFinite(n) && n >= 0) return Math.floor(n);
        }
        return 0;
      }
      function unwrapMesh(j) {
        if (!j || typeof j !== "object") return {};
        if (j.result && typeof j.result === "object") return Object.assign({}, j, j.result);
        if (j.mesh && typeof j.mesh === "object") return Object.assign({}, j, j.mesh);
        return j;
      }
      function paintMesh(raw) {
        var j = unwrapMesh(raw);
        var on = j.enabled === true || j.enabled === 1 || String(j.status || "").toLowerCase() === "on";
        var r = (j.rollup && typeof j.rollup === "object") ? j.rollup : {};
        var live = on ? meshNum(r.live, j.live_nodes, j.live) : 0;
        var locked = on ? meshNum(r.locked, j.locked_nodes, j.locked) : 0;
        var isolated = on ? meshNum(r.isolated, j.isolated_nodes, j.isolated) : 0;
        $("meshLiveCount").textContent = String(live);
        $("qnmLive").textContent = String(live);
        $("qnmLocked").textContent = String(locked);
        $("qnmIsolated").textContent = String(isolated);
        var line = $("meshLine");
        if (on) line.textContent = "Suite mesh: on · live " + live + " · locked " + locked + " · isolated " + isolated + ". QNS-CD-1.0. Not an anonymity network.";
        else if (j.status === "unavailable" || (j.ok === false && j.error)) line.textContent = "Suite mesh: off (unavailable). QNM-BUILD-1.0. QNS-CD-1.0. Not an anonymity network.";
        else line.textContent = "Suite mesh: off (default). QNM-BUILD-1.0. QNS-CD-1.0. Not an anonymity network.";
        var products = j.products_present || j.products || [];
        var names = Array.isArray(products) ? products.map(function (p) { return typeof p === "string" ? p : (p && (p.product || p.slug)) || ""; }).filter(Boolean) : [];
        var nodes = Array.isArray(j.nodes) ? j.nodes : [];
        var extra = names.length ? " · products " + names.join(", ") : (nodes.length ? " · " + nodes.length + " node labels" : "");
        $("meshProducts").textContent = "Catalog MCP mesh_* · FragGate slug=mesh · /v1/mesh/* PROXY · QNS-CD-1.0 photon QNS1 (qnm-node local qnsd; hub cite only) · not AnonBroadcast · not AZMail ring · not a Node Gate · not a Softwares-tab product" + extra;
      }
      async function meshGet(path) {
        var r = await fetch(path, { headers: { "user-agent": "Mozilla/5.0", accept: "application/json" } });
        return r.json();
      }
      async function meshPost(path, payload) {
        var r = await fetch(path, { method: "POST", headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" }, body: JSON.stringify(payload || {}) });
        return r.json();
      }
      async function refreshMesh() {
        try {
          var status = await meshGet("/v1/mesh");
          var merged = status;
          var inner = unwrapMesh(status);
          var on = inner.enabled === true;
          if (on) {
            try {
              var nodes = await meshGet("/v1/mesh/nodes");
              merged = Object.assign({}, inner, unwrapMesh(nodes));
            } catch (e) { /* status is enough */ }
          }
          paintMesh(merged);
          var nodeId = sessionStorage.getItem("azcoherence_mesh_node");
          if (on && nodeId) {
            try { await meshPost("/v1/mesh/heartbeat", { node_id: nodeId }); } catch (e) { /* no auto-heal */ }
          }
        } catch (e) {
          paintMesh({ ok: false, enabled: false, status: "unavailable", error: "mesh_unavailable" });
        }
      }
      $("meshEnable").onclick = async function () {
        var bearer = ($("meshBearer").value || "").trim();
        paintMesh(await meshPost("/v1/mesh/enable", bearer ? { bearer: bearer } : {}));
        refreshMesh();
      };
      $("meshDisable").onclick = async function () {
        sessionStorage.removeItem("azcoherence_mesh_node");
        paintMesh(await meshPost("/v1/mesh/disable", {}));
        refreshMesh();
      };
      $("meshJoin").onclick = async function () {
        var j = await meshPost("/v1/mesh/join", { product: "azcoherence", label: "AZCoherence Worker" });
        var inner = unwrapMesh(j);
        var id = inner.node_id || inner.id || (inner.session && inner.session.node_id);
        if (id) sessionStorage.setItem("azcoherence_mesh_node", String(id));
        paintMesh(j);
        refreshMesh();
      };
      $("meshLeave").onclick = async function () {
        var id = sessionStorage.getItem("azcoherence_mesh_node");
        if (id) await meshPost("/v1/mesh/leave", { node_id: id });
        sessionStorage.removeItem("azcoherence_mesh_node");
        refreshMesh();
      };
      window.addEventListener("pagehide", function () {
        var id = sessionStorage.getItem("azcoherence_mesh_node");
        if (!id || typeof navigator.sendBeacon !== "function") return;
        try { navigator.sendBeacon("/v1/mesh/leave", new Blob([JSON.stringify({ node_id: id })], { type: "application/json" })); } catch (e) { /* leave expires in 5 minutes */ }
      });
      refreshMesh();
      setInterval(refreshMesh, 30000);
      document.addEventListener("visibilitychange", function () { if (!document.hidden) refreshMesh(); });
      render();
    })();
  </script>
</body>
</html>`;
}
