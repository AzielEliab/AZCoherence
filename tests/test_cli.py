"""CLI smoke."""

from __future__ import annotations

import json

from azcoherence.cli import main
from azcoherence.engine import health


def test_cli_health(capsys) -> None:
    assert main(["health"]) == 0
    out = capsys.readouterr().out
    assert "azcoherence" in out
    assert "AZC-WP-0.1" in out
    assert not out.lstrip().startswith("{")


def test_cli_health_json_matches_engine(capsys) -> None:
    assert main(["health", "--json"]) == 0
    assert json.loads(capsys.readouterr().out) == health()


def test_cli_bare_welcome(capsys) -> None:
    assert main([]) == 0
    out = capsys.readouterr().out
    assert "azcoherence ui" in out
    assert "Aziel Eliab" in out
    assert "the following arguments are required" not in out


def test_cli_help(capsys) -> None:
    assert main(["--help"]) == 0
    out = capsys.readouterr().out
    assert "Examples:" in out
    assert "azcoherence ui" in out
    assert "Advanced:" in out
    assert "changelog" not in out.lower()


def test_cli_unknown_command(capsys) -> None:
    assert main(["bogus"]) == 2
    err = capsys.readouterr().err
    assert 'Unknown command "bogus"' in err
    assert "azcoherence --help" in err
    assert "Traceback" not in err


def test_cli_missing_alternate(capsys) -> None:
    assert main(["alternate"]) == 2
    err = capsys.readouterr().err
    assert "evidence" in err
    assert "Try:" in err
    assert "arguments are required" not in err


def test_cli_review_pass(capsys) -> None:
    rc = main(
        [
            "review",
            "--claim",
            "login succeeds",
            "--primary-score",
            "0.91",
            "--alternate-score",
            "0.88",
            "--primary-evidence",
            "cite A",
            "--alternate-evidence",
            "cite B",
        ]
    )
    assert rc == 0
    out = capsys.readouterr().out
    assert "PASS" in out
    assert "Confidence is not truth." in out


def test_cli_review_json_payload(capsys) -> None:
    rc = main(
        [
            "review",
            "--json",
            json.dumps(
                {
                    "claim": "login succeeds",
                    "primary_score": 0.91,
                    "alternate_score": 0.88,
                    "primary_evidence": ["cite A"],
                    "alternate_evidence": ["cite B"],
                }
            ),
        ]
    )
    assert rc == 0
    data = json.loads(capsys.readouterr().out)
    assert data["verdict"] == "PASS"
    assert data["receipt"]["receipt_hash"]
    assert data["author"] == "Aziel Eliab"


def test_cli_stub_mesh_enable(capsys) -> None:
    rc = main(["stub", "mesh_enable"])
    assert rc == 1
    assert "AZC-REFUSE" in capsys.readouterr().out


def test_cli_doctor_plain(capsys) -> None:
    assert main(["doctor"]) == 0
    out = capsys.readouterr().out
    assert "Doctor: pass" in out
    assert "Confidence is not truth." in out


def test_cli_bad_receipt(capsys) -> None:
    assert main(["verify", "--receipt", "missing-receipt.json"]) == 1
    out = capsys.readouterr().out
    assert "Could not read receipt" in out
    assert "Next:" in out
    assert "Traceback" not in out
