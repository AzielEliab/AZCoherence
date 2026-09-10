/**
 * AZCoherence engine — primary triad vs alternate independent path.
 * Receipts: PASS / FLAG / NEUTRALIZE / REFUSE.
 * Never invent evidence. Confidence ≠ truth.
 * Does not merge AZ-CLCE or AKM-TRIAD-1.0.
 * Author: Aziel Eliab only.
 */

export const PRODUCT = "azcoherence";
export const SLUG = "azcoherence";
export const VERSION = "0.1.0";
export const SPEC = "AZC-WP-0.1";
export const AUTHOR = "Aziel Eliab";
export const MOTTO = "Coherence reviewer — alternate triad vs primary score. Confidence is not truth.";
export const ROLE = "alternate-triad coherence reviewer";
export const CLASS = "Plain";

export const LIVE_OPS = Object.freeze([
  "health",
  "skill",
  "doctor",
  "verify",
  "review_triad",
  "alternate_score",
  "coherence_check",
  "neutralize_hallucination",
]);

export const STUB_OPS = Object.freeze([
  "history_rewrite",
  "invent_citations",
  "publish_as_truth",
  "mesh_enable",
]);

export const PASS_DELTA = 0.08;
export const NEUTRALIZE_DELTA = 0.25;
export const HIGH_CONF = 0.80;

export const HASH_FIELDS = Object.freeze([
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
]);

export const HONEST =
  "THIS IS: an advisory coherence reviewer (AZC-WP-0.1). Primary triad/claim+score versus an alternate independent path. Receipts are PASS / FLAG / NEUTRALIZE / REFUSE. THIS IS NOT: AZ-CLCE (R/D/P inconsistency, not intent), not AKM-TRIAD-1.0 fabric memory, not a truth verdict, not a citation inventor, not a history rewrite, not publish-as-truth. Confidence is not truth. Never invent evidence. Author Aziel Eliab only.";

export const PEERS = Object.freeze({
  aziel_runtime: {
    role: "catalog + FragGate door",
    github: "https://github.com/AzielEliab/aziel-runtime",
    paths: ["/v1/fraggate/list", "/v1/fraggate/describe", "/v1/fraggate/call", "/v1/software", "/mcp"],
    merge: false,
  },
  az_clce: { slug: "azclce", github: "https://github.com/AzielEliab/az-clce", note: "Peer scorer. R/D/P inconsistency, not intent. Do not merge." },
  akm_triad: { spec: "AKM-TRIAD-1.0", note: "LIVE fabric memory on aziel-runtime. Fabric neighbor — cite only. Not a Softwares slug. Do not merge." },
  azinterface: { slug: "azinterface", github: "https://github.com/AzielEliab/azinterface", note: "Custodial OE. Do not merge." },
  hubs: {
    azieleliab: "https://www.azieleliab.com/",
    azielcorpuslibrary: "https://www.azielcorpuslibrary.net/",
    godlock: "https://godlock.uk/",
  },
});

const STUB_MESSAGES = {
  history_rewrite: "AZC-REFUSE: history rewrite is stub. Receipts are forward-only. Do not alter a prior score as if it never existed.",
  invent_citations: "AZC-REFUSE: invent citations is stub. Never invent evidence. Provide citations or receive FLAG / REFUSE.",
  publish_as_truth: "AZC-REFUSE: publish-as-truth is stub. A coherence receipt is advisory. Confidence is not truth.",
  mesh_enable: "AZC-REFUSE: mesh enable is stub on this product. GET /v1/mesh never enables. Suite mesh default OFF. FragGate slug=mesh is fabric, not this Softwares product.",
};

export class RefuseError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "RefuseError";
  }
}

function asList(value) {
  if (value == null) return [];
  if (typeof value === "string") {
    const text = value.trim();
    return text ? [text] : [];
  }
  if (Array.isArray(value)) {
    return value.map((item) => (item == null ? "" : String(item).trim())).filter(Boolean);
  }
  return [];
}

export function normalizeScore(value) {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  let out = n;
  if (out > 1 && out <= 100) out = out / 100;
  if (out < 0) return 0;
  if (out > 1) return 1;
  return out;
}

export function evidenceOf(path) {
  const src = path && typeof path === "object" ? path : {};
  const ev = asList(src.evidence);
  if (ev.length) return ev;
  return asList(src.citations);
}

export function hasEvidence(path) {
  return evidenceOf(path).length > 0;
}

export function tokenize(text) {
  const out = new Set();
  let buf = "";
  const src = String(text || "").toLowerCase();
  for (const ch of src) {
    if (/[a-z0-9]/.test(ch)) buf += ch;
    else if (buf) {
      out.add(buf);
      buf = "";
    }
  }
  if (buf) out.add(buf);
  return out;
}

