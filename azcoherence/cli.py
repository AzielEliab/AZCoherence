"""AZCoherence CLI. Author: Aziel Eliab only."""

from __future__ import annotations

import argparse
import errno
import json
import sys
from pathlib import Path
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
from azcoherence.present import ROOT_HELP, WELCOME, command_error, render, usage_error


class HumanParser(argparse.ArgumentParser):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        self.azc_root = kwargs.pop("azc_root", False)
        kwargs.setdefault("formatter_class", argparse.RawDescriptionHelpFormatter)
        super().__init__(*args, **kwargs)

    def format_help(self) -> str:
        if self.azc_root:
            return ROOT_HELP
        return super().format_help()

    def error(self, message: str) -> None:
        self.exit(2, usage_error(message, self.prog))


def _prepare(argv: list[str]) -> tuple[list[str], str | None]:
    """Keep `--json VALUE` as a JSON body. Bare `--json` stays a print flag."""
    out: list[str] = []
    payload: str | None = None
    i = 0
    while i < len(argv):
        arg = argv[i]
        if arg == "--json":
            nxt = argv[i + 1] if i + 1 < len(argv) else None
            if nxt and not nxt.startswith("-"):
                payload = nxt
                out.append("--json")
                i += 2
                continue
        elif arg.startswith("--json="):
            payload = arg.split("=", 1)[1]
            out.append("--json")
            i += 1
            continue
        out.append(arg)
        i += 1
    return out, payload


def _csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in value.split(",") if part.strip()]


def _load_object(raw: str) -> dict[str, Any]:
    text = raw.strip()
    if text.startswith("{") or text.startswith("["):
        data = json.loads(text)
    else:
        data = load_json(text)
    if not isinstance(data, dict):
        raise AzCoherenceError("JSON body must be an object.")
    return data


def _payload(args: argparse.Namespace, legacy: str | None) -> dict[str, Any]:
    body: dict[str, Any] = {}
    raw = legacy or getattr(args, "payload", None) or ""
    if raw:
        body.update(_load_object(str(raw)))
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


def _add_body_flags(parser: argparse.ArgumentParser, *, evidence: bool = False) -> None:
    parser.add_argument("--claim", default="")
    parser.add_argument("--primary-score", type=float, default=None)
    parser.add_argument("--alternate-score", type=float, default=None)
    parser.add_argument("--primary-evidence", default="", help="Citations you already have, separated by commas.")
    parser.add_argument("--alternate-evidence", default="", help="Citations you already have, separated by commas.")
    if evidence:
        parser.add_argument("--evidence", default="", help="Citations you already have, separated by commas.")
    parser.add_argument("--primary-path", default=None)
    parser.add_argument("--alternate-path", default=None)
    parser.add_argument("--payload", default="", help="JSON file or {...} object. Evidence in it must be yours.")


def build_parser() -> HumanParser:
    json_parent = argparse.ArgumentParser(add_help=False)
    json_parent.add_argument("--json", action="store_true", help="Print JSON for scripts.")

    p = HumanParser(
        prog="azcoherence",
        description="Check a score against a second path you provide.",
        azc_root=True,
        parents=[json_parent],
    )
    p.add_argument("--version", action="version", version=f"azcoherence {__version__}")
    sub = p.add_subparsers(dest="cmd", required=False, parser_class=HumanParser)

    sub.add_parser(
        "health",
        parents=[json_parent],
        help="Show that AZCoherence is running.",
        description="Show that AZCoherence is running.",
    )
    sub.add_parser(
        "doctor",
        parents=[json_parent],
        help="Check this install.",
        description="Check this install. Prints pass or fail in plain lines.",
    )
    sub.add_parser(
        "skill",
        parents=[json_parent],
        help="Print the skill notes.",
        description="Print the skill notes.",
    )

    review = sub.add_parser(
        "review",
        parents=[json_parent],
        help="Compare a claim and two scores.",
        description="Compare a primary score with an alternate path you provide.",
        epilog=(
            "examples:\n"
            '  azcoherence review --claim "login succeeds" --primary-score 0.91 \\\n'
            '      --alternate-score 0.88 --primary-evidence "cite A" \\\n'
            '      --alternate-evidence "cite B"\n'
            "  azcoherence review --payload examples/sample_triad.json --json\n"
        ),
    )
    _add_body_flags(review)

    alt = sub.add_parser(
        "alternate",
        parents=[json_parent],
        help="Score from evidence you already have.",
        description="Score a claim from evidence you provide. AZCoherence does not invent citations.",
        epilog='example:\n  azcoherence alternate --claim "login succeeds" --evidence "cite you already have"\n',
    )
    alt.add_argument("--claim", required=True)
    alt.add_argument("--evidence", required=True, help="Citations you already have, separated by commas.")
    alt.add_argument("--payload", default="", help="JSON file or {...} object.")

    check = sub.add_parser(
        "check",
        parents=[json_parent],
        help="Compare two scores.",
        description="Compare two scores you already have.",
        epilog=(
            "example:\n"
            '  azcoherence check --claim "login succeeds" --primary-score 0.91 \\\n'
            "      --alternate-score 0.40 --primary-evidence \"cite A\" --alternate-evidence \"cite B\"\n"
        ),
    )
    check.add_argument("--claim", default="")
    check.add_argument("--primary-score", type=float, required=True)
    check.add_argument("--alternate-score", type=float, required=True)
    check.add_argument("--primary-evidence", default="")
    check.add_argument("--alternate-evidence", default="")
    check.add_argument("--payload", default="")

    neu = sub.add_parser(
        "neutralize",
        parents=[json_parent],
        help="Mark a wide split as not authoritative.",
        description="Advisory only. A wide split marks the primary score as not authoritative.",
    )
    _add_body_flags(neu)

    ver = sub.add_parser(
        "verify",
        parents=[json_parent],
        help="Check a receipt hash.",
        description="Check a receipt hash.",
        epilog="example:\n  azcoherence verify --receipt examples/sample_receipt.json\n",
    )
    ver.add_argument("--receipt", required=True, help="Path to receipt JSON.")

    stub = sub.add_parser(
        "stub",
        parents=[json_parent],
        help="Show the refusal for a stub operation.",
        description="Show the refusal for a stub operation.",
    )
    stub.add_argument("op", choices=list(STUB_OPS))

    ui = sub.add_parser(
        "ui",
        help="Open the local app on this computer.",
        description="Open the local app. Binds to 127.0.0.1 only.",
        epilog="example:\n  azcoherence ui\n",
    )
    ui.add_argument("--host", default="127.0.0.1")
    ui.add_argument("--port", type=int, default=8871)
    return p


