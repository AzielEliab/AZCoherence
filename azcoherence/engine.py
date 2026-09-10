"""AZCoherence engine — primary triad vs alternate independent path.

Receipts: PASS / FLAG / NEUTRALIZE / REFUSE.
Never invent evidence. Confidence ≠ truth.
Does not merge AZ-CLCE (inconsistency, not intent) or AKM-TRIAD-1.0 (LIVE fabric).

Author: Aziel Eliab only.
"""

from __future__ import annotations

from typing import Any

from azcoherence.canon import AUTHOR, PRODUCT, SPEC, digest
from azcoherence.errors import RefuseError, StubError

VERSION = "0.1.0"
MOTTO = "Coherence reviewer — alternate triad vs primary score. Confidence is not truth."
ROLE = "alternate-triad coherence reviewer"
SLUG = "azcoherence"

LIVE_OPS = (
    "health",
    "skill",
    "doctor",
    "verify",
    "review_triad",
    "alternate_score",
    "coherence_check",
    "neutralize_hallucination",
)
STUB_OPS = (
    "history_rewrite",
    "invent_citations",
    "publish_as_truth",
    "mesh_enable",
)
VERDICTS = ("PASS", "FLAG", "NEUTRALIZE", "REFUSE")

PASS_DELTA = 0.08
NEUTRALIZE_DELTA = 0.25
HIGH_CONF = 0.80

PEER_AZ_CLCE = "https://github.com/AzielEliab/az-clce"
PEER_AKM = "AKM-TRIAD-1.0"
HONEST = (
    "THIS IS: an advisory coherence reviewer (AZC-WP-0.1). Primary triad/claim+score "
    "versus an alternate independent path. Receipts are PASS / FLAG / NEUTRALIZE / REFUSE. "
    "THIS IS NOT: AZ-CLCE (R/D/P inconsistency, not intent), not AKM-TRIAD-1.0 fabric memory, "
    "not a truth verdict, not a citation inventor, not a history rewrite, not publish-as-truth. "
    "Confidence is not truth. Never invent evidence. Author Aziel Eliab only."
)

STUB_MESSAGES = {
    "history_rewrite": "AZC-REFUSE: history rewrite is stub. Receipts are forward-only. Do not alter a prior score as if it never existed.",
    "invent_citations": "AZC-REFUSE: invent citations is stub. Never invent evidence. Provide citations or receive FLAG / REFUSE.",
    "publish_as_truth": "AZC-REFUSE: publish-as-truth is stub. A coherence receipt is advisory. Confidence is not truth.",
    "mesh_enable": "AZC-REFUSE: mesh enable is stub on this product. GET /v1/mesh never enables. Suite mesh default OFF. FragGate slug=mesh is fabric, not this Softwares product.",
}


def normalize_score(value: Any) -> float | None:
    if value is None or value == "":
        return None
    try:
        n = float(value)
    except (TypeError, ValueError):
        return None
    if not (n == n):  # NaN
        return None
    if n > 1.0 and n <= 100.0:
        n = n / 100.0
    if n < 0.0:
        return 0.0
    if n > 1.0:
        return 1.0
    return n