export function jaccard(a, b) {
  if (!a.size && !b.size) return 0;
  const union = new Set([...a, ...b]);
  if (!union.size) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  return inter / union.size;
}

function pathLabel(path, fallback) {
  const src = path && typeof path === "object" ? path : {};
  const raw = src.path || src.source || fallback;
  const text = String(raw || "").trim();
  return text || fallback;
}

export function refuseStub(op) {
  const key = String(op || "").trim().replace(/-/g, "_");
  if (!STUB_OPS.includes(key)) throw new RefuseError("unknown stub");
  return {
    ok: false,
    verdict: "REFUSE",
    code: "AZC-REFUSE",
    stub: true,
    op: key,
    product: PRODUCT,
    spec: SPEC,
    version: VERSION,
    author: AUTHOR,
    advisory: true,
    confidence_is_not_truth: true,
    invented_evidence: false,
    error: STUB_MESSAGES[key],
    door: "fraggate",
    slug: SLUG,
  };
}

function flagsFrom(payload) {
  const p = payload && typeof payload === "object" ? payload : {};
  return {
    history_rewrite: !!(p.history_rewrite || p.rewrite_history),
    invent_citations: !!(p.invent_citations || p.invent),
    publish_as_truth: !!(p.publish_as_truth || p.as_truth),
    mesh_enable: !!(p.mesh_enable || p.enable_mesh),
  };
}

export function decideVerdict(primaryScore, alternateScore, primaryHasEv, alternateHasEv, flags, missingClaim) {
  const f = flags || {};
  if (f.history_rewrite || f.invent_citations || f.publish_as_truth || f.mesh_enable) return "REFUSE";
  if (missingClaim) return "REFUSE";
  if (primaryScore == null || alternateScore == null) return "REFUSE";
  const delta = Math.abs(primaryScore - alternateScore);
  const highConfNoEv = (primaryScore >= HIGH_CONF && !primaryHasEv) || (alternateScore >= HIGH_CONF && !alternateHasEv);
  if (highConfNoEv && delta > 0.15) return "NEUTRALIZE";
  if (highConfNoEv) return "FLAG";
  if (delta > NEUTRALIZE_DELTA) return "NEUTRALIZE";
  if (delta > PASS_DELTA || !primaryHasEv || !alternateHasEv) return "FLAG";
  return "PASS";
}

async function sha256Hex(bytes) {
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function canonicalObject(data) {
  const out = {};
  for (const key of HASH_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(data || {}, key)) out[key] = data[key];
  }
  return out;
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  const keys = Object.keys(value).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
}

export async function digest(data) {
  const obj = canonicalObject(data);
  return sha256Hex(new TextEncoder().encode(stableStringify(obj)));
}

const NOTES = {
  PASS: "Primary and alternate agree within PASS_DELTA. Advisory only. Confidence is not truth.",
  FLAG: "Scores diverge or evidence is thin. Review before acting. Confidence is not truth.",
  NEUTRALIZE: "Hallucination pattern or large score split. Neutralize the score as advisory — do not treat it as truth.",
  REFUSE: "Refused. Missing claim/scores, or a stub verb (history rewrite / invent citations / publish-as-truth / mesh enable).",
};

function paths(payload) {
  const p = payload && typeof payload === "object" ? payload : {};
  let primary = p.primary && typeof p.primary === "object" ? { ...p.primary } : {};
  let alternate = p.alternate && typeof p.alternate === "object" ? { ...p.alternate } : {};
  if (p.primary_score != null && primary.score == null) primary.score = p.primary_score;
  if (p.alternate_score != null && alternate.score == null) alternate.score = p.alternate_score;
  if (p.primary_evidence && !evidenceOf(primary).length) primary.evidence = asList(p.primary_evidence);
  if (p.alternate_evidence && !evidenceOf(alternate).length) alternate.evidence = asList(p.alternate_evidence);
  if (p.primary_path && !primary.path) primary.path = p.primary_path;
  if (p.alternate_path && !alternate.path) alternate.path = p.alternate_path;
  return { primary, alternate };
}

