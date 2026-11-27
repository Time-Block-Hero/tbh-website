import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { webcrypto } from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import contract from "../../card-design-contract.js";
import { validateWrite } from "../card-design-write-contract.mjs";
import { migrateFile } from "../migrate-card-designs-v6.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
function legacy() {
  const base = {
    id: "TEST-001", uid: webcrypto.randomUUID(), parentUid: null,
    nameKey: "测试随从", englishName: "Test Minion", cardType: "Minion", classId: "Neutral",
    collectionKind: "Collectible", collectable: true, rarity: "Common", costResource: "Energy", costAmount: 1,
    attack: 1, health: 2, movement: 1, durability: 0, arrows: ["N"], tribes: [], tags: [], rulesText: "原版效果",
    artworkKey: "test-minion", artPath: "legacy/original", execution: contract.plannedExecution(),
  };
  return { schemaVersion: 5, executionSchemaVersion: 21, shared: { statuses: [] }, cards: [base],
    artworkVariants: { [base.id]: [{ id: "a", src: "./assets/card-art/test-minion/test-minion-01.png" }] }, selectedArtworkIds: { [base.id]: "a" } };
}
function fixture() { return contract.migrateDataset(legacy()); }
function addUpgrade(dataset, base = dataset.cards[0]) {
  const card = contract.createUpgrade(base, webcrypto); dataset.cards.push(card); return card;
}
function addToken(dataset) {
  const token = contract.assignNewIdentity(structuredClone(dataset.cards[0]), dataset.cards[0].uid, webcrypto);
  token.id = "TEST-001-01"; token.artworkKey = null; dataset.cards.push(token); return token;
}
function deleteCards(dataset, uid) {
  const result = structuredClone(dataset), removed = new Set(contract.deletionUids(dataset, uid));
  for (const card of result.cards.filter(card => removed.has(card.uid))) {
    delete result.artworkVariants[card.id]; delete result.selectedArtworkIds[card.id];
  }
  result.cards = result.cards.filter(card => !removed.has(card.uid));
  return result;
}

test("schema6 migration preserves legacy execution hashes and initializes independent readiness", async () => {
  const old = legacy(), saved = structuredClone(old), current = contract.migrateDataset(old);
  assert.deepEqual(old, saved);
  assert.equal(current.schemaVersion, 6);
  assert.equal(current.sourceSchemaVersion, 6);
  assert.equal(current.cards[0].playtestReady, false);
  assert.equal(current.cards[0].upgradeOfUid, null);
  assert.deepEqual(current.shared, old.shared);
  assert.deepEqual(current.cards[0].execution, old.cards[0].execution);
  assert.equal(await contract.designHash(current.cards[0], webcrypto), await contract.designHash(old.cards[0], webcrypto));
  current.cards[0].playtestReady = true;
  assert.equal(await contract.designHash(current.cards[0], webcrypto), await contract.designHash(old.cards[0], webcrypto));
  assert.deepEqual(contract.migrateDataset(current), current);
  assert.throws(() => validateWrite(old, current, { type: "edit", uid: old.cards[0].uid }), /schema/);
});

test("migration requires separate new output and never overwrites source or output", t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tbh-migration6-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const input = path.join(dir, "old.json"), output = path.join(dir, "new.json");
  const text = JSON.stringify(legacy()); fs.writeFileSync(input, text);
  assert.throws(() => migrateFile(input, input), /separate output/);
  migrateFile(input, output);
  assert.equal(fs.readFileSync(input, "utf8"), text);
  assert.equal(JSON.parse(fs.readFileSync(output)).schemaVersion, 6);
  assert.throws(() => migrateFile(input, output), /EEXIST/);
});

test("upgrades of originals and derivatives have fresh identity, independent flags and Planned execution", () => {
  const dataset = fixture(), original = dataset.cards[0];
  original.playtestReady = true; original.execution.abilities.push({ id: "must-not-copy" });
  const upgrade = addUpgrade(dataset), token = addToken(dataset), tokenUpgrade = addUpgrade(dataset, token);
  contract.validateDataset(dataset);
  assert.equal(upgrade.id, `${original.id}-UP`);
  assert.equal(upgrade.upgradeOfUid, original.uid);
  assert.equal(tokenUpgrade.upgradeOfUid, token.uid);
  assert.equal(upgrade.parentUid, null); assert.equal(tokenUpgrade.parentUid, null);
  assert.notEqual(upgrade.uid, original.uid);
  assert.equal(upgrade.playtestReady, false);
  assert.equal(upgrade.collectable, false);
  assert.equal(tokenUpgrade.collectionKind, "NonCollectible");
  assert.deepEqual(upgrade.execution, contract.plannedExecution());
  assert.equal(upgrade.artworkKey, null);
  assert.equal(upgrade.artPath, undefined);
  upgrade.rulesText = "独立升级效果";
  assert.equal(original.rulesText, "原版效果");
  assert.throws(() => contract.createUpgrade(upgrade, webcrypto), /original/);
});

