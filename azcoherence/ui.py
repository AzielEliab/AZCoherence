"""Localhost UI for AZCoherence. Binds 127.0.0.1. Author: Aziel Eliab only."""

from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import urlparse

from azcoherence import __version__
from azcoherence.engine import (
    HONEST,
    LIVE_OPS,
    dispatch,
    doctor,
    health,
)
from azcoherence.errors import AzCoherenceError

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8871
LOOPBACK = frozenset({"127.0.0.1", "localhost", "::1"})
MAX_BODY = 2 * 1024 * 1024

PAGE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AZCoherence</title>
<style>
  :root {
    --bg: #0b0b0b; --panel: #141414; --ink: #e8e0d0; --muted: #8a7219;
    --line: #2a2414; --gold: #c9a227; --focus: #e6d19a; --bad: #d4534b;
    --pass: #3dba7a;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; background: var(--bg); color: var(--ink);
    font-family: system-ui, "Segoe UI", sans-serif; line-height: 1.45;
  }
  body { max-width: 52rem; margin: 0 auto; padding: 2.1rem 1.2rem 4rem; }
  .tag {
    font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.72rem;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold);
  }
  h1 { font-size: 2rem; font-weight: 650; letter-spacing: 0.04em; margin: 0.35rem 0 0.25rem; }
  .motto { color: var(--gold); font-style: italic; margin: 0 0 0.85rem; font-size: 1.05rem; }
  .lede { color: #b8b09a; margin: 0 0 1.5rem; max-width: 44rem; }
  fieldset {
    border: 1px solid var(--line); border-radius: 10px; background: var(--panel);
    padding: 1.1rem 1.15rem 1.2rem; margin: 0 0 1rem;
  }
  legend {
    font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.72rem;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); padding: 0 0.4rem;
  }
  label { display: block; font-size: 0.92rem; margin: 0.85rem 0 0.3rem; }
  textarea, input[type="text"], input[type="number"] {
    width: 100%; padding: 0.55rem 0.65rem; border: 1px solid var(--line);
    border-radius: 6px; background: #101010; color: var(--ink); font: inherit;
  }
  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
  .actions { display: flex; gap: 0.65rem; flex-wrap: wrap; margin: 0.9rem 0 0; }
  button {
    font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.85rem;
    letter-spacing: 0.04em; padding: 0.65rem 1rem; border-radius: 8px;
    border: 1px solid var(--gold); background: var(--gold); color: var(--bg);
    cursor: pointer; font-weight: 650;
  }
  button.ghost { background: transparent; color: var(--ink); border-color: var(--line); }
  .banner {
    border: 1px solid #5c4a1a; background: #241c0d; color: #f0d78c;
    padding: 0.85rem 1rem; border-radius: 10px; margin: 0 0 1.15rem; font-size: 0.92rem;
  }
  .status { margin: 0 0 0.8rem; padding: 0.75rem 0.85rem; border-radius: 10px; border: 1px solid var(--line); }
  .status.ok { color: var(--pass); border-color: #2f6b48; }
  .status.bad { color: var(--bad); border-color: #7a2f2c; }
  pre { background: #101010; padding: 0.75rem 0.9rem; overflow: auto; border-radius: 8px; font-size: 0.78rem; }
</style>
</head>
<body>
  <p class="tag">AZC-WP-0.1 · Plain · Aziel Eliab</p>
  <h1>AZCoherence</h1>
  <p class="motto">Coherence reviewer — alternate triad vs primary score. Confidence is not truth.</p>
  <p class="lede">Loopback only. FragGate LIVE_OPS: review_triad, alternate_score, coherence_check, neutralize_hallucination, verify, doctor, health, skill. Never invent evidence. Does not merge AZ-CLCE or AKM-TRIAD-1.0.</p>
  <p class="banner">__HONEST__</p>
  <fieldset>
    <legend>Workspace</legend>
    <label>Claim</label>
    <textarea id="claim" rows="3" placeholder="The claim that was scored"></textarea>
    <div class="row2">
      <div>
        <label>Primary score (0–1 or 0–100)</label>
        <input id="primary_score" type="number" step="0.01" value="0.91">
        <label>Primary path</label>
        <input id="primary_path" type="text" value="primary">
        <label>Primary evidence (comma-separated citations)</label>
        <input id="primary_evidence" type="text" value="operator-provided cite A">
      </div>
      <div>
        <label>Alternate score (optional — leave blank to compute)</label>
        <input id="alternate_score" type="number" step="0.01">
        <label>Alternate path</label>
        <input id="alternate_path" type="text" value="independent">
        <label>Alternate evidence (required to score; never invented)</label>
        <input id="alternate_evidence" type="text" value="operator-provided cite B">
      </div>
    </div>
    <div class="actions">
      <button type="button" id="btn-review">Review triad</button>
      <button type="button" class="ghost" id="btn-alt">Alternate score</button>
      <button type="button" class="ghost" id="btn-check">Coherence check</button>
      <button type="button" class="ghost" id="btn-neu">Neutralize</button>
      <button type="button" class="ghost" id="btn-verify">Verify</button>
      <button type="button" class="ghost" id="btn-health">Health</button>
      <button type="button" class="ghost" id="btn-skill">Skill</button>
      <button type="button" class="ghost" id="btn-doctor">Doctor</button>
    </div>
  </fieldset>
  <div class="status" id="status">No receipt yet. Review triad writes the first advisory receipt.</div>
  <pre id="out">{}</pre>
  <script>
    function fields() {
      var alt = document.getElementById("alternate_score").value;
      return {
        claim: document.getElementById("claim").value,
        primary_score: Number(document.getElementById("primary_score").value),
        alternate_score: alt === "" ? null : Number(alt),
        primary_path: document.getElementById("primary_path").value,
        alternate_path: document.getElementById("alternate_path").value,
        primary_evidence: document.getElementById("primary_evidence").value,
        alternate_evidence: document.getElementById("alternate_evidence").value,
        evidence: document.getElementById("alternate_evidence").value
      };
    }
    var lastReceipt = null;
    function show(data) {
      document.getElementById("out").textContent = JSON.stringify(data, null, 2);
      var el = document.getElementById("status");
      var ok = data && data.ok !== false && data.verdict !== "REFUSE";
      el.className = "status " + (ok ? "ok" : "bad");
      el.textContent = (data && (data.verdict || data.action || data.error)) || "done";
      if (data && data.receipt) lastReceipt = data.receipt;
    }
    async function api(path, body) {
      var get = path === "/v1/health" || path === "/v1/skill" || path === "/v1/doctor";
      var res = await fetch(path, {
        method: get ? "GET" : "POST",
        headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" },
        body: get ? undefined : JSON.stringify(body || {})
      });
      if (path === "/v1/skill") return { ok: true, action: "skill", skill: await res.text() };
      return res.json();
    }
    document.getElementById("btn-review").onclick = async function () { show(await api("/v1/review_triad", fields())); };
    document.getElementById("btn-alt").onclick = async function () { show(await api("/v1/alternate_score", fields())); };
    document.getElementById("btn-check").onclick = async function () { show(await api("/v1/coherence_check", fields())); };
    document.getElementById("btn-neu").onclick = async function () { show(await api("/v1/neutralize_hallucination", fields())); };
    document.getElementById("btn-verify").onclick = async function () {
      show(await api("/v1/verify", { receipt: lastReceipt || {} }));
    };
    document.getElementById("btn-health").onclick = async function () { show(await api("/v1/health")); };
    document.getElementById("btn-skill").onclick = async function () { show(await api("/v1/skill")); };
    document.getElementById("btn-doctor").onclick = async function () { show(await api("/v1/doctor")); };
  </script>
</body>
</html>
""".replace("__HONEST__", HONEST.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


class Handler(BaseHTTPRequestHandler):
    server_version = "AZCoherence/" + __version__

    def log_message(self, fmt: str, *args: Any) -> None:
        sys_stderr = __import__("sys").stderr
        sys_stderr.write("azcoherence-ui: " + (fmt % args) + "\n")

    def _send(self, body: bytes, content_type: str, status: int = 200) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "private, no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _json(self, data: Any, status: int = 200) -> None:
        raw = json.dumps(data, indent=2, ensure_ascii=True).encode("utf-8")
        self._send(raw, "application/json; charset=utf-8", status)

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path.rstrip("/") or "/"
        if path == "/":
            self._send(PAGE.encode("utf-8"), "text/html; charset=utf-8")
            return
        if path == "/v1/health":
            self._json(health())
            return
        if path == "/v1/doctor":
            self._json(doctor())
            return
        if path == "/v1/skill":
            from pathlib import Path

            skill = Path(__file__).resolve().parents[1] / "SKILL.md"
            self._send(skill.read_text(encoding="utf-8").encode("utf-8"), "text/markdown; charset=utf-8")
            return
        self._json({"error": "not found", "live_ops": list(LIVE_OPS)}, 404)

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path.rstrip("/") or "/"
        length = int(self.headers.get("Content-Length") or "0")
        if length > MAX_BODY:
            self._json({"error": "payload too large"}, 413)
            return
        raw = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            self._json({"error": "JSON body required"}, 400)
            return
        op = path[4:] if path.startswith("/v1/") else ""
        try:
            self._json(dispatch(op, payload if isinstance(payload, dict) else {}))
        except AzCoherenceError as exc:
            self._json({"ok": False, "error": str(exc)}, 400)


def serve(host: str = DEFAULT_HOST, port: int = DEFAULT_PORT) -> None:
    if host not in LOOPBACK:
        raise ValueError("AZCoherence UI binds loopback only")
    httpd = ThreadingHTTPServer((host, port), Handler)
    print(f"AZCoherence UI http://{host}:{port}  (loopback only)")
    print("Author: Aziel Eliab. Confidence is not truth.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")
