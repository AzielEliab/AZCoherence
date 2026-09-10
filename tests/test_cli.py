"""CLI smoke."""

from __future__ import annotations

from azcoherence.cli import main


def test_cli_health(capsys) -> None:
    assert main(["health"]) == 0
    out = capsys.readouterr().out
    assert "azcoherence" in out
    assert "AZC-WP-0.1" in out


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
    assert "PASS" in capsys.readouterr().out


def test_cli_stub_mesh_enable(capsys) -> None:
    rc = main(["stub", "mesh_enable"])
    assert rc == 1
    assert "AZC-REFUSE" in capsys.readouterr().out