test("schema6 requires flags and rejects duplicate, nested, self and incompatible upgrades", () => {
  const dataset = fixture(), upgrade = addUpgrade(dataset);
  for (const mutate of [
    d => delete d.cards[0].playtestReady,
    d => d.cards[0].playtestReady = "false",
    d => delete d.cards[0].upgradeOfUid,
    d => d.cards[1].upgradeOfUid = d.cards[1].uid,
    d => d.cards[1].upgradeOfUid = webcrypto.randomUUID(),
    d => d.cards[1].classId = "Fungal",
    d => d.cards[1].cardType = "Spell",
    d => d.cards[1].parentUid = d.cards[0].uid,
  ]) {
    const invalid = structuredClone(dataset); mutate(invalid);
    assert.throws(() => contract.validateDataset(invalid));
  }
  const duplicate = contract.createUpgrade(dataset.cards[0], webcrypto); duplicate.id += "-DUP";
  assert.throws(() => contract.validateDataset({ ...dataset, cards: [...dataset.cards, duplicate] }), /Duplicate upgrade/);
  const nested = structuredClone(upgrade); nested.uid = webcrypto.randomUUID(); nested.id += "-NESTED"; nested.upgradeOfUid = upgrade.uid;
  assert.throws(() => contract.validateDataset({ ...dataset, cards: [...dataset.cards, nested] }), /nested/);
});

test("events are uncollectible originals without upgrade or derivative relationships", () => {
  const dataset = fixture();
  const event = contract.assignNewIdentity({ ...structuredClone(dataset.cards[0]), cardType: "Event", id: "EVENT-001", artworkKey: null }, null, webcrypto);
  assert.equal(event.collectionKind, "NonCollectible"); assert.equal(event.collectable, false);
  dataset.cards.push(event); contract.validateDataset(dataset);
  assert.throws(() => contract.createUpgrade(event, webcrypto), /non-event/);
  for (const mutate of [
    e => { e.collectable = true; },
    e => { e.tags = ["InitialHero"]; },
    e => { e.parentUid = dataset.cards[0].uid; },
    e => { e.upgradeOfUid = dataset.cards[0].uid; },
  ]) {
    const invalid = structuredClone(dataset); mutate(invalid.cards[1]);
    assert.throws(() => contract.validateDataset(invalid));
  }
});

test("upgrade artwork falls back without claiming base artwork and explicit selection overrides it", () => {
  const dataset = fixture(), upgrade = addUpgrade(dataset);
  assert.deepEqual(contract.selectedArtwork(dataset, upgrade), contract.selectedArtwork(dataset, dataset.cards[0]));
  assert.equal(dataset.artworkVariants[upgrade.id], undefined);
  assert.equal(upgrade.artworkKey, null);
  dataset.selectedArtworkIds[upgrade.id] = null;
  assert.deepEqual(contract.selectedArtwork(dataset, upgrade), contract.selectedArtwork(dataset, dataset.cards[0]));
  dataset.selectedArtworkIds[upgrade.id] = [];
  assert.deepEqual(contract.selectedArtwork(dataset, upgrade), []);
  dataset.artworkVariants[upgrade.id] = [{ id: "u", src: "./assets/card-art/test-up/test-up-01.png" }];
  dataset.selectedArtworkIds[upgrade.id] = "u";
  assert.equal(contract.selectedArtwork(dataset, upgrade)[0].variantId, "u");
  assert.equal(contract.selectedArtwork(dataset, dataset.cards[0])[0].variantId, "a");
});

test("UID-based deletion removes upgrade descendants but deleting an upgrade leaves original intact", () => {
  const dataset = fixture(), upgrade = addUpgrade(dataset), token = addToken(dataset), tokenUpgrade = addUpgrade(dataset, token);
  assert.deepEqual(new Set(contract.deletionUids(dataset, token.uid)), new Set([token.uid, tokenUpgrade.uid]));
  assert.deepEqual(new Set(contract.deletionUids(dataset, dataset.cards[0].uid)), new Set(dataset.cards.map(c => c.uid)));
  const next = deleteCards(dataset, upgrade.uid);
  validateWrite(dataset, next, { type: "delete", uid: upgrade.uid });
  assert.ok(next.cards.some(c => c.uid === dataset.cards[0].uid));
  const incomplete = structuredClone(dataset); incomplete.cards = incomplete.cards.filter(c => c.uid !== token.uid);
  assert.throws(() => validateWrite(dataset, incomplete, { type: "delete", uid: token.uid }));
});

