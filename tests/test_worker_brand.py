"""Public Worker UI mark is wordless. Aziel Eliab only.

Homepage /sigil.png uses empty alt and no Everblooming stamp/title.
Non-UI verify / skill identity strings stay unchanged.
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOME = (ROOT / "workers" / "download-tracker" / "src" / "home.js").read_text(
    encoding="utf-8"
)
ENGINE = (ROOT / "workers" / "download-tracker" / "src" / "engine.js").read_text(
    encoding="utf-8"
)
SKILL = (ROOT / "SKILL.md").read_text(encoding="utf-8")

BRAND_MARK = (
    '<img class="brandmark" src="/sigil.png" width="40" height="40" alt="" decoding="async">'
)


def _public_html(source: str) -> str:
    start = source.index("<!doctype html>")
    end = source.rindex("</html>") + len("</html>")
    return source[start:end]


def test_homepage_brandmark_is_wordless() -> None:
    assert 'class="brandrow"' in HOME
    assert BRAND_MARK in HOME
    assert 'src="/sigil.png"' in HOME
    assert 'alt=""' in HOME
    assert 'class="stamp"' not in HOME
    assert "Aziel Eliab" in HOME


def test_public_html_does_not_name_everblooming_on_the_mark() -> None:
    html = _public_html(HOME)
    assert "everblooming" not in html.lower()
    assert "Everblooming sigil" not in HOME
    assert 'alt="Everblooming sigil — Aziel Eliab"' not in HOME
    assert 'title="Home — everblooming sigil"' not in HOME
    assert "Everblooming sigil · Aziel Eliab" not in HOME
    assert "everblooming" not in BRAND_MARK.lower()


def test_non_ui_verify_and_identity_strings_stay() -> None:
    """Skill / engine verify contracts are not public mark copy."""
    assert "/v1/verify" in SKILL
    assert "Hash-walk a receipt" in SKILL
    assert "Author Aziel Eliab" in SKILL
    assert "name: AZCoherence" in SKILL
    assert "export async function verifyReceipt" in ENGINE
    assert '"verify"' in ENGINE
    assert "Author: Aziel Eliab only" in ENGINE
    assert "Aziel Eliab only" in HOME
    assert "/v1/verify" in HOME
