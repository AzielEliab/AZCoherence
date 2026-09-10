# AZCoherence

Open-source **alternate-triad coherence reviewer** — double-checks a
primary triad / claim+score against an independent alternate path to
prevent, neutralize, or eliminate AI hallucination in scoring
(AZC-WP-0.1). Receipts are `PASS` / `FLAG` / `NEUTRALIZE` / `REFUSE`.
Never invent evidence. **Confidence is not truth.**

**Author:** Aziel Eliab only  
**Also in SEO:** Aziel Elroi Eliab  
**Date:** September 2026 · v0.1.0  
**License:** [Apache-2.0](LICENSE)  
**Class:** Plain · slug `azcoherence` · spec AZC-WP-0.1

> A second path is a receipt. A score is not a fact.

See the spec: [docs/whitepaper.md](docs/whitepaper.md) ·
[docs/AZC-WP-0.1.md](docs/AZC-WP-0.1.md) ·
[docs/mcp.md](docs/mcp.md).
How to contribute: [CONTRIBUTING.md](CONTRIBUTING.md).

**Forks are welcome and always allowed.**

## Quick start

```bash
python -m venv .venv && source .venv/bin/activate && pip install -e ".[dev]"
azcoherence ui
```

## One-click install

```bash
curl -fsSL https://azcoherence-download-tracker.vibelock.workers.dev/install.sh | bash
```

The script curls the **counted** tarball from this project's Worker
(`/download`, User-Agent `Mozilla/5.0`), extracts, makes a venv, and
`pip install -e .`. Then run `azcoherence ui`.

Or use the live software homepage (workspace + counted download):
https://azcoherence-download-tracker.vibelock.workers.dev/

## Counted download (Cloudflare Worker)

**This is the counted download.** GitHub releases exist as a mirror.
The Worker serves the gzip itself (HTTP 200, no 302 to GitHub).

