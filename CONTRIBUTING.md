# Contributing to AZCoherence

**Forks are first-class.** This project is Apache-2.0; you do not need
permission to fork, patch, or redistribute. Pull requests are welcome
if you want a change upstream. Keep a fork forever if you do not.

**Forks are welcome and always allowed.**

## How to run tests

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
python -m pytest -q
```

Python 3.10+. Core is stdlib only (`hashlib`, `json`, `argparse`).
pytest is the dev extra. No network.

## Ground rules

1. **Identity is Aziel Eliab only.** Do not credit other names.
2. **I1 Never invent evidence.** Citations must be operator-provided.
3. **I2 Confidence is not truth.**
4. **I3 Do not merge AZ-CLCE or AKM-TRIAD-1.0.**
5. **I4** History rewrite, invent citations, publish-as-truth, and mesh enable refuse.
6. **I5** Receipts are PASS / FLAG / NEUTRALIZE / REFUSE.
7. **I6** Mesh GET never enables. Mesh default OFF.
8. **Door vs local op.** `/v1/fraggate/*`, `/v1/runtime/*`, and
    `/v1/mesh/*` PROXY to aziel-runtime. Local ops are `/v1/{op}` only.
    Never treat `fraggate/call` or `mesh/status` as a local op name.
    Suite mesh default OFF; QNM rollup live|locked|isolated; QNS-CD-1.0
    hub cite only (no public qnsd proxy); no Node Gate; no auto-heal;
    identity-bearing QNM mesh.
9. New behavior needs a test that fails without the change.

## Where to change things

- Engine: `azcoherence/engine.py`, `workers/download-tracker/src/engine.js`
- CLI: `azcoherence/cli.py`
- Local UI: `azcoherence/ui.py`
- Worker homepage: `workers/download-tracker/src/home.js`
- Suite mesh / QNM Live Nodes + QNS-CD-1.0 cross-map: `workers/download-tracker/src/mesh.js`

## License of contributions

By submitting a change you agree it is licensed under Apache-2.0, the
same license as the rest of the tree. Keep the copyright lines honest.
Author: Aziel Eliab only.
