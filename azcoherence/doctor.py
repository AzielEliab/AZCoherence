"""Doctor self-check. FragGate LIVE_OPS. Author: Aziel Eliab only."""

from __future__ import annotations

from azcoherence.engine import doctor as engine_doctor


def run() -> dict:
    return engine_doctor()