async function receipt(payload, { primary, alternate, primaryScore, alternateScore, verdict, action }) {
  const claim = String((payload && payload.claim) || "").trim();
  const pe = evidenceOf(primary);
  const ae = evidenceOf(alternate);
  let delta = null;
  if (primaryScore != null && alternateScore != null) delta = Math.round(Math.abs(primaryScore - alternateScore) * 1e6) / 1e6;
  const card = {
    product: PRODUCT,
    spec: SPEC,
    version: VERSION,
    author: AUTHOR,
    claim,
    primary_path: pathLabel(primary, "primary"),
    alternate_path: pathLabel(alternate, "alternate"),
    primary_score: primaryScore,
    alternate_score: alternateScore,
    delta,
    verdict,
    evidence_primary: pe,
    evidence_alternate: ae,
    invented_evidence: false,
    confidence_is_not_truth: true,
    advisory: true,
  };
  card.receipt_hash = await digest(card);
  return {
    ok: verdict !== "REFUSE",
    action,
    product: PRODUCT,
    slug: SLUG,
    spec: SPEC,
    version: VERSION,
    author: AUTHOR,
    motto: MOTTO,
    role: ROLE,
    door: "fraggate",
    kv_increment: false,
    advisory: true,
    confidence_is_not_truth: true,
    invented_evidence: false,
    peers: PEERS,
    thresholds: { pass_delta: PASS_DELTA, neutralize_delta: NEUTRALIZE_DELTA, high_conf: HIGH_CONF },
    verdict,
    delta,
    primary_score: primaryScore,
    alternate_score: alternateScore,
    claim,
    note: NOTES[verdict],
    honest: HONEST,
    receipt: card,
    live_ops: LIVE_OPS.slice(),
    stub_ops: STUB_OPS.slice(),
  };
}

export function health(meshPointer) {
  return {
    ok: true,
    product: PRODUCT,
    slug: SLUG,
    version: VERSION,
    author: AUTHOR,
    role: ROLE,
    motto: MOTTO,
    spec: SPEC,
    class: CLASS,
    door: "fraggate",
    kv_increment: false,
    live_ops: LIVE_OPS.slice(),
    stub_ops: STUB_OPS.slice(),
    confidence_is_not_truth: true,
    mesh_default_off: true,
    mesh_get_never_enables: true,
    mesh: meshPointer || { pointer: true, enabled_default: false },
    note: "Hosted /v1 does not increment downloads. FragGate LIVE_OPS: health, skill, doctor, verify, review_triad, alternate_score, coherence_check, neutralize_hallucination. Suite mesh /v1/mesh/* PROXY. Default OFF. GET never enables.",
    honest: HONEST,
  };
}

export function doctor() {
  return {
    ok: true,
    product: PRODUCT,
    slug: SLUG,
    version: VERSION,
    author: AUTHOR,
    identity: "Aziel Eliab only",
    spec: SPEC,
    network: false,
    worker_local: false,
    fraggate_live: true,
    invariants: {
      I1: "Never invent evidence or citations.",
      I2: "Confidence is not truth.",
      I3: "Do not merge AZ-CLCE or AKM-TRIAD-1.0.",
      I4: "History rewrite / invent citations / publish-as-truth / mesh enable refuse.",
      I5: "Receipts are PASS / FLAG / NEUTRALIZE / REFUSE.",
      I6: "Mesh GET never enables. Mesh default OFF.",
    },
    live_ops: LIVE_OPS.slice(),
    stub_ops: STUB_OPS.slice(),
    note: "Doctor is a FragGate LIVE_OPS self-check. No writes. No invented evidence.",
  };
}

export async function alternateScore(payload) {
  const body = payload && typeof payload === "object" ? payload : {};
  if (body.invent_citations || body.invent) return refuseStub("invent_citations");
  const claim = String(body.claim || "").trim();
  let evidence = asList(body.evidence || body.citations || body.alternate_evidence);
  if (!evidence.length && body.alternate && typeof body.alternate === "object") evidence = evidenceOf(body.alternate);
  if (!evidence.length) throw new RefuseError("alternate_score refuses to invent a score without evidence. Confidence is not truth.");
  if (!claim) throw new RefuseError("claim is required");
  const score = Math.round(jaccard(tokenize(claim), tokenize(evidence.join(" "))) * 1e6) / 1e6;
  const { primary, alternate } = paths(body);
  alternate.score = score;
  alternate.evidence = evidence;
  if (!alternate.path) alternate.path = "independent";
  const primaryScore = normalizeScore(primary.score);
  const flags = flagsFrom(body);
  let verdict = decideVerdict(
    primaryScore != null ? primaryScore : score,
    score,
    primaryScore != null ? hasEvidence(primary) : true,
    true,
    flags,
    false,
  );
  if (primaryScore == null) verdict = "FLAG";
  const out = await receipt(body, {
    primary,
    alternate,
    primaryScore,
    alternateScore: score,
    verdict,
    action: "alternate_score",
  });
  out.method = "token_jaccard_claim_vs_provided_evidence";
  out.note = "Alternate score is computed only from provided evidence. Never invented. Independent of AZ-CLCE and AKM-TRIAD. Advisory.";
  return out;
}

