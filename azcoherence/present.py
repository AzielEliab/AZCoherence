"""Human text for the AZCoherence CLI. Author: Aziel Eliab only."""

from __future__ import annotations

import re
from typing import Any

WELCOME = """\
AZCoherence checks a score against a second path you provide and writes an advisory receipt.

Author: Aziel Eliab

Next: open the local app.

  azcoherence ui

Or check this install:

  azcoherence doctor
  azcoherence --help
"""

ROOT_HELP = """\
usage: azcoherence [--version] [--json] [--help] <command> [<args>]

Check a score against a second path you provide. AZCoherence writes an
advisory receipt: PASS, FLAG, NEUTRALIZE, or REFUSE.

Author: Aziel Eliab

Common commands:
  ui          Open the local app (http://127.0.0.1:8871/)
  review      Compare a claim and two scores
  doctor      Check this install
  health      Show that AZCoherence is running

Advanced:
  alternate   Score from evidence you already have
  check       Compare two scores
  neutralize  Mark a wide split as not authoritative
  verify      Check a receipt hash
  skill       Print the skill notes
  stub        Show the refusal for a stub operation

Examples:
  azcoherence
  azcoherence ui
  azcoherence doctor
  azcoherence review --claim "login succeeds" --primary-score 0.91 \\
      --alternate-score 0.88 --primary-evidence "cite A" \\
      --alternate-evidence "cite B"
  azcoherence health --json

Run 'azcoherence <command> --help' for one command.
"""

_HINTS = {
    "azcoherence": "azcoherence ui    or    azcoherence --help",
    "ui": "azcoherence ui",
    "review": (
        'azcoherence review --claim "login succeeds" --primary-score 0.91 '
        '--alternate-score 0.88 --primary-evidence "cite A" --alternate-evidence "cite B"'
    ),
    "alternate": 'azcoherence alternate --claim "login succeeds" --evidence "cite you already have"',
    "check": (
        'azcoherence check --claim "login succeeds" --primary-score 0.91 '
        '--alternate-score 0.40 --primary-evidence "cite A" --alternate-evidence "cite B"'
    ),
    "neutralize": 'azcoherence neutralize --claim "login succeeds" --primary-score 0.99 --alternate-score 0.20',
    "verify": "azcoherence verify --receipt examples/sample_receipt.json",
    "stub": "azcoherence stub mesh_enable",
    "doctor": "azcoherence doctor",
    "health": "azcoherence health",
    "skill": "azcoherence skill",
}

_REASONS = {
    "alternate": "alternate needs a claim and evidence you already have.",
    "check": "check needs a primary score and an alternate score.",
    "verify": "verify needs a receipt file.",
    "stub": "stub needs one of: history_rewrite, invent_citations, publish_as_truth, mesh_enable.",
    "review": "review needs the claim and scores you already have.",
    "ui": "ui takes an optional port on this computer.",
}


def usage_error(message: str, prog: str) -> str:
    cmd = (prog or "azcoherence").split()[-1]
    choice = re.search(r"invalid choice: '([^']*)'", message or "")
    if choice and cmd in {"azcoherence", "cmd"}:
        return f'Unknown command "{choice.group(1)}".\nTry: azcoherence ui    or    azcoherence --help\n'
    if choice:
        return f'Unknown value "{choice.group(1)}".\nTry: {_HINTS.get(cmd, _HINTS["azcoherence"])}\n'
    unknown = re.search(r"unrecognized arguments?: (.+)", message or "")
    if unknown:
        return f'Unknown option {unknown.group(1).strip()}.\nTry: azcoherence --help\n'
    if "required" in (message or ""):
        reason = _REASONS.get(cmd, "A required value is missing.")
        return f"{reason}\nTry: {_HINTS.get(cmd, _HINTS['azcoherence'])}\n"
    reason = (message or "Could not run that command.").strip()
    return f"{reason}\nTry: {_HINTS.get(cmd, _HINTS['azcoherence'])}\n"


