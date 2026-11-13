"""Locked product law."""

from __future__ import annotations

from pathlib import Path

from azcoherence.engine import LIVE_OPS, STUB_OPS

ROOT = Path(__file__).resolve().parents[1]


def test_live_ops_locked() -> None:
    assert LIVE_OPS == (
        "health",
        "skill",
        "doctor",
        "verify",
        "review_triad",
        "alternate_score",
        "coherence_check",
        "neutralize_hallucination",
    )


def test_stub_ops_locked() -> None:
    assert STUB_OPS == (
        "history_rewrite",
        "invent_citations",
        "publish_as_truth",
        "mesh_enable",
    )


def test_peers_not_merged() -> None:
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    assert "Do not merge" in readme or "do not merge" in readme
    assert "az-clce" in readme
    assert "AKM-TRIAD-1.0" in readme
    assert "fabric neighbor" in readme or "cite only" in readme
    assert "AZInterface" in readme
    assert "azieleliab.com" in readme
    assert "/v1/software" in readme
