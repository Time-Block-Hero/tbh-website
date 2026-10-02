import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { exportCommittedDesigns, exportDirtyDesigns } from "../export-card-designs.mjs";
import { SOURCE_REVISION_PATH } from "../card-design-source-revision.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (relative) => fs.readFileSync(path.join(root, relative));
const revisionBytes = read(SOURCE_REVISION_PATH);
const revision = JSON.parse(revisionBytes);
const bridgeBytes = read("data/card-identity-migration.json");
const bridge = JSON.parse(bridgeBytes);
const historic = JSON.parse(read("data/baselines/issue44-20260920/previous-cards.json"));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

function approvedDataset() {
  const dataset = structuredClone(historic);
  dataset.cards = dataset.cards.filter((card) => revision.expectedUids.includes(card.uid));
  const present = new Set(dataset.cards.map((card) => card.uid));
  // Identity-contract fixtures intentionally avoid freezing mutable gameplay/art.
  for (const uid of revision.expectedUids.filter((uid) => !present.has(uid))) {
    dataset.cards.push({ ...structuredClone(dataset.cards[0]), uid, id: `NEW-${uid}`, artworkKey: "", artPath: "" });
  }
  dataset.artworkVariants = {};
  dataset.selectedArtworkIds = {};
  return dataset;
}

function fixture(t, dataset = approvedDataset(), withRevision = true) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tbh-source-revision-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, "data"));
  fs.writeFileSync(path.join(dir, "data/cards.json"), JSON.stringify(dataset));
  fs.writeFileSync(path.join(dir, "data/card-identity-migration.json"), bridgeBytes);
  if (withRevision) fs.writeFileSync(path.join(dir, SOURCE_REVISION_PATH), revisionBytes);
  return dir;
}
function commit(dir) {
  const git = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  if (!fs.existsSync(path.join(dir, ".git"))) git("init");
  git("add", "data");
  git("-c", "user.name=Contract Test", "-c", "user.email=contract@example.invalid", "-c", "commit.gpgsign=false", "commit", "-m", "source fixture");
  return git("rev-parse", "HEAD");
}

test("approved revision retains historical bridge and exactly the five previously approved retirements", () => {
  const evidence = JSON.parse(read(revision.deletionEvidence));
  assert.equal(hash(bridgeBytes), revision.identityBridgeSha256);
  assert.equal(revision.expectedUids.length, 147);
  assert.deepEqual(revision.deletedBaselineCards.map((entry) => entry.uid).sort(), evidence.deleted.map((entry) => entry.uid).sort());
  for (const entry of revision.deletedBaselineCards) assert.deepEqual(bridge.cards.find((card) => card.uid === entry.uid), entry);
  assert.deepEqual(revision.admittedPreviouslyExcludedUids, [...bridge.excludedUids].sort());
});

test("committed 147-card revision records raw provenance and admits the four previously excluded identities", (t) => {
  const dir = fixture(t), sha = commit(dir), result = exportCommittedDesigns(dir, sha);
  assert.equal(result.cards.length, 147);
  assert.deepEqual(result.policy.excludedUids, []);
  assert.equal(result.source.sourceRevisionSha256, hash(revisionBytes));
  assert.equal(result.source.sourceRevisionId, revision.revisionId);
  assert.equal(result.source.sourceRevisionPath, SOURCE_REVISION_PATH);
  assert.equal(result.source.identityBridgeSha256, hash(bridgeBytes));
  assert.equal(result.source.dirty, false);
  assert.deepEqual(exportCommittedDesigns(dir, sha), result);
});

test("undeclared deletion of baseline or newly added identities fails, even with unchanged total count", (t) => {
  const baseline = new Set(bridge.cards.map((card) => card.uid));
  for (const uid of [revision.expectedUids.find((value) => baseline.has(value)), revision.expectedUids.find((value) => !baseline.has(value))]) {
    for (const replace of [false, true]) {
      const dataset = approvedDataset(), card = dataset.cards.find((value) => value.uid === uid);
      if (replace) card.uid = randomUUID();
      else dataset.cards = dataset.cards.filter((value) => value.uid !== uid);
      const dir = fixture(t, dataset);
      assert.throws(() => exportCommittedDesigns(dir, commit(dir)), /expected UID missing/);
    }
  }
});

