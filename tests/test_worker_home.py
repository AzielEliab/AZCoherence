"""Worker homepage is AZCoherence software, not a downloads shell."""

from __future__ import annotations

from pathlib import Path

HOME = Path("workers/download-tracker/src/home.js").read_text(encoding="utf-8")
INDEX = Path("workers/download-tracker/src/index.js").read_text(encoding="utf-8")


def test_title_is_product_not_downloads_shell() -> None:
    assert "AZCoherence — Aziel Eliab" in HOME
    assert "AZCoherence downloads" not in HOME


def test_seo_and_softwareapplication_json_ld() -> None:
    assert "application/ld+json" in HOME
    assert "SoftwareApplication" in HOME
    assert "Aziel Eliab" in HOME
    assert "cite.json" in HOME
    assert "sitemap.xml" in HOME
    assert "Everblooming sigil" in HOME
    assert "/sigil.png" in HOME


def test_workspace_calls_real_ops() -> None:
    for path in (
        "/v1/review_triad",
        "/v1/alternate_score",
        "/v1/coherence_check",
        "/v1/neutralize_hallucination",
        "/v1/verify",
        "/v1/health",
        "/v1/skill",
        "/v1/doctor",
    ):
        assert path in HOME
    assert "btn-review" in HOME
    assert "btn-alt" in HOME
    assert "btn-check" in HOME
    assert "btn-neu" in HOME
    assert "btn-verify" in HOME
    assert "btn-health" in HOME
    assert "btn-skill" in HOME
    assert "btn-doctor" in HOME
    assert "Use UI" in HOME or "Coherence workspace" in HOME


def test_download_install_and_identity_remain() -> None:
    assert "/download?asset=" in HOME
    assert "azcoherence-0.1.0.tar.gz" in HOME
    assert "One-click install" in HOME
    assert "Aziel Eliab only" in HOME
    assert "Apache-2.0" in HOME
    assert "Forks welcome" in HOME or "Forks are welcome" in HOME


def test_no_invented_or_live_zenodo_identifier() -> None:
    assert "identifier:" not in HOME.split("export function jsonLd")[1].split("export function handleSeoRoutes")[0]
    assert "No DOI is invented here" in HOME
    assert "DOI =" not in INDEX
    assert "ZENODO =" not in INDEX


def test_worker_serves_home_and_seo() -> None:
    assert "renderHome" in INDEX
    assert "handleSeoRoutes" in INDEX
    assert 'url.pathname === "/"' in INDEX
    assert "/download" in INDEX
    assert "function totalKey()" in INDEX
    assert "ASSETS.fetch" in INDEX or "env.ASSETS" in INDEX


def test_count_returns_views_downloads_and_total() -> None:
    assert 'url.pathname === "/count"' in INDEX
    assert "views: stats.views || 0" in INDEX
    assert "downloads: stats.downloads || 0" in INDEX
    assert "total: stats.total || 0" in INDEX
    assert "json({ project: PROJECT, total: stats.total || 0 })" not in INDEX
    assert "function viewsKey()" in INDEX
    assert "downloads: shown" in INDEX