def _as_list(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        text = value.strip()
        return [text] if text else []
    if isinstance(value, (list, tuple)):
        out = []
        for item in value:
            if item is None:
                continue
            text = str(item).strip()
            if text:
                out.append(text)
        return out
    return []


def evidence_of(path: dict[str, Any] | None) -> list[str]:
    src = path or {}
    ev = _as_list(src.get("evidence"))
    if ev:
        return ev
    return _as_list(src.get("citations"))


def has_evidence(path: dict[str, Any] | None) -> bool:
    return bool(evidence_of(path))


def tokenize(text: str) -> set[str]:
    buf: list[str] = []
    token: list[str] = []
    for ch in (text or "").lower():
        if ch.isalnum():
            token.append(ch)
        else:
            if token:
                buf.append("".join(token))
                token = []
    if token:
        buf.append("".join(token))
    return {t for t in buf if t}


def jaccard(a: set[str], b: set[str]) -> float:
    if not a and not b:
        return 0.0
    union = a | b
    if not union:
        return 0.0
    return len(a & b) / len(union)


def path_label(path: dict[str, Any] | None, default: str) -> str:
    src = path or {}
    raw = src.get("path") or src.get("source") or default
    return str(raw).strip() or default


def refuse_stub(op: str) -> dict[str, Any]:
    key = (op or "").strip().replace("-", "_")
    if key not in STUB_OPS:
        raise RefuseError("unknown stub")
    return {
        "ok": False,
        "verdict": "REFUSE",
        "code": "AZC-REFUSE",
        "stub": True,
        "op": key,
        "product": PRODUCT,
        "spec": SPEC,
        "version": VERSION,
        "author": AUTHOR,
        "advisory": True,
        "confidence_is_not_truth": True,
        "invented_evidence": False,
        "error": STUB_MESSAGES[key],
        "door": "fraggate",
        "slug": SLUG,
    }


def _flags_from_payload(payload: dict[str, Any]) -> dict[str, bool]:
    return {
        "history_rewrite": bool(payload.get("history_rewrite") or payload.get("rewrite_history")),
        "invent_citations": bool(payload.get("invent_citations") or payload.get("invent")),
        "publish_as_truth": bool(payload.get("publish_as_truth") or payload.get("as_truth")),
        "mesh_enable": bool(payload.get("mesh_enable") or payload.get("enable_mesh")),
    }


def decide_verdict(
    primary_score: float | None,
    alternate_score: float | None,
    primary_has_ev: bool,
    alternate_has_ev: bool,
    flags: dict[str, bool],
    *,
    missing_claim: bool = False,
) -> str:
    if flags.get("history_rewrite") or flags.get("invent_citations") or flags.get("publish_as_truth") or flags.get("mesh_enable"):
        return "REFUSE"
    if missing_claim:
        return "REFUSE"
    if primary_score is None or alternate_score is None:
        return "REFUSE"
    delta = abs(primary_score - alternate_score)
    high_conf_no_ev = (primary_score >= HIGH_CONF and not primary_has_ev) or (
        alternate_score >= HIGH_CONF and not alternate_has_ev
    )
    if high_conf_no_ev and delta > 0.15:
        return "NEUTRALIZE"
    if high_conf_no_ev:
        return "FLAG"
    if delta > NEUTRALIZE_DELTA:
        return "NEUTRALIZE"
    if delta > PASS_DELTA or not primary_has_ev or not alternate_has_ev:
        return "FLAG"
    return "PASS"


def _receipt(
    payload: dict[str, Any],
    *,
    primary: dict[str, Any],
    alternate: dict[str, Any],
    primary_score: float | None,
    alternate_score: float | None,
    verdict: str,
    action: str,
) -> dict[str, Any]:
    claim = str(payload.get("claim") or "").strip()
    pe = evidence_of(primary)
    ae = evidence_of(alternate)
    delta = None
    if primary_score is not None and alternate_score is not None:
        delta = round(abs(primary_score - alternate_score), 6)
    card = {
        "product": PRODUCT,
        "spec": SPEC,
        "version": VERSION,
        "author": AUTHOR,
        "claim": claim,
        "primary_path": path_label(primary, "primary"),
        "alternate_path": path_label(alternate, "alternate"),
        "primary_score": primary_score,
        "alternate_score": alternate_score,
        "delta": delta,
        "verdict": verdict,
        "evidence_primary": pe,
        "evidence_alternate": ae,
        "invented_evidence": False,
        "confidence_is_not_truth": True,
        "advisory": True,
    }
    card["receipt_hash"] = digest(card)
    ok = verdict != "REFUSE"
    note = {
        "PASS": "Primary and alternate agree within PASS_DELTA. Advisory only. Confidence is not truth.",
        "FLAG": "Scores diverge or evidence is thin. Review before acting. Confidence is not truth.",
        "NEUTRALIZE": "Hallucination pattern or large score split. Neutralize the score as advisory — do not treat it as truth.",
        "REFUSE": "Refused. Missing claim/scores, or a stub verb (history rewrite / invent citations / publish-as-truth / mesh enable).",
    }[verdict]
    return {
        "ok": ok,
        "action": action,
        "product": PRODUCT,
        "slug": SLUG,
        "spec": SPEC,
        "version": VERSION,
        "author": AUTHOR,
        "motto": MOTTO,
        "role": ROLE,
        "door": "fraggate",
        "kv_increment": False,
        "advisory": True,
        "confidence_is_not_truth": True,
        "invented_evidence": False,
        "peers": {
            "az_clce": {"github": PEER_AZ_CLCE, "note": "R/D/P inconsistency, not intent. Do not merge."},
            "akm_triad": {"spec": PEER_AKM, "note": "LIVE fabric memory on aziel-runtime. Not a Softwares slug. Do not merge."},
        },
        "thresholds": {
            "pass_delta": PASS_DELTA,
            "neutralize_delta": NEUTRALIZE_DELTA,
            "high_conf": HIGH_CONF,
        },
        "verdict": verdict,
        "delta": delta,
        "primary_score": primary_score,
        "alternate_score": alternate_score,
        "claim": claim,
        "note": note,
        "honest": HONEST,
        "receipt": card,
        "live_ops": list(LIVE_OPS),
        "stub_ops": list(STUB_OPS),
    }


def _paths(payload: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    primary = payload.get("primary") if isinstance(payload.get("primary"), dict) else {}
    alternate = payload.get("alternate") if isinstance(payload.get("alternate"), dict) else {}
    if payload.get("primary_score") is not None and "score" not in primary:
        primary = {**primary, "score": payload.get("primary_score")}
    if payload.get("alternate_score") is not None and "score" not in alternate:
        alternate = {**alternate, "score": payload.get("alternate_score")}
    if payload.get("primary_evidence") and not evidence_of(primary):
        primary = {**primary, "evidence": _as_list(payload.get("primary_evidence"))}
    if payload.get("alternate_evidence") and not evidence_of(alternate):
        alternate = {**alternate, "evidence": _as_list(payload.get("alternate_evidence"))}
    if payload.get("primary_path") and not primary.get("path"):
        primary = {**primary, "path": payload.get("primary_path")}
    if payload.get("alternate_path") and not alternate.get("path"):
        alternate = {**alternate, "path": payload.get("alternate_path")}
    return primary, alternate


def health() -> dict[str, Any]:
    return {
        "ok": True,
        "product": PRODUCT,
        "slug": SLUG,
        "version": VERSION,
        "author": AUTHOR,
        "role": ROLE,
        "motto": MOTTO,
        "spec": SPEC,
        "class": "Plain",
        "door": "fraggate",
        "kv_increment": False,
        "live_ops": list(LIVE_OPS),
        "stub_ops": list(STUB_OPS),
        "confidence_is_not_truth": True,
        "mesh_default_off": True,
        "mesh_get_never_enables": True,
        "note": "Hosted /v1 does not increment downloads. FragGate LIVE_OPS: health, skill, doctor, verify, review_triad, alternate_score, coherence_check, neutralize_hallucination. Suite mesh /v1/mesh/* PROXY. Default OFF. GET never enables.",
        "honest": HONEST,
    }


def doctor() -> dict[str, Any]:
    return {
        "ok": True,
        "product": PRODUCT,
        "slug": SLUG,
        "version": VERSION,
        "author": AUTHOR,
        "identity": "Aziel Eliab only",
        "spec": SPEC,
        "network": False,
        "worker_local": False,
        "fraggate_live": True,
        "invariants": {
            "I1": "Never invent evidence or citations.",
            "I2": "Confidence is not truth.",
            "I3": "Do not merge AZ-CLCE or AKM-TRIAD-1.0.",
            "I4": "History rewrite / invent citations / publish-as-truth / mesh enable refuse.",
            "I5": "Receipts are PASS / FLAG / NEUTRALIZE / REFUSE.",
            "I6": "Mesh GET never enables. Mesh default OFF.",
        },
        "live_ops": list(LIVE_OPS),
        "stub_ops": list(STUB_OPS),
        "note": "Doctor is a FragGate LIVE_OPS self-check. No writes. No invented evidence.",
    }


def alternate_score(payload: dict[str, Any] | None = None) -> dict[str, Any]:
    body = payload or {}
    if body.get("invent_citations") or body.get("invent"):
        return refuse_stub("invent_citations")
    claim = str(body.get("claim") or "").strip()
    evidence = _as_list(body.get("evidence") or body.get("citations") or body.get("alternate_evidence"))
    if not evidence and isinstance(body.get("alternate"), dict):
        evidence = evidence_of(body["alternate"])
    if not evidence:
        raise RefuseError("alternate_score refuses to invent a score without evidence. Confidence is not truth.")
    if not claim:
        raise RefuseError("claim is required")
    score = round(jaccard(tokenize(claim), tokenize(" ".join(evidence))), 6)
    primary, alternate = _paths(body)
    alternate = {**alternate, "score": score, "evidence": evidence, "path": path_label(alternate, "independent")}
    primary_score = normalize_score(primary.get("score"))
    if primary_score is None:
        # Independent path only — still emit a receipt with alternate.
        primary = {**primary, "score": None}
    flags = _flags_from_payload(body)
    verdict = decide_verdict(
        primary_score if primary_score is not None else score,
        score,
        has_evidence(primary) if primary_score is not None else True,
        True,
        flags,
        missing_claim=False,
    )
    if primary_score is None:
        verdict = "FLAG" if score < HIGH_CONF else "FLAG"
        # Independent score alone cannot PASS as a double-check.
        verdict = "FLAG"
    return {
        **_receipt(
            body,
            primary=primary,
            alternate=alternate,
            primary_score=primary_score,
            alternate_score=score,
            verdict=verdict,
            action="alternate_score",
        ),
        "method": "token_jaccard_claim_vs_provided_evidence",
        "note": "Alternate score is computed only from provided evidence. Never invented. Independent of AZ-CLCE and AKM-TRIAD. Advisory.",
    }


def coherence_check(payload: dict[str, Any] | None = None) -> dict[str, Any]:
    body = payload or {}
    flags = _flags_from_payload(body)
    if flags["history_rewrite"]:
        return refuse_stub("history_rewrite")
    if flags["invent_citations"]:
        return refuse_stub("invent_citations")
    if flags["publish_as_truth"]:
        return refuse_stub("publish_as_truth")
    if flags["mesh_enable"]:
        return refuse_stub("mesh_enable")
    primary, alternate = _paths(body)
    ps = normalize_score(primary.get("score"))
    als = normalize_score(alternate.get("score"))
    claim = str(body.get("claim") or "").strip()
    verdict = decide_verdict(ps, als, has_evidence(primary), has_evidence(alternate), flags, missing_claim=not claim)
    return _receipt(
        body,
        primary=primary,
        alternate=alternate,
        primary_score=ps,
        alternate_score=als,
        verdict=verdict,
        action="coherence_check",
    )


def review_triad(payload: dict[str, Any] | None = None) -> dict[str, Any]:
    body = payload or {}
    flags = _flags_from_payload(body)
    if flags["history_rewrite"]:
        return refuse_stub("history_rewrite")
    if flags["invent_citations"]:
        return refuse_stub("invent_citations")
    if flags["publish_as_truth"]:
        return refuse_stub("publish_as_truth")
    if flags["mesh_enable"]:
        return refuse_stub("mesh_enable")
    primary, alternate = _paths(body)
    legs = primary.get("legs") if isinstance(primary.get("legs"), dict) else body.get("legs")
    # Optional triad legs (E/C/P/B or R/D/P) — reviewed, not merged with AZ-CLCE / AKM.
    if isinstance(legs, dict) and primary.get("score") is None:
        nums = [normalize_score(legs.get(k)) for k in ("e", "c", "p", "b", "r", "d") if legs.get(k) is not None]
        nums = [n for n in nums if n is not None]
        if nums:
            primary = {**primary, "score": round(sum(nums) / len(nums), 6)}
    if not alternate.get("score") and (evidence_of(alternate) or body.get("evidence")):
        alt = alternate_score({
            "claim": body.get("claim"),
            "evidence": evidence_of(alternate) or body.get("evidence"),
            "alternate": alternate,
            "primary": primary,
        })
        alternate = {**alternate, "score": alt["alternate_score"], "evidence": evidence_of(alternate) or _as_list(body.get("evidence"))}
    ps = normalize_score(primary.get("score"))
    als = normalize_score(alternate.get("score"))
    claim = str(body.get("claim") or "").strip()
    verdict = decide_verdict(ps, als, has_evidence(primary), has_evidence(alternate), flags, missing_claim=not claim)
    out = _receipt(
        body,
        primary=primary,
        alternate=alternate,
        primary_score=ps,
        alternate_score=als,
        verdict=verdict,
        action="review_triad",
    )
    if isinstance(legs, dict):
        out["legs"] = legs
        out["legs_note"] = "Legs are reviewed as provided. AZCoherence does not run AZ-CLCE or AKM-TRIAD."
    return out


def neutralize_hallucination(payload: dict[str, Any] | None = None) -> dict[str, Any]:
    body = payload or {}
    if body.get("publish_as_truth") or body.get("as_truth"):
        return refuse_stub("publish_as_truth")
    reviewed = review_triad(body)
    if reviewed.get("verdict") == "REFUSE":
        return reviewed
    if reviewed.get("verdict") in ("NEUTRALIZE", "FLAG"):
        reviewed["action"] = "neutralize_hallucination"
        reviewed["neutralized"] = True
        reviewed["advisory"] = True
        reviewed["publish_as_truth"] = False
        reviewed["note"] = (
            "Advisory neutralize. Treat the primary score as non-authoritative. "
            "Do not publish as truth. Do not invent replacement citations. Confidence is not truth."
        )
        return reviewed
    reviewed["action"] = "neutralize_hallucination"
    reviewed["neutralized"] = False
    reviewed["note"] = (
        "No neutralize required. Verdict is PASS — still advisory. Confidence is not truth."
    )
    return reviewed


def verify_receipt(payload: dict[str, Any] | None = None) -> dict[str, Any]:
    body = payload or {}
    rec = body.get("receipt") if isinstance(body.get("receipt"), dict) else body
    if not isinstance(rec, dict) or not rec:
        raise RefuseError("receipt object required")
    expected = digest(rec)
    given = str(rec.get("receipt_hash") or body.get("receipt_hash") or "").strip()
    ok = bool(given) and given == expected
    return {
        "ok": ok,
        "action": "verify",
        "product": PRODUCT,
        "slug": SLUG,
        "spec": SPEC,
        "version": VERSION,
        "author": AUTHOR,
        "expected_hash": expected,
        "given_hash": given or None,
        "match": ok,
        "confidence_is_not_truth": True,
        "advisory": True,
        "invented_evidence": False,
        "note": "Hash walk over canonical receipt fields. Does not invent evidence. Does not rewrite history.",
    }


def dispatch(op: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    name = (op or "").strip().replace("-", "_")
    if name in STUB_OPS:
        return refuse_stub(name)
    if name == "health":
        return health()
    if name == "doctor":
        return doctor()
    if name == "review_triad":
        return review_triad(payload)
    if name == "alternate_score":
        return alternate_score(payload)
    if name == "coherence_check":
        return coherence_check(payload)
    if name == "neutralize_hallucination":
        return neutralize_hallucination(payload)
    if name == "verify":
        return verify_receipt(payload)
    raise RefuseError(f"unknown op: {op}")