export async function coherenceCheck(payload) {
  const body = payload && typeof payload === "object" ? payload : {};
  const flags = flagsFrom(body);
  if (flags.history_rewrite) return refuseStub("history_rewrite");
  if (flags.invent_citations) return refuseStub("invent_citations");
  if (flags.publish_as_truth) return refuseStub("publish_as_truth");
  if (flags.mesh_enable) return refuseStub("mesh_enable");
  const { primary, alternate } = paths(body);
  const ps = normalizeScore(primary.score);
  const als = normalizeScore(alternate.score);
  const claim = String(body.claim || "").trim();
  const verdict = decideVerdict(ps, als, hasEvidence(primary), hasEvidence(alternate), flags, !claim);
  return receipt(body, { primary, alternate, primaryScore: ps, alternateScore: als, verdict, action: "coherence_check" });
}

export async function reviewTriad(payload) {
  const body = payload && typeof payload === "object" ? payload : {};
  const flags = flagsFrom(body);
  if (flags.history_rewrite) return refuseStub("history_rewrite");
  if (flags.invent_citations) return refuseStub("invent_citations");
  if (flags.publish_as_truth) return refuseStub("publish_as_truth");
  if (flags.mesh_enable) return refuseStub("mesh_enable");
  const { primary, alternate } = paths(body);
  const legs = primary.legs && typeof primary.legs === "object" ? primary.legs : body.legs;
  if (legs && typeof legs === "object" && primary.score == null) {
    const nums = ["e", "c", "p", "b", "r", "d"].map((k) => normalizeScore(legs[k])).filter((n) => n != null);
    if (nums.length) primary.score = Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 1e6) / 1e6;
  }
  if (alternate.score == null && (evidenceOf(alternate).length || body.evidence)) {
    const alt = await alternateScore({
      claim: body.claim,
      evidence: evidenceOf(alternate).length ? evidenceOf(alternate) : body.evidence,
      alternate,
      primary,
    });
    alternate.score = alt.alternate_score;
    if (!evidenceOf(alternate).length) alternate.evidence = asList(body.evidence);
  }
  const ps = normalizeScore(primary.score);
  const als = normalizeScore(alternate.score);
  const claim = String(body.claim || "").trim();
  const verdict = decideVerdict(ps, als, hasEvidence(primary), hasEvidence(alternate), flags, !claim);
  const out = await receipt(body, { primary, alternate, primaryScore: ps, alternateScore: als, verdict, action: "review_triad" });
  if (legs && typeof legs === "object") {
    out.legs = legs;
    out.legs_note = "Legs are reviewed as provided. AZCoherence does not run AZ-CLCE or AKM-TRIAD.";
  }
  return out;
}

export async function neutralizeHallucination(payload) {
  const body = payload && typeof payload === "object" ? payload : {};
  if (body.publish_as_truth || body.as_truth) return refuseStub("publish_as_truth");
  const reviewed = await reviewTriad(body);
  if (reviewed.verdict === "REFUSE") return reviewed;
  reviewed.action = "neutralize_hallucination";
  if (reviewed.verdict === "NEUTRALIZE" || reviewed.verdict === "FLAG") {
    reviewed.neutralized = true;
    reviewed.advisory = true;
    reviewed.publish_as_truth = false;
    reviewed.note = "Advisory neutralize. Treat the primary score as non-authoritative. Do not publish as truth. Do not invent replacement citations. Confidence is not truth.";
    return reviewed;
  }
  reviewed.neutralized = false;
  reviewed.note = "No neutralize required. Verdict is PASS — still advisory. Confidence is not truth.";
  return reviewed;
}

export async function verifyReceipt(payload) {
  const body = payload && typeof payload === "object" ? payload : {};
  const rec = body.receipt && typeof body.receipt === "object" ? body.receipt : body;
  if (!rec || typeof rec !== "object" || !Object.keys(rec).length) throw new RefuseError("receipt object required");
  const expected = await digest(rec);
  const given = String(rec.receipt_hash || body.receipt_hash || "").trim();
  const ok = !!given && given === expected;
  return {
    ok,
    action: "verify",
    product: PRODUCT,
    slug: SLUG,
    spec: SPEC,
    version: VERSION,
    author: AUTHOR,
    expected_hash: expected,
    given_hash: given || null,
    match: ok,
    confidence_is_not_truth: true,
    advisory: true,
    invented_evidence: false,
    note: "Hash walk over canonical receipt fields. Does not invent evidence. Does not rewrite history.",
  };
}

export async function dispatch(op, payload) {
  const name = String(op || "").trim().replace(/-/g, "_");
  if (STUB_OPS.includes(name)) return refuseStub(name);
  if (name === "health") return health();
  if (name === "doctor") return doctor();
  if (name === "review_triad") return reviewTriad(payload);
  if (name === "alternate_score") return alternateScore(payload);
  if (name === "coherence_check") return coherenceCheck(payload);
  if (name === "neutralize_hallucination") return neutralizeHallucination(payload);
  if (name === "verify") return verifyReceipt(payload);
  throw new RefuseError("unknown op: " + op);
}