def _emit(data: dict[str, Any], machine: bool) -> int:
    if machine:
        sys.stdout.write(json.dumps(data, indent=2, ensure_ascii=True) + "\n")
    else:
        sys.stdout.write(render(data))
    return 0 if data.get("ok", True) else 1


def _fail(message: str, machine: bool, *, next_step: str | None = None) -> int:
    if machine:
        sys.stdout.write(
            json.dumps(
                {"ok": False, "error": message, "honest": HONEST, "live_ops": list(LIVE_OPS)},
                indent=2,
                ensure_ascii=True,
            )
            + "\n"
        )
    else:
        sys.stdout.write(command_error(message, next_step=next_step))
    return 1


def _read_skill() -> str:
    skill = Path(__file__).resolve().parents[1] / "SKILL.md"
    return skill.read_text(encoding="utf-8")


def main(argv: list[str] | None = None) -> int:
    if argv is None:
        argv = sys.argv[1:]
    prepared, legacy_payload = _prepare(list(argv))
    try:
        args = build_parser().parse_args(prepared)
    except SystemExit as exc:
        code = exc.code
        if code is None:
            return 0
        return code if isinstance(code, int) else 1

    machine = bool(getattr(args, "json", False))
    try:
        if args.cmd is None:
            if machine:
                return _emit(health(), True)
            sys.stdout.write(WELCOME)
            return 0
        if args.cmd == "health":
            return _emit(health(), machine)
        if args.cmd == "doctor":
            return _emit(doctor(), machine)
        if args.cmd == "skill":
            try:
                text = _read_skill()
            except OSError:
                return _fail(
                    "Skill notes are not in this install.",
                    machine,
                    next_step="Open SKILL.md in the source tree.",
                )
            sys.stdout.write(text if text.endswith("\n") else text + "\n")
            return 0
        if args.cmd == "review":
            return _emit(review_triad(_payload(args, legacy_payload)), machine)
        if args.cmd == "alternate":
            return _emit(alternate_score(_payload(args, legacy_payload)), machine)
        if args.cmd == "check":
            return _emit(coherence_check(_payload(args, legacy_payload)), machine)
        if args.cmd == "neutralize":
            return _emit(neutralize_hallucination(_payload(args, legacy_payload)), machine)
        if args.cmd == "verify":
            try:
                rec = load_json(args.receipt)
            except FileNotFoundError:
                return _fail(
                    f'Could not read receipt "{args.receipt}".',
                    machine,
                    next_step="azcoherence verify --receipt examples/sample_receipt.json",
                )
            except json.JSONDecodeError:
                return _fail(
                    f'Receipt "{args.receipt}" is not JSON.',
                    machine,
                    next_step="azcoherence verify --receipt examples/sample_receipt.json",
                )
            except OSError as exc:
                return _fail(
                    f'Could not read receipt "{args.receipt}". {exc}',
                    machine,
                    next_step="azcoherence verify --help",
                )
            body = rec if isinstance(rec, dict) and "receipt" in rec else {"receipt": rec}
            if not isinstance(body, dict):
                return _fail("Receipt must be a JSON object.", machine, next_step="azcoherence verify --help")
            return _emit(verify_receipt(body), machine)
        if args.cmd == "stub":
            return _emit(dispatch(args.op, {}), machine)
        if args.cmd == "ui":
            from azcoherence.ui import serve

            try:
                serve(host=args.host, port=args.port)
            except OSError as exc:
                if exc.errno == errno.EADDRINUSE:
                    message = f"Port {args.port} is already in use."
                else:
                    message = f"Could not open the local app on port {args.port}."
                return _fail(message, False, next_step="azcoherence ui --port 8872")
            except ValueError:
                return _fail(
                    "The local app binds to this computer only (127.0.0.1).",
                    False,
                    next_step="azcoherence ui",
                )
            return 0
    except AzCoherenceError as exc:
        return _fail(str(exc), machine, next_step="azcoherence --help")
    except json.JSONDecodeError:
        return _fail(
            "Could not read that JSON.",
            machine,
            next_step="Pass a file path or a {...} object. azcoherence review --help",
        )
    except FileNotFoundError as exc:
        name = getattr(exc, "filename", None) or "that file"
        return _fail(
            f'Could not read "{name}".',
            machine,
            next_step="azcoherence review --help",
        )
    except OSError as exc:
        return _fail(f"Could not read the file. {exc}", machine, next_step="azcoherence --help")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