test("unreviewed additions and resurrection of retired UIDs fail", (t) => {
  for (const uid of [randomUUID(), revision.deletedBaselineCards[0].uid]) {
    const dataset = approvedDataset();
    dataset.cards.push({ ...structuredClone(dataset.cards[0]), uid, id: "EXTRA-001" });
    const dir = fixture(t, dataset);
    assert.throws(() => exportCommittedDesigns(dir, commit(dir)), /outside approved source revision/);
  }
});

test("invalid, altered-policy and wrong-identity revision records cannot authorize a changed inventory", (t) => {
  for (const change of [
    (record) => record.schemaVersion = 2,
    (record) => record.revisionId = "unapproved",
    (record) => record.deletedBaselineCards[0].uid = revision.expectedUids[0],
    (record) => record.deletedBaselineCards[0].baselineDisplayId = "WRONG",
    (record) => record.admittedPreviouslyExcludedUids.pop(),
    (record) => record.expectedUids[0] = randomUUID(),
    (record) => record.expectedUids.push(record.expectedUids[0]),
    (record) => record.extraDeletionPermission = true,
  ]) {
    const dir = fixture(t), record = structuredClone(revision);
    change(record);
    fs.writeFileSync(path.join(dir, SOURCE_REVISION_PATH), JSON.stringify(record));
    assert.throws(() => exportCommittedDesigns(dir, commit(dir)), /source revision|Source revision/);
  }
  const dir = fixture(t);
  fs.writeFileSync(path.join(dir, SOURCE_REVISION_PATH), "invalid JSON");
  assert.throws(() => exportCommittedDesigns(dir, commit(dir)), SyntaxError);
});

test("revision requires the reviewed raw bridge, including original UID bindings", (t) => {
  const dir = fixture(t), wrong = structuredClone(bridge);
  [wrong.cards[0].uid, wrong.cards[1].uid] = [wrong.cards[1].uid, wrong.cards[0].uid];
  fs.writeFileSync(path.join(dir, "data/card-identity-migration.json"), JSON.stringify(wrong));
  assert.throws(() => exportCommittedDesigns(dir, commit(dir)), /bridge hash mismatch/);
});

test("old commits without a revision retain their exact behavior despite dirty revision and card files", (t) => {
  const dir = fixture(t, historic, false), sha = commit(dir), expected = exportCommittedDesigns(dir, sha);
  assert.equal(expected.cards.length, 137);
  assert.deepEqual(expected.policy.excludedUids, [...bridge.excludedUids].sort());
  assert.equal(Object.hasOwn(expected.source, "sourceRevisionSha256"), false);
  fs.writeFileSync(path.join(dir, SOURCE_REVISION_PATH), revisionBytes);
  fs.writeFileSync(path.join(dir, "data/cards.json"), JSON.stringify(approvedDataset()));
  assert.deepEqual(exportCommittedDesigns(dir, sha), expected);
  fs.writeFileSync(path.join(dir, SOURCE_REVISION_PATH), "invalid working-tree record");
  assert.deepEqual(exportCommittedDesigns(dir, sha), expected);
  const missing = fixture(t, approvedDataset(), false);
  assert.throws(() => exportCommittedDesigns(missing, commit(missing)), /Baseline UID missing/);
});

test("new committed revision ignores dirty modifications and deletion of its revision file", (t) => {
  const dir = fixture(t), sha = commit(dir), expected = exportCommittedDesigns(dir, sha);
  fs.writeFileSync(path.join(dir, SOURCE_REVISION_PATH), "invalid working-tree record");
  fs.writeFileSync(path.join(dir, "data/cards.json"), "invalid working-tree cards");
  assert.deepEqual(exportCommittedDesigns(dir, sha), expected);
  fs.unlinkSync(path.join(dir, SOURCE_REVISION_PATH));
  assert.deepEqual(exportCommittedDesigns(dir, sha), expected);
});

