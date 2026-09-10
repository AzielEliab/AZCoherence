"""AZCoherence errors. Author: Aziel Eliab only."""

from __future__ import annotations


class AzCoherenceError(Exception):
    """Base error."""


class RefuseError(AzCoherenceError):
    """Invariant refuse — write nothing as truth."""


class StubError(AzCoherenceError):
    """Named stub op (history rewrite, invent citations, publish-as-truth, mesh enable)."""
