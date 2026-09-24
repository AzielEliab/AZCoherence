# AZCoherence

**Alternate-triad double-check to neutralize AI hallucination in scores**

Aziel Eliab
September 2026
License: Apache-2.0
Spec: AZC-WP-0.1
Class: Plain
Slug: azcoherence

> A second path is a receipt. A score is not a fact. Confidence is not truth.

## Abstract

AZCoherence is an open-source coherence reviewer. It takes a **primary**
triad or claim+score and an **alternate independent path**, then emits a
receipt: `PASS`, `FLAG`, `NEUTRALIZE`, or `REFUSE`.

The product exists to prevent, neutralize, or eliminate **AI
hallucination in scoring**. It never invents evidence. It never
publishes a score as truth. It never rewrites history.

This document is the specification implemented by the `azcoherence`
Python package and the Cloudflare Worker (v0.1.0). Forks are welcome
and always allowed.

AZCoherence does **not** merge [AZ-CLCE](https://github.com/AzielEliab/az-clce)
(R/D/P inconsistency, not intent) and is **not** AKM-TRIAD-1.0 (LIVE
fabric memory on aziel-runtime — not a Softwares slug). It cites
[aziel-runtime](https://github.com/AzielEliab/aziel-runtime) FragGate
(`/v1/fraggate/*`, `/v1/software`, `/mcp`) as THE single door,
[AZInterface](https://github.com/AzielEliab/azinterface) as custodial
OE, and Softwares hubs azieleliab.com / azielcorpuslibrary.net /
godlock.uk. Dual surface: agent MCP + human Worker UI + `/download`.

---

## 1. Purpose

AI systems emit scores. Those scores are often treated as truth. They
are not. A high posterior, a high Jaccard, or a high "confidence" can
be a hallucination with a number attached.

AZCoherence separates the **receipt of a second path** from any **story
about the first score**.

- A receipt says: the primary score and the alternate independent path
  agree, diverge, or cannot be checked.
- A receipt does not say: the claim is true, the citation exists, or
  the prior score should be rewritten.

---

## 2. Invariants

| Id | Rule |
|----|------|
| I1 | Never invent evidence or citations. |
| I2 | Confidence is not truth. |
| I3 | Do not merge AZ-CLCE or AKM-TRIAD-1.0. |
| I4 | History rewrite, invent citations, publish-as-truth, and mesh enable refuse. |
| I5 | Receipts are PASS / FLAG / NEUTRALIZE / REFUSE. |
| I6 | Mesh GET never enables. Mesh default OFF. Product-local `mesh_enable` is stub. |

---

## 3. Data model

Primary path: `{ score, path?, evidence[] | citations[], legs? }`

Alternate path: `{ score?, path?, evidence[] | citations[] }`

Claim: operator-provided string. Required for review.

Scores are normalized to `[0, 1]`. Values in `(1, 100]` are treated as
percent.

Thresholds (locked):

- `PASS_DELTA = 0.08`
- `NEUTRALIZE_DELTA = 0.25`
- `HIGH_CONF = 0.80`

Verdict:

- **PASS** — `|primary − alternate| ≤ PASS_DELTA` and both paths have evidence
- **FLAG** — thin evidence, moderate split, or high-confidence without evidence
- **NEUTRALIZE** — split `> NEUTRALIZE_DELTA`, or high-confidence-without-evidence plus split `> 0.15`
- **REFUSE** — missing claim/scores, or a stub verb

`alternate_score` computes an independent token-Jaccard of the claim
against **provided** evidence only. Empty evidence refuses. The method
does not invent citations and does not run AZ-CLCE or AKM-TRIAD.

Receipts are hashed over a canonical field set (SHA-256). `verify`
walks that hash. No history rewrite.

---

## 4. LIVE_OPS

`health`, `skill`, `doctor`, `verify`, `review_triad`,
`alternate_score`, `coherence_check`, `neutralize_hallucination`.

`neutralize_hallucination` is **advisory**. It marks a hallucinated
score as non-authoritative. It does not publish-as-truth and does not
invent a replacement citation.

---

## 5. Stub / refuse

`history_rewrite`, `invent_citations`, `publish_as_truth`, `mesh_enable`.

Suite mesh (`GET /v1/mesh`) is a PROXY to aziel-runtime. GET never
enables. Default OFF.

---

## 6. Dual surface

1. **Agent / MCP** — FragGate is THE single door. Catalog
   `POST https://aziel-runtime.vibelock.workers.dev/mcp` slug
   `azcoherence`. Worker `POST /mcp` is a thin double. No technical MCP
   chrome as the product.
2. **Human** — this package prints status (`azcoherence`, `doctor`, `health`).
   `azcoherence ui` is an operator diagnostic. Suite status belongs on
   AZInterface. The Worker homepage is a separate surface.

---

## 7. Identity

Author: **Aziel Eliab** only. Aziel Elroi Eliab is an allowed SEO aka.
Forks are welcome and always allowed. Apache-2.0.

No Zenodo DOI is invented here.
