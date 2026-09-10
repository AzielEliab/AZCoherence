"""Smoke a PASS review. Author: Aziel Eliab only."""

from azcoherence.engine import review_triad

if __name__ == "__main__":
    out = review_triad(
        {
            "claim": "login succeeds",
            "primary": {"score": 0.91, "path": "primary", "evidence": ["operator cite A"]},
            "alternate": {"score": 0.88, "path": "independent", "evidence": ["operator cite B"]},
        }
    )
    print(out["verdict"], out["receipt"]["receipt_hash"])
