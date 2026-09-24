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
    color-scheme: light dark;
    --bg: #f7f4ec;
    --panel: #fffdf8;
    --ink: #1c1915;
    --muted: #5c5346;
    --line: #e4dcc8;
    --gold: #c9a227;
    --focus: #8a6a12;
    --gold-ink: #1c1608;
    --ok: #0f5c32;
    --ok-bg: #e8f6ee;
    --warn: #6a4b08;
    --warn-bg: #fbf3dd;
    --bad: #8d2a24;
    --bad-bg: #fdeceb;
    --shadow: 0 1px 0 rgba(28, 25, 21, 0.04);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #100f0c;
      --panel: #1b1a16;
      --ink: #f4efe4;
      --muted: #c8bfae;
      --line: #3c362c;
      --gold: #e6c65a;
      --focus: #e6c65a;
      --gold-ink: #1c1608;
      --ok: #9ee0b8;
      --ok-bg: #143024;
      --warn: #f0d78c;
      --warn-bg: #2a230f;
      --bad: #ffb4ab;
      --bad-bg: #3a1c1a;
      --shadow: none;
    }
  }
  * { box-sizing: border-box; }
  :focus { outline: none; }
  :focus-visible {
    outline: 3px solid var(--focus);
    outline-offset: 2px;
  }
  html, body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    font-size: 1rem;
    line-height: 1.5;
  }
  body { min-height: 100vh; }
  .wrap {
    max-width: 40rem;
    margin: 0 auto;
    padding: 1.75rem 1.15rem 3.5rem;
  }
  .product {
    margin: 0;
    font-size: 0.92rem;
    letter-spacing: 0.01em;
    color: var(--muted);
  }
  h1 {
    margin: 0.2rem 0 0.45rem;
    font-size: 1.85rem;
    font-weight: 650;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }
  .lede { margin: 0 0 1.35rem; color: var(--muted); max-width: 38rem; }
  form, .card, details {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 12px;
    box-shadow: var(--shadow);
  }
  form { padding: 1.05rem 1.05rem 1.15rem; }
  label { display: block; font-weight: 650; margin: 0.85rem 0 0.3rem; }
  label:first-child { margin-top: 0; }
  .hint { display: block; font-weight: 450; color: var(--muted); margin-top: 0.15rem; }
  input, textarea {
    width: 100%;
    margin-top: 0.35rem;
    padding: 0.7rem 0.75rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--bg);
    color: var(--ink);
    font: inherit;
  }
  textarea { min-height: 5.5rem; resize: vertical; }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1.15rem;
  }
  button {
    font: inherit;
    font-weight: 650;
    min-height: 2.75rem;
    padding: 0.65rem 1.05rem;
    border-radius: 8px;
    cursor: pointer;
  }
  button.primary {
    background: #c9a227;
    color: var(--gold-ink);
    border: 1px solid #c9a227;
  }
  button.ghost {
    background: transparent;
    color: var(--ink);
    border: 1px solid var(--line);
  }
  button.linkish {
    background: transparent;
    color: var(--ink);
    border: 0;
    padding: 0.35rem 0;
    min-height: 2.25rem;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 0.18em;
  }
  #result {
    margin-top: 1rem;
    padding: 1rem 1.05rem;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: var(--panel);
  }
  #result.ok { background: var(--ok-bg); border-color: transparent; color: var(--ok); }
  #result.warn { background: var(--warn-bg); border-color: transparent; color: var(--warn); }
  #result.bad { background: var(--bad-bg); border-color: transparent; color: var(--bad); }
  #result h2 { margin: 0 0 0.35rem; font-size: 1.35rem; letter-spacing: -0.02em; }
  #result p { margin: 0.25rem 0; overflow-wrap: anywhere; }
  #empty { margin: 1rem 0 0; color: var(--muted); }
  details { margin-top: 0.85rem; padding: 0.15rem 1rem 0.85rem; }
  summary {
    cursor: pointer;
    font-weight: 650;
    padding: 0.75rem 0;
  }
  .stack { display: grid; gap: 0.35rem; }
  pre {
    margin: 0.4rem 0 0;
    padding: 0.75rem;
    overflow: auto;
    max-width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
    background: var(--bg);
    border-radius: 8px;
    font-size: 0.84rem;
  }
  footer { margin-top: 1.4rem; color: var(--muted); font-size: 0.92rem; }
  @media (max-width: 420px) {
    .wrap { padding: 1.25rem 0.9rem 2.5rem; }
    h1 { font-size: 1.6rem; }
    .actions button { flex: 1 1 100%; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <p class="product">AZCoherence</p>
    <h1 id="title">Status</h1>
    <p class="lede">Coherence answers health and review_triad for the suite and for scripts. This page is an operator diagnostic.</p>
    <section id="result" aria-live="polite">
      <h2>Checking</h2>
      <p>Reading health on this computer.</p>
    </section>
    <div class="actions">
      <button type="button" class="primary" id="doctor">Doctor</button>
    </div>
    <p id="empty" hidden></p>
    <details id="advanced">
      <summary>Advanced</summary>
      <form id="review-form">
        <label for="claim">Claim</label>
        <textarea id="claim" name="claim" placeholder="The claim that was scored"></textarea>
        <label for="primary_score">Primary score <span class="hint">0 to 1, or 0 to 100</span></label>
        <input id="primary_score" name="primary_score" type="number" inputmode="decimal" step="0.01" placeholder="0.91">
        <label for="alternate_score">Alternate score <span class="hint">Leave blank to compute it from evidence you provide</span></label>
        <input id="alternate_score" name="alternate_score" type="number" inputmode="decimal" step="0.01" placeholder="0.88">
        <label for="primary_evidence">Primary evidence <span class="hint">Citations you already have, separated by commas</span></label>
        <input id="primary_evidence" name="primary_evidence" type="text" placeholder="Citation you already have">
        <label for="alternate_evidence">Alternate evidence <span class="hint">Required when the alternate score is blank</span></label>
        <input id="alternate_evidence" name="alternate_evidence" type="text" placeholder="Citation you already have">
        <label for="primary_path">Primary path</label>
        <input id="primary_path" type="text" value="primary">
        <label for="alternate_path">Alternate path</label>
        <input id="alternate_path" type="text" value="independent">
        <div class="actions">
          <button type="submit" class="ghost" id="review">Review</button>
          <button type="button" class="ghost" id="alternate">Alternate score</button>
          <button type="button" class="ghost" id="check">Coherence check</button>
          <button type="button" class="ghost" id="neutralize">Neutralize</button>
          <button type="button" class="ghost" id="verify">Verify receipt</button>
          <button type="button" class="ghost" id="health">Health</button>
          <button type="button" class="ghost" id="skill">Skill</button>
          <button type="button" class="linkish" id="fill">Fill example</button>
        </div>
      </form>
    </details>
    <details id="notes">
      <summary>Notes</summary>
      <p id="honest"></p>
      <p>Receipts are PASS, FLAG, NEUTRALIZE, or REFUSE. Author: Aziel Eliab.</p>
    </details>
    <footer>Author: Aziel Eliab. This page stays on this computer.</footer>
  </div>
  <noscript>Status is <code>azcoherence doctor</code>. This diagnostic page reads health with JavaScript.</noscript>
  <script>
    var HONEST = __HONEST_JSON__;
    document.getElementById("honest").textContent = HONEST;
    var lastReceipt = null;

    function csv(id) {
      return document.getElementById(id).value.split(",").map(function (part) {
        return part.trim();
      }).filter(Boolean);
    }
    function num(id) {
      var value = document.getElementById(id).value.trim();
      if (value === "") return null;
      var n = Number(value);
      return n === n ? n : null;
    }
    function fields() {
      return {
        claim: document.getElementById("claim").value,
        primary_score: num("primary_score"),
        alternate_score: num("alternate_score"),
        primary_path: document.getElementById("primary_path").value,
        alternate_path: document.getElementById("alternate_path").value,
        primary_evidence: csv("primary_evidence"),
        alternate_evidence: csv("alternate_evidence"),
        evidence: csv("alternate_evidence")
      };
    }
    function titleFor(data) {
      var verdict = data && data.verdict;
      if (verdict === "PASS") return "Pass";
      if (verdict === "FLAG") return "Flag";
      if (verdict === "NEUTRALIZE") return "Neutralize";
      if (verdict === "REFUSE") return "Refused";
      if (data && data.invariants) return data.ok ? "Doctor passed" : "Doctor failed";
      if (data && data.version && data.live_ops && !data.verdict) return "Running";
      if (data && data.skill) return "Skill notes";
      if (data && data.action === "verify") return data.match ? "Receipt matches" : "Receipt does not match";
      return "Done";
    }
    function bodyFor(data) {
      if (!data) return "No response.";
      if (data.skill) return data.skill;
      if (data.invariants) {
        var lines = [];
        Object.keys(data.invariants).forEach(function (key) {
          lines.push((data.ok ? "pass  " : "fail  ") + data.invariants[key]);
        });
        if (data.note) lines.push(data.note);
        return lines.join("\n");
      }
      if (data.version && data.live_ops && !data.verdict && !data.error) {
        return "AZCoherence " + data.version + " is running. Spec " + data.spec + ".";
      }
      var parts = [];
      var plain = {
        PASS: "These scores agree. The receipt is advisory.",
        FLAG: "The scores differ, or the evidence is thin. Look again before you rely on them.",
        NEUTRALIZE: "The scores split widely. Treat the primary score as not authoritative.",
        REFUSE: "This review was refused."
      }[data.verdict];
      if (plain) parts.push(plain);
      if (data.note) parts.push(data.note);
      if (data.error) parts.push(data.error);
      if (data.claim) parts.push("Claim: " + data.claim);
      if (data.primary_score !== undefined && data.primary_score !== null) parts.push("Primary score: " + data.primary_score);
      if (data.alternate_score !== undefined && data.alternate_score !== null) parts.push("Alternate score: " + data.alternate_score);
      if (data.delta !== undefined && data.delta !== null) parts.push("Difference: " + data.delta);
      if (data.receipt && data.receipt.receipt_hash) parts.push("Receipt hash: " + data.receipt.receipt_hash);
      return parts.join("\n") || "Done.";
    }
    function show(data) {
      var el = document.getElementById("result");
      var tone = "ok";
      if (!data || data.ok === false || data.verdict === "REFUSE") tone = "bad";
      else if (data.verdict === "FLAG" || data.verdict === "NEUTRALIZE") tone = "warn";
      el.hidden = false;
      el.className = tone;
      document.getElementById("empty").hidden = true;
      var pageTitle = titleFor(data);
      if (pageTitle === "Running" || pageTitle === "Doctor passed") {
        document.getElementById("title").textContent = "Running";
      } else if (pageTitle === "Doctor failed" || (data && data.ok === false && !data.verdict)) {
        document.getElementById("title").textContent = "Quiet";
      }
      var headingText = pageTitle;
      if (!data || (data.ok === false && !data.verdict)) headingText = "Quiet";
      var heading = document.createElement("h2");
      heading.textContent = headingText;
      var copy = document.createElement("p");
      copy.style.whiteSpace = "pre-wrap";
      copy.textContent = bodyFor(data);
      el.replaceChildren(heading, copy);
      if (data && data.receipt) lastReceipt = data.receipt;
    }
    async function api(path, body) {
      var get = path === "/v1/health" || path === "/v1/skill" || path === "/v1/doctor";
      var res = await fetch(path, {
        method: get ? "GET" : "POST",
        headers: { "content-type": "application/json", "accept": "application/json", "user-agent": "Mozilla/5.0" },
        body: get ? undefined : JSON.stringify(body || {})
      });
      if (path === "/v1/skill") return { ok: true, action: "skill", skill: await res.text() };
      return res.json();
    }
    document.getElementById("review-form").addEventListener("submit", async function (event) {
      event.preventDefault();
      try { show(await api("/v1/review_triad", fields())); }
      catch (err) { show({ ok: false, error: "Could not reach AZCoherence on this computer. Reload the page." }); }
    });
    document.getElementById("doctor").onclick = async function () {
      try { show(await api("/v1/doctor")); }
      catch (err) { show({ ok: false, error: "Could not reach AZCoherence on this computer. Reload the page." }); }
    };
    document.getElementById("alternate").onclick = async function () {
      try { show(await api("/v1/alternate_score", fields())); }
      catch (err) { show({ ok: false, error: "Could not reach AZCoherence on this computer. Reload the page." }); }
    };
    document.getElementById("check").onclick = async function () {
      try { show(await api("/v1/coherence_check", fields())); }
      catch (err) { show({ ok: false, error: "Could not reach AZCoherence on this computer. Reload the page." }); }
    };
    document.getElementById("neutralize").onclick = async function () {
      try { show(await api("/v1/neutralize_hallucination", fields())); }
      catch (err) { show({ ok: false, error: "Could not reach AZCoherence on this computer. Reload the page." }); }
    };
    document.getElementById("verify").onclick = async function () {
      if (!lastReceipt) {
        show({ ok: false, error: "Review first. Verify checks the receipt from that review." });
        return;
      }
      try { show(await api("/v1/verify", { receipt: lastReceipt })); }
      catch (err) { show({ ok: false, error: "Could not reach AZCoherence on this computer. Reload the page." }); }
    };
    document.getElementById("health").onclick = async function () {
      try { show(await api("/v1/health")); }
      catch (err) { show({ ok: false, error: "Could not reach AZCoherence on this computer. Reload the page." }); }
    };
    document.getElementById("skill").onclick = async function () {
      try { show(await api("/v1/skill")); }
      catch (err) { show({ ok: false, error: "Could not reach AZCoherence on this computer. Reload the page." }); }
    };
    document.getElementById("fill").onclick = function () {
      document.getElementById("claim").value = "login succeeds";
      document.getElementById("primary_score").value = "0.91";
      document.getElementById("alternate_score").value = "0.88";
      document.getElementById("primary_evidence").value = "operator-provided cite A";
      document.getElementById("alternate_evidence").value = "operator-provided cite B";
      document.getElementById("primary_path").value = "primary";
      document.getElementById("alternate_path").value = "independent";
    };
    api("/v1/health").then(show).catch(function () {
      show({ ok: false, error: "Quiet. Health did not answer on this computer." });
    });
  </script>
</body>
</html>
"""


def page_html() -> str:
    honest = json.dumps(HONEST, ensure_ascii=True)
    return PAGE.replace("__HONEST_JSON__", honest)


def wants_json(accept: str | None) -> bool:
    header = (accept or "").lower()
    if "text/html" in header:
        return False
    return "application/json" in header


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
            if wants_json(self.headers.get("Accept")):
                self._json(health())
                return
            self._send(page_html().encode("utf-8"), "text/html; charset=utf-8")
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
            try:
                text = skill.read_text(encoding="utf-8")
            except OSError:
                self._json({"ok": False, "error": "Skill notes are not in this install."}, 404)
                return
            self._send(text.encode("utf-8"), "text/markdown; charset=utf-8")
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


def serve(host: str = DEFAULT_HOST, port: int = DEFAULT_PORT, banner: str | None = None) -> None:
    if host not in LOOPBACK:
        raise ValueError("AZCoherence UI binds loopback only")
    httpd = ThreadingHTTPServer((host, port), Handler)
    line = banner or "Diagnostics http://{host}:{port}/"
    print(line.format(host=host, port=port))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
