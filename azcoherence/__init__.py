"""AZCoherence — alternate-triad double-check (AZC-WP-0.1).

Author: Aziel Eliab only.
"""

from __future__ import annotations

__version__ = "0.1.0"
__author__ = "Aziel Eliab"
SPEC = "AZC-WP-0.1"
SLUG = "azcoherence"
PRODUCT = "azcoherence"

from azcoherence.engine import (  # noqa: E402
    LIVE_OPS,
    STUB_OPS,
    VERDICTS,
    alternate_score,
    coherence_check,
    doctor,
    health,
    neutralize_hallucination,
    review_triad,
    verify_receipt,
)

__all__ = [
    "LIVE_OPS",
    "PRODUCT",
    "SLUG",
    "SPEC",
    "STUB_OPS",
    "VERDICTS",
    "__author__",
    "__version__",
    "alternate_score",
    "coherence_check",
    "doctor",
    "health",
    "neutralize_hallucination",
    "review_triad",
    "verify_receipt",
]