- Homepage: [https://azcoherence-download-tracker.vibelock.workers.dev/](https://azcoherence-download-tracker.vibelock.workers.dev/)
- Direct tarball: [azcoherence-0.1.0.tar.gz](https://azcoherence-download-tracker.vibelock.workers.dev/download?asset=azcoherence-0.1.0.tar.gz)
- One-click install: [https://azcoherence-download-tracker.vibelock.workers.dev/install.sh](https://azcoherence-download-tracker.vibelock.workers.dev/install.sh)
- Skill: [https://azcoherence-download-tracker.vibelock.workers.dev/v1/skill](https://azcoherence-download-tracker.vibelock.workers.dev/v1/skill)
- FragGate proxy: [list](https://azcoherence-download-tracker.vibelock.workers.dev/v1/fraggate/list) · describe · [call](https://azcoherence-download-tracker.vibelock.workers.dev/v1/fraggate/call) via AZIEL_RUNTIME
- Suite mesh proxy: [https://azcoherence-download-tracker.vibelock.workers.dev/v1/mesh](https://azcoherence-download-tracker.vibelock.workers.dev/v1/mesh) — default OFF; GET never enables; product-local `mesh_enable` is stub/REFUSE; QNM live / locked / isolated; QNS-CD-1.0 hub cite (photon QNS1; local qnsd in [qnm-node](https://github.com/AzielEliab/qnm-node); runtime catalog in [aziel-runtime](https://github.com/AzielEliab/aziel-runtime)). Not a Softwares-tab product. No public qnsd proxy.
- Worker MCP: [https://azcoherence-download-tracker.vibelock.workers.dev/mcp](https://azcoherence-download-tracker.vibelock.workers.dev/mcp) — GET docs / POST JSON-RPC (health/skill/doctor/verify/review_triad)
- OpenAPI: [https://azcoherence-download-tracker.vibelock.workers.dev/openapi.json](https://azcoherence-download-tracker.vibelock.workers.dev/openapi.json)
- GitHub: [https://github.com/AzielEliab/AZCoherence](https://github.com/AzielEliab/AZCoherence)
- Cite: [cite.json](https://azcoherence-download-tracker.vibelock.workers.dev/cite.json) — Eliab, Aziel. (2026). AZCoherence 0.1.0 [Software]. Apache-2.0. No Zenodo DOI is invented here; a software deposit is still needed.

Isolated counter: Worker `azcoherence-download-tracker`, KV `AZCOHERENCE_DOWNLOADS`. `/v1` does not increment downloads.

Open http://127.0.0.1:8871 (loopback only). No CDN, no telemetry.

---

## Download

**Counted download page (this project only, ticks automatically):**

# → [https://azcoherence-download-tracker.vibelock.workers.dev/](https://azcoherence-download-tracker.vibelock.workers.dev/) ←

Direct tarball (also counted): [azcoherence-0.1.0.tar.gz](https://azcoherence-download-tracker.vibelock.workers.dev/download?asset=azcoherence-0.1.0.tar.gz)

- Live count JSON (`{project, views, downloads, total}`): [https://azcoherence-download-tracker.vibelock.workers.dev/count](https://azcoherence-download-tracker.vibelock.workers.dev/count)
- Stats: [https://azcoherence-download-tracker.vibelock.workers.dev/stats](https://azcoherence-download-tracker.vibelock.workers.dev/stats)
- GitHub releases: [https://github.com/AzielEliab/AZCoherence/releases](https://github.com/AzielEliab/AZCoherence/releases)

---

## Local UI

`azcoherence ui` serves a loopback dashboard at http://127.0.0.1:8871

Binds to `127.0.0.1` only. Self-contained HTML (no CDN). Review triad /
alternate score / coherence check / neutralize / verify / health /
skill / doctor a local payload (catalog labels). Evidence must be
operator-provided.

## CLI smoke

```bash
azcoherence health
azcoherence doctor
azcoherence review --claim "login succeeds" --primary-score 0.91 --alternate-score 0.88 \
  --primary-evidence "operator cite A" --alternate-evidence "operator cite B"
azcoherence alternate --claim "login succeeds" --evidence "operator cite B"
azcoherence check --claim "login succeeds" --primary-score 0.91 --alternate-score 0.40 \
  --primary-evidence "cite A" --alternate-evidence "cite B"
azcoherence neutralize --claim "login succeeds" --primary-score 0.99 --alternate-score 0.20
azcoherence verify --receipt examples/sample_receipt.json
azcoherence stub mesh_enable
```

## iPhone & Android

Flutter sources: [`mobile/`](mobile/). Application id `com.azieeliab.azcoherence`. Offline. No analytics. Dark matte / gold.

```bash
cd mobile
flutter create --org com.azieeliab --project-name azcoherence .
flutter pub get
flutter run
```

The `android/` and `ios/` folders in this tree are skeleton READMEs until you run `flutter create .` (this machine has no Flutter SDK on PATH). Then open `android/` in Android Studio or `ios/Runner.xcworkspace` in Xcode. Not a store listing.

## What it does

AZCoherence is a **coherence reviewer**. It takes a primary triad or
claim+score and an **alternate independent path**, then emits a receipt:

| Verdict | Meaning |
|---------|---------|
| PASS | Scores agree within `PASS_DELTA` (0.08) and both paths have evidence. Still advisory. |
| FLAG | Scores diverge, or evidence is thin. Review before acting. |
| NEUTRALIZE | Large split or high-confidence-without-evidence (hallucination pattern). Treat the primary score as non-authoritative. |
| REFUSE | Missing claim/scores, or a stub verb. |

It does **not** invent citations. It does **not** publish a score as
truth. It does **not** rewrite history.

## Peers (do not merge)

- [AZ-CLCE](https://github.com/AzielEliab/az-clce) — R/D/P inconsistency, not intent. Separate product.
- **AKM-TRIAD-1.0** — LIVE fabric memory on [aziel-runtime](https://github.com/AzielEliab/aziel-runtime). Not a Softwares slug. Behind FragGate (`memory_*`). Posterior ≠ truth.

## Invariants (enforced)

- **I1** Never invent evidence or citations
- **I2** Confidence is not truth
- **I3** Do not merge AZ-CLCE or AKM-TRIAD-1.0
- **I4** History rewrite / invent citations / publish-as-truth / mesh enable refuse
- **I5** Receipts are PASS / FLAG / NEUTRALIZE / REFUSE
- **I6** Mesh GET never enables. Mesh default OFF. Product-local `mesh_enable` is stub

## Cross-links

- [AZ-CLCE](https://github.com/AzielEliab/az-clce) — peer; inconsistency, not intent
- [DecisionGATE](https://github.com/AzielEliab/decisiongate) — five sequential gates
- [FragGate](https://github.com/AzielEliab/fraggate) — one door: discover, route, refuse
- [aziel-runtime](https://github.com/AzielEliab/aziel-runtime) — catalog + MCP + OpenAPI (`qns_cd` cite field)
- [QNS-CD-1.0](https://github.com/AzielEliab/aziel-runtime/blob/main/docs/designs/QNS-CD-1.0.md) — photon QNS1 1.3 packet-transfer coding design (Worker cites only)
- [qnm-node](https://github.com/AzielEliab/qnm-node) — local Quantum Node Mesh process (`qnsd` / photon QNS1; not hosted here)
- [AZInterface](https://github.com/AzielEliab/azinterface) — pair custody (AIH page cycles)
- [Aziel Digital Library](https://www.azielcorpuslibrary.net/)
- [godlock.uk](https://godlock.uk/)
- [www.azieleliab.com](https://www.azieleliab.com/)

## Use with AI assistants

Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants. Import the catalog or Worker OpenAPI as a GPT Action, custom HTTP tool, or custom OpenAPI tool. MCP clients (Cursor, Glama, Claude, and others): `POST https://azcoherence-download-tracker.vibelock.workers.dev/mcp` or catalog `POST https://aziel-runtime.vibelock.workers.dev/mcp`. Public identity: Aziel Eliab only.

- Worker OpenAPI: https://azcoherence-download-tracker.vibelock.workers.dev/openapi.json
- Worker MCP: `POST https://azcoherence-download-tracker.vibelock.workers.dev/mcp`
- Catalog OpenAPI: https://aziel-runtime.vibelock.workers.dev/openapi.json
- Catalog MCP: `POST https://aziel-runtime.vibelock.workers.dev/mcp` (FragGate slug `azcoherence`)

Agents use this Worker `/mcp` (thin doubles of health/skill/doctor/verify/review_triad/alternate_score/coherence_check/neutralize_hallucination) or OpenAPI/MCP via aziel-runtime. This Worker `/v1/fraggate/*` and `/v1/mesh/*` PROXY via AZIEL_RUNTIME. Humans use the complete Worker UI (catalog labels plus Live Nodes strip). Dual surface: do not gut the human UI. Suite mesh default OFF. GET `/v1/mesh` never enables. Product-local `mesh_enable` is stub/REFUSE. QNM-BUILD-1.0 live|locked|isolated. QNS-CD-1.0 photon QNS1 packet transfer is a hub cite / Worker mesh cross-map only (local qnsd in [qnm-node](https://github.com/AzielEliab/qnm-node); runtime cites in [aziel-runtime](https://github.com/AzielEliab/aziel-runtime)). Not a Softwares-tab product. No Node Gate. No public qnsd proxy. No auto-heal. Not anonymity. Catalog MCP `mesh_*` + FragGate `slug=mesh`. Anon-broadcast is not a publish path.

Always send `User-Agent: Mozilla/5.0`.

## Honest banner

THIS IS: an advisory coherence reviewer (AZC-WP-0.1).
THIS IS NOT: AZ-CLCE, AKM-TRIAD-1.0, a truth verdict, a citation inventor, a history rewrite, or publish-as-truth. Confidence is not truth. Never invent evidence. Author Aziel Eliab only.

Cite the GitHub repository and this Worker. No Zenodo DOI is invented here (placeholder until a software deposit exists).

Apache-2.0. Forks are welcome and always allowed.

## Catalog + local UI

Author: **Aziel Eliab**. Honest scope: coherence review, not truth.

- Product homepage (workspace + counted download): https://azcoherence-download-tracker.vibelock.workers.dev/
- Catalog product (when listed): https://aziel-runtime.vibelock.workers.dev/p/azcoherence/
- Catalog OpenAPI: https://aziel-runtime.vibelock.workers.dev/openapi.json
- Catalog MCP: `POST https://aziel-runtime.vibelock.workers.dev/mcp`
- This Worker MCP (dual surface): `POST https://azcoherence-download-tracker.vibelock.workers.dev/mcp`
- This Worker skill: `GET https://azcoherence-download-tracker.vibelock.workers.dev/v1/skill`
- This Worker OpenAPI: https://azcoherence-download-tracker.vibelock.workers.dev/openapi.json

Local UI labels match catalog: Review triad / Alternate score / Coherence check / Neutralize / Verify / Health / Skill / Doctor. Worker homepage adds the suite Live Nodes strip (`GET /v1/mesh`) with the QNS-CD-1.0 cross-map.