test("writes preserve independent readiness, relationship identity and shared declarations", () => {
  const dataset = fixture(), upgrade = addUpgrade(dataset), next = structuredClone(dataset);
  next.cards[1].playtestReady = true;
  validateWrite(dataset, next, { type: "edit", uid: upgrade.uid });
  next.cards[0].playtestReady = true;
  assert.throws(() => validateWrite(dataset, next, { type: "edit", uid: upgrade.uid }), /unaddressed/);
  const changed = structuredClone(dataset); changed.shared.statuses.push({ id: "new" });
  assert.throws(() => validateWrite(dataset, changed, { type: "edit", uid: upgrade.uid }), /shared/);
  const detached = structuredClone(dataset); detached.cards[1].upgradeOfUid = null;
  assert.throws(() => validateWrite(dataset, detached, { type: "edit", uid: upgrade.uid }), /upgrade UID/);
});

test("deletion rejects references from shared execution declarations", () => {
  const dataset = fixture(), upgrade = addUpgrade(dataset);
  dataset.shared.statuses.push({ id: "SharedReference", data: { cardUid: upgrade.uid } });
  const next = deleteCards(dataset, upgrade.uid);
  assert.throws(() => validateWrite(dataset, next, { type: "delete", uid: upgrade.uid }), /shared/);
});

test("root faction propagation reaches derivative upgrades without allowing other field changes", () => {
  const dataset = fixture(); addUpgrade(dataset); const token = addToken(dataset); addUpgrade(dataset, token);
  const next = structuredClone(dataset); next.cards.forEach(c => c.classId = "Fungal");
  validateWrite(dataset, next, { type: "edit", uid: dataset.cards[0].uid });
  next.cards[3].playtestReady = true;
  assert.throws(() => validateWrite(dataset, next, { type: "edit", uid: dataset.cards[0].uid }), /unaddressed/);
});

test("HTTP schema6 create/save/reopen and upgrade deletion preserve original artwork and reject stale writes", async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tbh-variants-server-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const name of ["data", "card_layout_ref", "assets/card-art/test-minion"]) fs.mkdirSync(path.join(dir, name), { recursive: true });
  const original = fixture();
  fs.writeFileSync(path.join(dir, "data/cards.json"), JSON.stringify(original));
  fs.writeFileSync(path.join(dir, "card_layout_ref/layout.json"), "{}");
  fs.writeFileSync(path.join(dir, "card-editor-data.js"), "original fallback");
  const artPath = path.join(dir, "assets/card-art/test-minion/test-minion-01.png"); fs.writeFileSync(artPath, "source-art");
  const child = spawn(process.execPath, [path.join(root, "tools/card-editor-server.mjs"), "--root", dir, "--port", "0"], { stdio: ["ignore", "pipe", "pipe"] });
  t.after(() => child.kill());
  const url = await new Promise((resolve, reject) => {
    let errors = "";
    const timeout = setTimeout(() => reject(new Error(`Editor server startup timed out: ${errors}`)), 5000);
    child.stderr.on("data", chunk => errors += chunk);
    child.once("error", reject); child.once("exit", code => { clearTimeout(timeout); reject(new Error(`Editor server exited ${code}: ${errors}`)); });
    child.stdout.on("data", chunk => { const match = String(chunk).match(/http:\/\/127\.0\.0\.1:\d+/); if (match) { clearTimeout(timeout); resolve(match[0]); } });
  });
  let revision = (await (await fetch(`${url}/api/cards/state`)).json()).cardsRevision;
  const post = async (dataset, operation, extras = {}, baseRevision = revision) => {
    const response = await fetch(`${url}/api/cards/save`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dataset, operation, baseRevision, ...extras }) });
    const result = await response.json(); if (response.ok) revision = result.cardsRevision;
    return { status: response.status, ...result };
  };
  const dataset = structuredClone(original), upgrade = addUpgrade(dataset);
  assert.equal((await post(dataset, { type: "create", uid: upgrade.uid })).status, 200);
  const oldRevision = revision;
  upgrade.playtestReady = true; upgrade.rulesText = "升级版已修改";
  assert.equal((await post(dataset, { type: "edit", uid: upgrade.uid })).status, 200);
  let reopened = (await (await fetch(`${url}/api/cards/state`)).json()).dataset;
  assert.equal(reopened.cards[1].playtestReady, true); assert.equal(reopened.cards[0].playtestReady, false);
  const saved = fs.readFileSync(path.join(dir, "data/cards.json"), "utf8");
  assert.equal((await post(dataset, { type: "edit", uid: upgrade.uid }, {}, oldRevision)).status, 400);
  assert.equal(fs.readFileSync(path.join(dir, "data/cards.json"), "utf8"), saved);
  const deleted = deleteCards(dataset, upgrade.uid);
  assert.equal((await post(deleted, { type: "delete", uid: upgrade.uid }, { artworkDeletes: ["test-minion"] })).status, 400);
  assert.equal((await post(deleted, { type: "delete", uid: upgrade.uid })).status, 200);
  assert.equal(fs.readFileSync(artPath, "utf8"), "source-art");
  reopened = (await (await fetch(`${url}/api/cards/state`)).json()).dataset;
  assert.equal(reopened.cards.length, 1);
});
