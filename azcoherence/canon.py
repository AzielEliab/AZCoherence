"""Canonical encoding for AZCoherence receipts. Stdlib only.

Author: Aziel Eliab only.
"""

from __future__ import annotations

import hashlib
import json
from typing import Any

SPEC = "AZC-WP-0.1"
PRODUCT = "azcoherence"
AUTHOR = "Aziel Eliab"

HASH_FIELDS = (
    "advisory",
    "alternate_path",
    "alternate_score",
    "author",
    "claim",
    "confidence_is_not_truth",
    "delta",
    "evidence_alternate",
    "evidence_primary",
    "invented_evidence",
    "primary_path",
    "primary_score",
    "product",
    "spec",
    "verdict",
    "version",
)


def canonical_object(data: dict[str, Any]) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for key in HASH_FIELDS:
        if key in data:
            out[key] = data[key]
    return out


def canonical_bytes(data: dict[str, Any]) -> bytes:
    obj = canonical_object(data)
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode("utf-8")


def digest(data: dict[str, Any]) -> str:
    return hashlib.sha256(canonical_bytes(data)).hexdigest()
