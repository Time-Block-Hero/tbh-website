import { createHash } from "node:crypto";

export const SOURCE_REVISION_PATH = "data/card-design-source-revision.json";
// Reviewed identity/policy revisions are allowlisted independently of the source
// being exported. Editing a declaration alone must never authorize a deletion.
const APPROVED_REVISIONS = new Map([
  ["issue114-20261001", "ba92779ba5629c0b6877ce548c110f33db06f6bcf4fc1e4e5e3d1c6c264ddf7b"],
  ["issue100-20260930", "8bcae30230c94e544f9b8309c6aac5c0239a5f391758e2879ff51ba3b03d3e96"],
  ["issue78-20260927", "dbe4be3c2b106e0f9ad32f2b9b88bb073fb789ac1cfb978c4cc50cf859af157f"],
]);
const require = (condition, message) => { if (!condition) throw new Error(message); };
const canonical = (value) => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]))
    : value;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

export function validateSourceRevision(bytes, bridgeBytes, bridge, dataset, { requireInventory = true } = {}) {
  const revision = JSON.parse(bytes);
  require(revision?.schemaVersion === 1 && APPROVED_REVISIONS.has(revision.revisionId), "Unsupported source revision");
  require(hash(JSON.stringify(canonical(revision))) === APPROVED_REVISIONS.get(revision.revisionId), "Source revision differs from the approved identity/policy record");
  require(hash(bridgeBytes) === revision.identityBridgeSha256, "Source revision identity bridge hash mismatch");
  const baseline = new Map(bridge.cards.map((entry) => [entry.uid, entry.baselineDisplayId]));
  const deleted = new Set();
  for (const entry of revision.deletedBaselineCards) {
    require(baseline.get(entry.uid) === entry.baselineDisplayId && !deleted.has(entry.uid), "Source revision deleted identity mismatch");
    deleted.add(entry.uid);
  }
  const admitted = new Set(revision.admittedPreviouslyExcludedUids);
  require([...admitted].every((uid) => bridge.excludedUids.includes(uid)), "Source revision admission identity mismatch");
  const expected = new Set(revision.expectedUids);
  require(expected.size === revision.expectedUids.length, "Duplicate source revision identity");
  require(bridge.cards.every((entry) => expected.has(entry.uid) !== deleted.has(entry.uid)), "Source revision must account for each baseline identity exactly once");
  require([...admitted].every((uid) => expected.has(uid)), "Admitted source revision identity missing");
  if (requireInventory) {
    const actual = new Set(dataset.cards.map((card) => card.uid));
    require([...expected].every((uid) => actual.has(uid)), "Source revision expected UID missing from dataset (undeclared deletion or identity change)");
    require([...actual].every((uid) => expected.has(uid)), "Dataset UID outside approved source revision (undeclared addition or retired identity)");
  }
  return {
    revisionId: revision.revisionId,
    sha256: hash(bytes),
    excludedUids: bridge.excludedUids.filter((uid) => !admitted.has(uid)).sort(),
  };
}