test("card text, art and display-ID edits do not require changing the approved UID inventory", (t) => {
  const dataset = approvedDataset();
  dataset.cards[0].rulesText = "新卡文仍需接收方语义审阅。";
  dataset.cards[0].artDescription = "Revised illustration";
  dataset.cards[0].id = "REORDERED-001";
  const dir = fixture(t, dataset), sha = commit(dir), result = exportCommittedDesigns(dir, sha);
  assert.equal(result.cards.length, 147);
  assert.equal(result.source.sourceRevisionSha256, hash(revisionBytes));
  assert.equal(result.cards.find((card) => card.uid === dataset.cards[0].uid).rulesText, dataset.cards[0].rulesText);
  assert.equal(exportDirtyDesigns(dir).source.dirty, true);
  assert.equal(exportDirtyDesigns(dir).source.commit, null);
});

test("explicit sync preview may diverge from inventory without becoming production evidence", (t) => {
  const dataset = approvedDataset();
  dataset.cards.pop();
  const dir = fixture(t, dataset);
  assert.throws(() => exportDirtyDesigns(dir), /expected UID missing/);
  const preview = exportDirtyDesigns(dir, { requireCompleteBaseline: false });
  assert.equal(preview.cards.length, 146);
  assert.equal(preview.source.dirty, true);
  assert.equal(preview.source.commit, null);
  assert.throws(() => exportCommittedDesigns(dir, commit(dir)), /expected UID missing/);
});

test("playtest freeze preserves every prior identity and records the exact designer delta", () => {
  const delta = JSON.parse(read("docs/design/revisions/2026-09-30-playtest-cards.json"));
  const bytes = execFileSync("git", ["--no-replace-objects", "show", "034b251:data/cards.json"], { cwd: root });
  const current = JSON.parse(bytes);
  const previous = JSON.parse(execFileSync("git", ["show", `${delta.baseCommit}:data/cards.json`], { cwd: root }));
  const before = new Map(previous.cards.map(card => [card.uid, card]));
  const after = new Map(current.cards.map(card => [card.uid, card]));
  // The receipt certifies the frozen design input. Current illustration work is
  // allowed, while card-electricity-revision.test.mjs protects every non-art field.
  const frozenBytes = execFileSync("git", ["--no-replace-objects", "show", "034b251:data/cards.json"], { cwd: root });
  assert.equal(hash(frozenBytes), delta.cardsSha256, "historical designer source receipt must stay exact");
  assert.deepEqual([before.size, after.size, delta.changed.length, delta.added.length], [140, 143, 22, 3]);
  for (const [uid, card] of before) {
    assert.ok(after.has(uid));
    for (const field of ["uid", "parentUid", "collectionKind"]) assert.deepEqual(after.get(uid)[field], card[field]);
  }
  assert.deepEqual([...after.keys()].filter(uid => !before.has(uid)).sort(), delta.added.map(card => card.uid).sort());
  assert.deepEqual(delta.deleted, []);
});


test("147-card import retains all 146 prior UIDs and adds only the approved solar spell", () => {
  const before = JSON.parse(execFileSync("git", ["--no-replace-objects", "show", "36989b146297dd7e0a91c19af8410bff97cbca43:data/cards.json"], { cwd: root }));
  const current = JSON.parse(read("data/cards.json"));
  const old = new Map(before.cards.map(card => [card.uid, card]));
  const after = new Map(current.cards.map(card => [card.uid, card]));
  assert.deepEqual([old.size, after.size], [146, 147]);
  assert.deepEqual([...after.keys()].filter(uid => !old.has(uid)).sort(), [
    "6ddc36ab-de9f-4bb4-bf28-def6548454cd",
  ]);
  for (const [uid, card] of old) {
    assert.ok(after.has(uid));
    for (const field of ["uid", "parentUid", "collectionKind"]) assert.deepEqual(after.get(uid)[field], card[field]);
  }
});
