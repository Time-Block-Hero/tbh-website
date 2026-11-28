import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { webcrypto } from "node:crypto";
import { fileURLToPath } from "node:url";
import test from "node:test";
import contract from "../../card-design-contract.js";
import { validateWrite } from "../card-design-write-contract.mjs";
import { selectPlaytestDataset, validateProductionExecution, designHash } from "../card-execution.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const seed = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json"))).cards.find(card => card.collectable && !card.parentUid && !card.upgradeOfUid && card.collectionKind !== "Hero");
function original(id, values = {}) {
  return { ...structuredClone(seed), id, uid: webcrypto.randomUUID(), parentUid: null, upgradeOfUid: null, playtestReady: false,
    artworkKey: null, execution: contract.plannedExecution(), ...values };
}
function fixture() {
  const a = original("A"), b = original("B"), token = original("A-01", { parentUid: a.uid, collectable: false, collectionKind: "Token" });
  const event = original("EVENT", { cardType: "Event", collectable: false, collectionKind: "NonCollectible", tags: [] });
  const upgrade = contract.createUpgrade(a, webcrypto), tokenUpgrade = contract.createUpgrade(token, webcrypto);
  return { schemaVersion: 6, executionSchemaVersion: 22, shared: { statuses: [] }, cards: [a, upgrade, b, token, tokenUpgrade, event], artworkVariants: {}, selectedArtworkIds: {} };
}
function implemented(card) {
  card.execution = contract.plannedExecution();
  card.execution.runtimeSupport = "Implemented";
  card.execution.reviewedDesignHash = designHash(card);
}

test("legacy opposite mirror flags normalize from original only and do not change unrelated groups", () => {
  const dataset = fixture(), [a, up, b, token, tokenUp, event] = dataset.cards;
  a.playtestReady = true; up.playtestReady = false;
  token.playtestReady = false; tokenUp.playtestReady = true;
  event.playtestReady = true;
  const beforeHashes = dataset.cards.map(designHash);
  assert.equal(contract.effectivePlaytestReady(dataset, up.uid), true);
  assert.equal(contract.effectivePlaytestReady(dataset, tokenUp), false);
  assert.equal(contract.normalizePlaytestReady(dataset), true);
  assert.deepEqual(dataset.cards.map(card => card.playtestReady), [true, true, false, false, false, true]);
  assert.equal(contract.normalizePlaytestReady(dataset), false);
  assert.deepEqual(dataset.cards.map(designHash), beforeHashes);
  assert.equal(b.playtestReady, false);
  assert.equal(contract.effectivePlaytestReady(dataset, event), true);
  const legacy = structuredClone(dataset); legacy.schemaVersion = 5;
  assert.equal(contract.normalizePlaytestReady(legacy), false);
});

test("setting either side updates only that original-upgrade pair, never parent or child pairs", () => {
  const dataset = fixture(), [a, up, b, token, tokenUp, event] = dataset.cards;
  assert.equal(contract.setPlaytestReady(dataset, up.uid, true), true);
  assert.deepEqual(dataset.cards.map(c => c.playtestReady), [true, true, false, false, false, false]);
  assert.equal(contract.setPlaytestReady(dataset, a, true), false);
  contract.setPlaytestReady(dataset, tokenUp, true);
  contract.setPlaytestReady(dataset, a, false);
  assert.deepEqual(dataset.cards.map(c => c.playtestReady), [false, false, false, true, true, false]);
  contract.setPlaytestReady(dataset, event, true);
  assert.equal(b.playtestReady, false); assert.equal(event.playtestReady, true);
  assert.throws(() => contract.setPlaytestReady(dataset, a, "true"), /boolean/);
});

test("new upgrade follows current original selection and still owns fresh Planned execution", () => {
  const base = original("READY", { playtestReady: true }); implemented(base);
  const upgrade = contract.createUpgrade(base, webcrypto);
  assert.equal(upgrade.playtestReady, true);
  assert.deepEqual(upgrade.execution, contract.plannedExecution());
  assert.notEqual(upgrade.uid, base.uid);
});

test("saving original permits only its upgrade mirror flag synchronization", () => {
  const previous = fixture(), next = structuredClone(previous), target = next.cards[0];
  target.rulesText = "edited original";
  contract.setPlaytestReady(next, target, true);
  validateWrite(previous, next, { type: "edit", uid: target.uid });
  next.cards[1].rulesText = "must not overwrite upgrade draft";
  assert.throws(() => validateWrite(previous, next, { type: "edit", uid: target.uid }), /unaddressed/);
  next.cards[1].rulesText = previous.cards[1].rulesText;
  next.cards[2].playtestReady = true;
  assert.throws(() => validateWrite(previous, next, { type: "edit", uid: target.uid }), /unaddressed/);
});

