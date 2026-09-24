"""Local loopback UI. JSON routes stay intact."""

from __future__ import annotations

import json
import threading
from urllib.request import Request, urlopen

from azcoherence.engine import review_triad
from azcoherence.ui import Handler, ThreadingHTTPServer, page_html, wants_json


def test_page_is_human_and_themeable() -> None:
    html = page_html()
    assert "prefers-color-scheme" in html
    assert ":focus-visible" in html
    assert 'id="advanced"' in html
    assert 'id="review"' in html
    assert "__HONEST_JSON__" not in html
    assert html.index('id="advanced"') < html.index('id="alternate"')
    assert "Aziel Eliab" in html
    assert html.index("<h1>") < html.index('id="notes"')


def test_accept_json_only_when_asked() -> None:
    assert wants_json("application/json")
    assert wants_json("application/json, text/plain")
    assert not wants_json("text/html,application/xhtml+xml")
    assert not wants_json("*/*")
    assert not wants_json(None)


def test_loopback_json_review_matches_engine() -> None:
    httpd = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    port = httpd.server_address[1]
    payload = {
        "claim": "login succeeds",
        "primary_score": 0.91,
        "alternate_score": 0.88,
        "primary_evidence": ["cite A"],
        "alternate_evidence": ["cite B"],
    }
    try:
        page = urlopen(f"http://127.0.0.1:{port}/", timeout=5)
        assert "text/html" in page.headers.get("Content-Type", "")
        body = page.read().decode("utf-8")
        assert "Review a score" in body

        req = Request(f"http://127.0.0.1:{port}/", headers={"Accept": "application/json"})
        health_body = json.loads(urlopen(req, timeout=5).read().decode("utf-8"))
        assert health_body["slug"] == "azcoherence"
        assert health_body["ok"] is True

        post = Request(
            f"http://127.0.0.1:{port}/v1/review_triad",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        reviewed = json.loads(urlopen(post, timeout=5).read().decode("utf-8"))
        assert reviewed == review_triad(payload)
    finally:
        httpd.shutdown()
        thread.join(timeout=3)
