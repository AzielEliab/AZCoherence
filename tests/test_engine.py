"""Engine receipts and stub refuses."""

from __future__ import annotations

from azcoherence.canon import digest
from azcoherence.engine import (
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
from azcoherence.errors import RefuseError
import pytest


PASS_BODY = {
    "claim": "login succeeds",
    "primary": {"score": 0.91, "path": "primary", "evidence": ["operator cite A"]},
    "alternate": {"score": 0.88, "path": "independent", "evidence": ["operator cite B"]},
}


def test_health_and_doctor_live() -> None:
    h = health()
    d = doctor()
    assert h["ok"] is True
    assert h["slug"] == "azcoherence"
    assert h["spec"] == "AZC-WP-0.1"
    assert d["fraggate_live"] is True
    for op in LIVE_OPS:
        assert op in h["live_ops"]
        assert op in d["live_ops"]


def test_review_pass() -> None:
    out = review_triad(PASS_BODY)
    assert out["verdict"] == "PASS"
    assert out["ok"] is True
    assert out["confidence_is_not_truth"] is True
    assert out["invented_evidence"] is False
    assert out["receipt"]["receipt_hash"]


def test_coherence_flag_and_neutralize() -> None:
    flag = coherence_check(
        {
            "claim": "login succeeds",
            "primary_score": 0.90,
            "alternate_score": 0.70,
            "primary_evidence": ["a"],
            "alternate_evidence": ["b"],
        }
    )
    assert flag["verdict"] == "FLAG"
    neu = coherence_check(
        {
            "claim": "login succeeds",
            "primary_score": 0.95,
            "alternate_score": 0.20,
            "primary_evidence": ["a"],
            "alternate_evidence": ["b"],
        }
    )
    assert neu["verdict"] == "NEUTRALIZE"


def test_high_conf_without_evidence_flags() -> None:
    out = review_triad({"claim": "x", "primary_score": 0.95, "alternate_score": 0.94})
    assert out["verdict"] == "FLAG"


def test_alternate_score_refuses_empty_evidence() -> None:
    with pytest.raises(RefuseError):
        alternate_score({"claim": "login succeeds"})


def test_alternate_score_from_evidence() -> None:
    out = alternate_score({"claim": "login button submits", "evidence": ["login button submits form"]})
    assert out["action"] == "alternate_score"
    assert out["alternate_score"] is not None
    assert out["invented_evidence"] is False


def test_stubs_refuse() -> None:
    for op in STUB_OPS:
        out = dispatch(op, {})
        assert out["verdict"] == "REFUSE"
        assert out["code"] == "AZC-REFUSE"
        assert out["stub"] is True


def test_publish_as_truth_flag_refuses_neutralize() -> None:
    out = neutralize_hallucination({**PASS_BODY, "publish_as_truth": True})
    assert out["verdict"] == "REFUSE"
    assert out["op"] == "publish_as_truth"


def test_verify_receipt_hash() -> None:
    reviewed = review_triad(PASS_BODY)
    rec = reviewed["receipt"]
    ok = verify_receipt({"receipt": rec})
    assert ok["ok"] is True
    assert ok["match"] is True
    broken = dict(rec)
    broken["receipt_hash"] = "0" * 64
    bad = verify_receipt({"receipt": broken})
    assert bad["ok"] is False


def test_canonical_digest_stable() -> None:
    card = {
        "advisory": True,
        "alternate_path": "independent",
        "alternate_score": 0.88,
        "author": "Aziel Eliab",
        "claim": "login succeeds",
        "confidence_is_not_truth": True,
        "delta": 0.03,
        "evidence_alternate": ["b"],
        "evidence_primary": ["a"],
        "invented_evidence": False,
        "primary_path": "primary",
        "primary_score": 0.91,
        "product": "azcoherence",
        "spec": "AZC-WP-0.1",
        "verdict": "PASS",
        "version": "0.1.0",
    }
    assert digest(card) == digest(card)
