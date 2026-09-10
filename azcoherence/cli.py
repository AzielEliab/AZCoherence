"""AZCoherence CLI. Author: Aziel Eliab only."""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any

from azcoherence import __version__
from azcoherence.engine import (
    HONEST,
    LIVE_OPS,
    STUB_OPS,
    alternate_score,
    coherence_check,
    dispatch,
    doctor,
    health,
    neutralize_hallucination,
    review_triad,
    verify_receipt,
)
from azcoherence.errors import AzCoherenceError
from azcoherence.jsonio import load_json


def _print(data: Any) -> int:
    sys.stdout.write(json.dumps(data, indent=2, ensure_ascii=True) + "\n")
    return 0 if data.get("ok", True) else 1


def _csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in value.split(",") if part.strip()]


def _payload(args: argparse.Namespace) -> dict[str, Any]:
    body: dict[str, Any] = {}
    if getattr(args, "json", None):
        body.update(load_json(args.json) if not str(args.json).startswith("{") else json.loads(args.json))
    if getattr(args, "claim", None):
        body["claim"] = args.claim
    if getattr(args, "primary_score", None) is not None:
        body["primary_score"] = args.primary_score
    if getattr(args, "alternate_score", None) is not None:
        body["alternate_score"] = args.alternate_score
    if getattr(args, "primary_evidence", None):
        body["primary_evidence"] = _csv(args.primary_evidence)
    if getattr(args, "alternate_evidence", None):
        body["alternate_evidence"] = _csv(args.alternate_evidence)
    if getattr(args, "evidence", None):
        body["evidence"] = _csv(args.evidence)
    if getattr(args, "primary_path", None):
        body["primary_path"] = args.primary_path
    if getattr(args, "alternate_path", None):
        body["alternate_path"] = args.alternate_path
    return body


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="azcoherence",
        description="AZCoherence — alternate-triad coherence reviewer (AZC-WP-0.1). Author: Aziel Eliab.",
    )
    p.add_argument("--version", action="version", version=f"azcoherence {__version__}")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("health", help="Liveness. FragGate LIVE_OPS.")
    sub.add_parser("doctor", help="Self-check. FragGate LIVE_OPS.")
    sub.add_parser("skill", help="Print skill markdown.")

    review = sub.add_parser("review", help="Review primary triad vs alternate path.")
    review.add_argument("--claim", default="")
    review.add_argument("--primary-score", type=float, default=None)
    review.add_argument("--alternate-score", type=float, default=None)
    review.add_argument("--primary-evidence", default="")
    review.add_argument("--alternate-evidence", default="")
    review.add_argument("--primary-path", default="primary")
    review.add_argument("--alternate-path", default="alternate")
    review.add_argument("--json", default="")

    alt = sub.add_parser("alternate", help="Independent alternate score from provided evidence only.")
    alt.add_argument("--claim", required=True)
    alt.add_argument("--evidence", required=True, help="Comma-separated citations. Never invented.")
    alt.add_argument("--json", default="")

    check = sub.add_parser("check", help="Coherence check of two scores.")
    check.add_argument("--claim", default="")
    check.add_argument("--primary-score", type=float, required=True)
    check.add_argument("--alternate-score", type=float, required=True)
    check.add_argument("--primary-evidence", default="")
    check.add_argument("--alternate-evidence", default="")
    check.add_argument("--json", default="")

    neu = sub.add_parser("neutralize", help="Advisory neutralize of a hallucinated score.")
    neu.add_argument("--claim", default="")
    neu.add_argument("--primary-score", type=float, default=None)
    neu.add_argument("--alternate-score", type=float, default=None)
    neu.add_argument("--primary-evidence", default="")
    neu.add_argument("--alternate-evidence", default="")
    neu.add_argument("--json", default="")

    ver = sub.add_parser("verify", help="Verify a receipt hash.")
    ver.add_argument("--receipt", required=True, help="Path to receipt JSON.")

    stub = sub.add_parser("stub", help="Call a refused stub op (expect REFUSE).")
    stub.add_argument("op", choices=list(STUB_OPS))

    ui = sub.add_parser("ui", help="Loopback UI (127.0.0.1 only).")
    ui.add_argument("--host", default="127.0.0.1")
    ui.add_argument("--port", type=int, default=8871)

    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        if args.cmd == "health":
            return _print(health())
        if args.cmd == "doctor":
            return _print(doctor())
        if args.cmd == "skill":
            from pathlib import Path

            skill = Path(__file__).resolve().parents[1] / "SKILL.md"
            sys.stdout.write(skill.read_text(encoding="utf-8"))
            return 0
        if args.cmd == "review":
            return _print(review_triad(_payload(args)))
        if args.cmd == "alternate":
            return _print(alternate_score(_payload(args)))
        if args.cmd == "check":
            return _print(coherence_check(_payload(args)))
        if args.cmd == "neutralize":
            return _print(neutralize_hallucination(_payload(args)))
        if args.cmd == "verify":
            rec = load_json(args.receipt)
            return _print(verify_receipt(rec if "receipt" in rec else {"receipt": rec}))
        if args.cmd == "stub":
            return _print(dispatch(args.op, {}))
        if args.cmd == "ui":
            from azcoherence.ui import serve

            serve(host=args.host, port=args.port)
            return 0
    except AzCoherenceError as exc:
        return _print({"ok": False, "error": str(exc), "honest": HONEST, "live_ops": list(LIVE_OPS)})
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