test("saving upgrade text cannot change the original choice even when both flags are synchronized", () => {
  const previous = fixture(), next = structuredClone(previous), target = next.cards[1];
  target.rulesText = "edited upgrade";
  validateWrite(previous, next, { type: "edit", uid: target.uid });
  contract.setPlaytestReady(next, target, true);
  assert.throws(() => validateWrite(previous, next, { type: "edit", uid: target.uid }), /unaddressed/);
});

test("upgrade text edit may repair its old mirror while preserving the original authority", () => {
  const previous = fixture(); previous.cards[0].playtestReady = true;
  const next = structuredClone(previous); contract.normalizePlaytestReady(next);
  next.cards[1].rulesText = "edited upgrade on already included original";
  validateWrite(previous, next, { type: "edit", uid: next.cards[1].uid });
  assert.equal(next.cards[0].playtestReady, true);
  assert.equal(next.cards[1].playtestReady, true);
  contract.setPlaytestReady(next, next.cards[1], false);
  assert.throws(() => validateWrite(previous, next, { type: "edit", uid: next.cards[1].uid }), /unaddressed/);
});

test("saving an old inconsistent schema6 dataset can repair all derived mirrors without altering authoritative flags", () => {
  const previous = fixture(); previous.cards[0].playtestReady = true; previous.cards[4].playtestReady = true;
  const next = structuredClone(previous); contract.normalizePlaytestReady(next);
  next.cards[2].rulesText = "unrelated requested edit";
  validateWrite(previous, next, { type: "edit", uid: next.cards[2].uid });
  next.cards[3].playtestReady = true; next.cards[4].playtestReady = true;
  assert.throws(() => validateWrite(previous, next, { type: "edit", uid: next.cards[2].uid }), /unaddressed/);
});

test("upgrade-only inconsistent writes cannot become an independent inclusion choice", () => {
  const previous = fixture(), next = structuredClone(previous);
  next.cards[1].playtestReady = true;
  assert.throws(() => validateWrite(previous, next, { type: "edit", uid: next.cards[1].uid }), /follow its original/);
  contract.normalizePlaytestReady(next);
  validateWrite(previous, next, { type: "edit", uid: next.cards[1].uid });
  assert.equal(next.cards[1].playtestReady, false);
});

test("schema6 migration also normalizes old pair mirrors without editing the input", () => {
  const old = fixture(); old.cards[0].playtestReady = true; old.cards[4].playtestReady = true;
  const before = structuredClone(old), migrated = contract.migrateDataset(old);
  assert.deepEqual(old, before);
  assert.deepEqual(migrated.cards.map(card => card.playtestReady), [true, true, false, false, false, false]);
});

test("production selection includes both forms from original and ignores upgrade-only true without mutating source", () => {
  const dataset = fixture(), [a, up, b, token, tokenUp] = dataset.cards;
  a.playtestReady = true; tokenUp.playtestReady = true;
  const selected = selectPlaytestDataset(dataset);
  assert.deepEqual(selected.cards.map(card => card.uid), [a.uid, up.uid]);
  assert.ok(selected.cards.every(card => card.playtestReady));
  assert.equal(up.playtestReady, false);
  a.playtestReady = false; up.playtestReady = true; b.playtestReady = true;
  assert.deepEqual(selectPlaytestDataset(dataset).cards.map(card => card.uid), [b.uid]);
  token.playtestReady = true;
  assert.throws(() => selectPlaytestDataset(dataset), /parentUid: required card/);
});

test("bound selection still requires the upgrade's own execution review and unrelated execution dependencies", () => {
  const dataset = fixture(), [a, up, b] = dataset.cards;
  a.playtestReady = true; implemented(a);
  assert.throws(() => validateProductionExecution(dataset), /not Implemented/);
  implemented(up); assert.equal(validateProductionExecution(dataset).cards.length, 2);
  up.rulesText += " changed";
  assert.throws(() => validateProductionExecution(dataset), /stale design review/);
  implemented(up); a.execution.properties.upgradeToCardId = b.uid;
  assert.throws(() => validateProductionExecution(dataset), /dangling card UID/);
});