def command_error(message: str, *, next_step: str | None = None) -> str:
    step = next_step or "azcoherence --help"
    text = (message or "Could not finish that command.").strip()
    return f"{text}\n\nNext: {step}\n"


def render(data: dict[str, Any]) -> str:
    if isinstance(data.get("invariants"), dict):
        return _doctor(data)
    if data.get("action") == "verify" or ("match" in data and data.get("expected_hash")):
        return _verify(data)
    if data.get("stub"):
        return _stub(data)
    if data.get("verdict"):
        return _verdict(data)
    if data.get("version") and data.get("live_ops") and "verdict" not in data:
        return _health(data)
    if data.get("error"):
        return command_error(str(data["error"]))
    return command_error("AZCoherence returned a result with no verdict.")


def _health(data: dict[str, Any]) -> str:
    return (
        f"AZCoherence {data.get('version')} is running.\n"
        f"Spec: {data.get('spec')}\n"
        f"Author: {data.get('author')}\n"
        "\n"
        "Ready to review a claim you provide. Confidence is not truth.\n"
        "\n"
        "Next: azcoherence ui\n"
        "      azcoherence doctor\n"
    )


def _doctor(data: dict[str, Any]) -> str:
    mark = "pass" if data.get("ok") else "fail"
    lines = [
        f"Doctor: {mark}",
        f"AZCoherence {data.get('version')}",
        f"Author: {data.get('author')}",
        "",
    ]
    for key, text in (data.get("invariants") or {}).items():
        lines.append(f"  {mark}  {key}  {text}")
    lines.append("")
    note = str(data.get("note") or "").strip()
    if note:
        lines.append(note)
    lines.append("Next: azcoherence ui")
    lines.append("")
    return "\n".join(lines)


_PLAIN = {
    "PASS": "These scores agree. The receipt is advisory.",
    "FLAG": "The scores differ, or the evidence is thin. Look again before you rely on them.",
    "NEUTRALIZE": "The scores split widely. Treat the primary score as not authoritative.",
    "REFUSE": "This review was refused.",
}


def _verdict(data: dict[str, Any]) -> str:
    verdict = str(data.get("verdict") or "")
    lines = [f"Verdict: {verdict}"]
    claim = str(data.get("claim") or "").strip()
    if claim:
        lines.append(f"Claim: {claim}")
    if data.get("primary_score") is not None:
        lines.append(f"Primary score: {data.get('primary_score')}")
    if data.get("alternate_score") is not None:
        lines.append(f"Alternate score: {data.get('alternate_score')}")
    if data.get("delta") is not None:
        lines.append(f"Difference: {data.get('delta')}")
    lines.append("")
    plain = _PLAIN.get(verdict)
    if plain:
        lines.append(plain)
    note = str(data.get("note") or "").strip()
    if note and note != plain:
        lines.append(note)
    error = str(data.get("error") or "").strip()
    if error and error != note:
        lines.append(error)
    receipt = data.get("receipt") if isinstance(data.get("receipt"), dict) else {}
    if receipt.get("receipt_hash"):
        lines.append(f"Receipt hash: {receipt['receipt_hash']}")
    lines.append("")
    lines.append("Next: azcoherence ui")
    lines.append("")
    return "\n".join(lines)


def _stub(data: dict[str, Any]) -> str:
    error = str(data.get("error") or "Refused.").strip()
    return f"Refused.\n\n{error}\n\nNext: azcoherence --help\n"


def _verify(data: dict[str, Any]) -> str:
    head = "Receipt hash matches." if data.get("match") else "Receipt hash does not match."
    lines = [head, ""]
    if data.get("expected_hash"):
        lines.append(f"Expected hash: {data.get('expected_hash')}")
    if data.get("given_hash"):
        lines.append(f"Given hash: {data.get('given_hash')}")
    note = str(data.get("note") or "").strip()
    if note:
        lines.append("")
        lines.append(note)
    lines.append("")
    lines.append("Next: azcoherence verify --help")
    lines.append("")
    return "\n".join(lines)
