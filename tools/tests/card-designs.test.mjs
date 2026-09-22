import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { webcrypto, createHash } from "node:crypto";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import contract from "../../card-design-contract.js";
import { validateWrite } from "../card-design-write-contract.mjs";
import { exportCommittedDesigns, exportDirtyDesigns, validateBridge, guardExportOutput } from "../export-card-designs.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
// Historical migration tests retain their original 137-card fixture. Current designs are checked separately.
const source = JSON.parse(fs.readFileSync(path.join(root, "data/baselines/issue44-20260920/previous-cards.json")));
const bridge = JSON.parse(fs.readFileSync(path.join(root, "data/card-identity-migration.json")));
function fixture(t, dataset = source, identityBridge = bridge) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tbh-design-test-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, "data"));
  fs.writeFileSync(path.join(dir, "data/cards.json"), JSON.stringify(dataset));
  fs.writeFileSync(path.join(dir, "data/card-identity-migration.json"), JSON.stringify(identityBridge));
  return dir;
}
const revised = (mutate) => { const copy = structuredClone(source); mutate(copy); return copy; };

test("fixed baseline retains 137 distinct identities, all policy partitions and explicit collection classes", () => {
  contract.validateDataset(source, { exportArtwork: true });
  validateBridge(bridge, source);
  assert.equal(source.cards.length, 137);
  assert.equal(source.cards.length - bridge.excludedUids.length, 133);
  assert.equal(bridge.resourceMigrationUids.length, 7);
  assert.equal(bridge.blankEffectUids.length, 4);
  const counts = Object.fromEntries(contract.COLLECTIONS.map((kind) => [kind, source.cards.filter((card) => card.collectionKind === kind).length]));
  assert.deepEqual(counts, { Collectible: 114, Hero: 4, Token: 6, NonCollectible: 13 });
  for (const name of ["遗失的智慧", "美味的野果"]) assert.equal(new Set(source.cards.filter((card) => card.nameKey === name).map((card) => card.uid)).size, 2);
});

test("missing and duplicate UIDs fail before writing", () => {
  assert.throws(() => contract.validateDataset(revised((d) => delete d.cards[0].uid)), /UID/);
  assert.throws(() => contract.validateDataset(revised((d) => d.cards[1].uid = d.cards[0].uid)), /Duplicate card UID/);
});

test("invalid types, collection classes and parent references are rejected", () => {
  assert.throws(() => contract.validateDataset(revised((d) => d.cards[0].cardType = "Artifact")), /card type/);
  assert.throws(() => contract.validateDataset(revised((d) => d.cards[0].collectionKind = "Hero")), /collection kind/);
  assert.throws(() => contract.validateDataset(revised((d) => d.cards.find((c) => c.parentUid).parentUid = webcrypto.randomUUID())), /parent/);
  assert.throws(() => contract.validateDataset(revised((d) => { const c = d.cards.find((c) => c.parentUid); c.parentUid = c.uid; })), /parent/);
});

test("new and copied cards get fresh identities while explicit parent identity survives", () => {
  const copied = contract.assignNewIdentity(structuredClone(source.cards[0]), source.cards[0].uid, webcrypto);
  assert.notEqual(copied.uid, source.cards[0].uid);
  assert.equal(copied.parentUid, source.cards[0].uid);
  assert.equal(copied.collectionKind, "Token");
  assert.equal(copied.collectable, false);
});

function editorHarness() {
  let formValues = {};
  const memory = new Map(), status = { dataset: {}, textContent: "" };
  const form = { elements: { namedItem: (name) => ({ value: formValues[name] ?? "", checked: false }) } };
  const context = { console: { ...console, error: () => {} }, structuredClone, crypto: webcrypto, TbhCardDesign: contract,
    localStorage: { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) },
    fetch: async () => ({ ok: false, status: 400, json: async () => ({ error: "revision conflict" }) }),
    document: { createElement: () => ({ getContext: () => ({}) }), querySelector: (selector) => selector === "#cardEditorForm" ? form : selector.endsWith("SaveStatus") ? status : { value: "Neutral" }, querySelectorAll: () => [] } };
  context.window = context;
  vm.createContext(context);
  let script = fs.readFileSync(path.join(root, "card-editor.js"), "utf8");
  script = script.replace("  window.initFormalCardEditor =", `
  const actualPersist = persist;
  persist = async () => true; closeEditor = () => {}; renderGallery = () => {}; openEditor = () => {}; showCard = () => {};
  confirmBrowserDraftOverwrite = () => true;
  globalThis.editorTest = { actualPersist, connect: (value) => { projectSyncAvailable = true; projectConfirmedDataset = structuredClone(value); projectCardsRevision = "baseline"; projectSyncBlocked = false; }, load: (value) => dataset = value, get: () => dataset,
    select: (id) => currentId = id, remapCardIds, addMainCard, addDerivative, readForm, normalizeDatasetForCurrentRules,
    pending: (variants, selected) => { pendingArtworkVariants = variants; pendingSelectedArtworkId = selected; },
    getPending: () => ({ variants: pendingArtworkVariants, selected: pendingSelectedArtworkId }), renamePendingArtwork };
  window.initFormalCardEditor =`);
  vm.runInContext(script, context);
  return { api: context.editorTest, memory, status, form: (values) => formValues = values };
}

test("actual editor reorder, rename, new-card and derivative paths preserve identity semantics", () => {
  const { api, form } = editorHarness();
  const dataset = structuredClone(source);
  api.load(dataset);
  const before = dataset.cards.map((card) => ({ uid: card.uid, parentUid: card.parentUid }));
  api.remapCardIds({ "FNG-001": "FNG-002", "FNG-002": "FNG-001", "SA-004": "SA-099" });
  assert.deepEqual(dataset.cards.map((card) => ({ uid: card.uid, parentUid: card.parentUid })).sort((a,b) => a.uid.localeCompare(b.uid)), before.sort((a,b) => a.uid.localeCompare(b.uid)));
  const card = dataset.cards.find((card) => card.uid === source.cards[0].uid);
  api.select(card.id);
  form({ nameKey: "新显示名", englishName: "Renamed", cardType: "Minion", rarity: "Common", classId: "Neutral", collectable: "true", health: "2" });
  const renamed = api.readForm();
  assert.equal(renamed.uid, card.uid);
  assert.equal(renamed.nameKey, "新显示名");
  api.addMainCard();
  assert.equal(new Set(dataset.cards.map((card) => card.uid)).size, 138);
  api.select(card.id);
  api.addDerivative();
  const token = dataset.cards.at(-1);
  assert.equal(token.parentUid, card.uid);
  assert.notEqual(token.uid, card.uid);
  assert.equal(token.collectionKind, "Token");
  contract.validateDataset(dataset);
});

test("actual editor form round trip keeps Resource type without minion stats", () => {
  const { api, form } = editorHarness();
  const dataset = structuredClone(source), card = dataset.cards.find((card) => card.cardType === "Resource");
  api.load(dataset); api.select(card.id);
  form({ nameKey: card.nameKey, englishName: card.englishName, cardType: "Resource", rarity: card.rarity, classId: card.classId, collectable: "false", costAmount: String(card.costAmount), rulesText: card.rulesText });
  const reopened = JSON.parse(JSON.stringify(api.readForm()));
  assert.equal(reopened.cardType, "Resource");
  assert.equal(reopened.uid, card.uid);
  assert.equal(reopened.rulesText, card.rulesText);
  assert.equal(Object.hasOwn(reopened, "health"), false);
});

test("multiple official selections survive actual editor initialization, reorder and artwork rename", () => {
  const { api } = editorHarness(), dataset = structuredClone(source);
  const card = dataset.cards[0];
  dataset.artworkVariants[card.id].push({ id: "space-soldier-02", src: "./assets/card-art/space-soldier/space-soldier-02.png" });
  const choices = ["space-soldier-01", "space-soldier-02"];
  dataset.selectedArtworkIds[card.id] = [...choices];
  api.load(dataset);
  assert.equal(api.normalizeDatasetForCurrentRules(structuredClone(dataset)), false);
  assert.deepEqual(dataset.selectedArtworkIds[card.id], choices);
  api.remapCardIds({ "FNG-001": "FNG-099" });
  assert.deepEqual(dataset.selectedArtworkIds["FNG-099"], choices);
  api.pending(structuredClone(dataset.artworkVariants[card.id]), [...choices]);
  api.renamePendingArtwork("space-soldier", "renamed-soldier");
  assert.deepEqual(Array.from(api.getPending().selected), ["renamed-soldier-01", "renamed-soldier-02"]);
});

test("UID-addressed saves allow reorder and single-card edits but reject swaps and undeclared changes", () => {
  const { api } = editorHarness(), reordered = structuredClone(source);
  api.load(reordered); api.remapCardIds({ "FNG-001": "FNG-002", "FNG-002": "FNG-001" });
  validateWrite(source, JSON.parse(JSON.stringify(reordered)), { type: "reorder" });
  const renamed = revised((d) => d.cards[0].nameKey = "New display name");
  validateWrite(source, renamed, { type: "edit", uid: source.cards[0].uid });
  assert.throws(() => validateWrite(source, renamed, { type: "reorder" }), /unaddressed/);
  const swapped = revised((d) => { [d.cards[0].uid, d.cards[1].uid] = [d.cards[1].uid, d.cards[0].uid]; });
  assert.throws(() => validateWrite(source, swapped, { type: "edit", uid: source.cards[0].uid }), /unaddressed/);
  assert.throws(() => validateWrite(source, swapped, { type: "import" }), /associations/);
});

test("failed saves retain a separate recovery draft, restore confirmed identities and keep the error visible", async () => {
  for (const create of [false, true]) {
    const { api, memory, status } = editorHarness();
    const draft = structuredClone(source);
    let uid = draft.cards[0].uid;
    if (create) {
      const added = contract.assignNewIdentity({ ...structuredClone(draft.cards[0]), id: "NEW-001", artworkKey: "" }, null, webcrypto);
      draft.cards.push(added); uid = added.uid;
    } else draft.cards[0].nameKey = "Unsynced edit must survive";
    api.connect(source); api.load(draft); api.select(draft.cards.find((card) => card.uid === uid).id);
    memory.set("tbh-formal-card-editor-v5", "last successful draft");
    assert.equal(await api.actualPersist({ operation: { type: create ? "create" : "edit", uid } }), false);
    const recovery = JSON.parse(memory.get("tbh-card-editor-unsynced-recovery-v1"));
    assert.deepEqual(recovery.dataset, draft);
    assert.equal(memory.get("tbh-formal-card-editor-v5"), "last successful draft");
    assert.deepEqual(api.get(), source);
    assert.match(status.textContent, /未同步草稿/);
  }
});

test("development sync preview permits explicit baseline deletion without resurrecting cards or permitting production import", (t) => {
  for (const deletedUid of [source.cards[0].uid, bridge.resourceMigrationUids[0], bridge.blankEffectUids[0], bridge.excludedUids[0]]) {
    const dataset = revised((d) => {
      const deleted = d.cards.filter((card) => card.uid === deletedUid || card.parentUid === deletedUid);
      d.cards = d.cards.filter((card) => !deleted.includes(card));
      for (const card of deleted) { delete d.artworkVariants[card.id]; delete d.selectedArtworkIds[card.id]; }
    });
    const dir = fixture(t, dataset);
    assert.throws(() => exportDirtyDesigns(dir), /Baseline UID missing/);
    const preview = exportDirtyDesigns(dir, { requireCompleteBaseline: false });
    assert.equal(preview.cards.length, dataset.cards.length);
    assert.equal(preview.source.dirty, true);
    assert.equal(preview.source.commit, null);
    assert.equal(preview.cards.some((card) => card.uid === deletedUid), false);
  }
});

test("export output cannot overwrite source files directly or through symlinks", (t) => {
  const dir = fixture(t);
  assert.throws(() => guardExportOutput(dir, path.join(dir, "data/cards.json")), /outside/);
  fs.symlinkSync(path.join(dir, "data"), path.join(dir, "artifacts"));
  assert.throws(() => guardExportOutput(dir, path.join(dir, "artifacts/cards.json")), /outside/);
  fs.unlinkSync(path.join(dir, "artifacts"));
  assert.equal(guardExportOutput(dir, path.join(dir, "artifacts/designs.json")), path.join(fs.realpathSync(dir), "artifacts/designs.json"));
});

test("export is deterministic and never copies executable artifacts or old artPath", (t) => {
  const dataset = revised((d) => { d.abilities = [{ id: "old" }]; Object.assign(d.cards[0], { runtimeSupport: "Implemented", abilityRefs: ["old"], artPath: "WrongOldArt" }); });
  const dir = fixture(t, dataset);
  const one = exportDirtyDesigns(dir), two = exportDirtyDesigns(dir);
  assert.deepEqual(one, two);
  const json = JSON.stringify(one);
  for (const forbidden of ["abilityRefs", "runtimeSupport", "Implemented", "WrongOldArt"]) assert.equal(json.includes(forbidden), false);
  assert.equal(one.source.dirty, true); assert.equal(one.source.commit, null);
  for (const card of one.cards.filter((card) => card.cardType !== "Minion")) assert.deepEqual([card.attack, card.health, card.movement, card.tribes], [null, null, null, []]);
});

test("export keeps every selected variant and rejects nonexistent or traversal selections", (t) => {
  const dataset = structuredClone(source), card = dataset.cards[0];
  const variants = dataset.artworkVariants[card.id];
  variants.push({ id: "second", src: "./assets/card-art/space-soldier/second.png" });
  dataset.selectedArtworkIds[card.id] = [variants[0].id, "second"];
  const dir = fixture(t, dataset);
  assert.equal(exportDirtyDesigns(dir).cards.find((entry) => entry.uid === card.uid).artwork.selected.length, 2);
  variants[1].src = "./assets/card-art/../private.png";
  assert.throws(() => contract.selectedArtwork(dataset, card), /path/);
  dataset.selectedArtworkIds[card.id] = "missing";
  assert.throws(() => contract.selectedArtwork(dataset, card), /Missing/);
});

test("bridge policy remains bound to UID after display-ID reorder and rejects policy reassignment", (t) => {
  const dataset = revised((d) => { for (const card of d.cards) card.id = `DISPLAY-${card.uid}`; d.artworkVariants = {}; d.selectedArtworkIds = {}; });
  const output = exportDirtyDesigns(fixture(t, dataset));
  assert.deepEqual(output.policy.excludedUids, bridge.excludedUids);
  const wrong = structuredClone(bridge); wrong.excludedUids[0] = source.cards[0].uid;
  assert.throws(() => validateBridge(wrong, dataset), /policy mismatch/);
});

test("committed export proves both raw hashes and ignores dirty working-tree bytes", (t) => {
  const dir = fixture(t);
  const git = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init"); git("add", "data"); git("-c", "user.name=Contract Test", "-c", "user.email=contract@example.invalid", "-c", "commit.gpgsign=false", "commit", "-m", "fixture");
  const sha = git("rev-parse", "HEAD"), expected = exportCommittedDesigns(dir, sha);
  const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
  assert.equal(expected.source.cardsSha256, sha256(fs.readFileSync(path.join(dir, "data/cards.json"))));
  assert.equal(expected.source.identityBridgeSha256, sha256(fs.readFileSync(path.join(dir, "data/card-identity-migration.json"))));
  fs.writeFileSync(path.join(dir, "data/cards.json"), "dirty invalid text");
  assert.deepEqual(exportCommittedDesigns(dir, sha), expected);
  assert.equal(expected.source.commit, sha); assert.equal(expected.source.dirty, false);
  assert.throws(() => exportCommittedDesigns(dir, "HEAD"), /full committed SHA/);
  fs.writeFileSync(path.join(dir, "data/cards.json"), JSON.stringify(revised((d) => d.cards[0].nameKey = "Replacement tree")));
  git("add", "data"); git("-c", "user.name=Contract Test", "-c", "user.email=contract@example.invalid", "-c", "commit.gpgsign=false", "commit", "-m", "replacement");
  git("replace", sha, git("rev-parse", "HEAD"));
  assert.deepEqual(exportCommittedDesigns(dir, sha), expected);
});

test("HTTP save and reopen preserve Resource/UID and reject malformed datasets atomically", async (t) => {
  const dir = fixture(t);
  fs.mkdirSync(path.join(dir, "card_layout_ref"));
  fs.writeFileSync(path.join(dir, "card_layout_ref/layout.json"), "{}");
  fs.writeFileSync(path.join(dir, "card-editor-data.js"), "original fallback");
  const child = spawn(process.execPath, [path.join(root, "tools/card-editor-server.mjs"), "--root", dir, "--port", "0"], { stdio: ["ignore", "pipe", "pipe"] });
  t.after(() => child.kill());
  const url = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Editor server startup timed out")), 5000);
    child.once("error", reject); child.once("exit", (code) => { clearTimeout(timeout); reject(new Error(`Editor server exited ${code}`)); });
    child.stdout.on("data", (chunk) => { const match = String(chunk).match(/http:\/\/127\.0\.0\.1:\d+/); if (match) { clearTimeout(timeout); resolve(match[0]); } });
  });
  let revision = (await (await fetch(`${url}/api/cards/state`)).json()).cardsRevision;
  const post = async (dataset, operation = { type: "reorder" }, baseRevision = revision, extra = {}) => {
    const response = await fetch(`${url}/api/cards/save`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dataset, operation, baseRevision, ...extra }) });
    const result = await response.json(); if (response.ok) revision = result.cardsRevision; return response;
  };
  assert.equal((await post(source)).status, 200);
  const reopened = await (await fetch(`${url}/data/cards.json`)).json();
  assert.deepEqual(reopened.cards.filter((card) => card.cardType === "Resource"), source.cards.filter((card) => card.cardType === "Resource"));
  const saved = fs.readFileSync(path.join(dir, "data/cards.json"), "utf8");
  assert.equal((await post(revised((d) => delete d.cards[0].uid))).status, 400);
  assert.equal(fs.readFileSync(path.join(dir, "data/cards.json"), "utf8"), saved);
  assert.equal((await post(revised((d) => d.cards[0].uid = webcrypto.randomUUID()))).status, 400);
  assert.equal((await post(revised((d) => { [d.cards[0].uid, d.cards[1].uid] = [d.cards[1].uid, d.cards[0].uid]; }), { type: "edit", uid: source.cards[0].uid })).status, 400);
  assert.equal((await post(source, { type: "reorder" }, "stale")).status, 400);
  assert.equal(fs.readFileSync(path.join(dir, "data/cards.json"), "utf8"), saved);
  const stolen = revised((d) => { const card = d.cards[0]; card.artworkKey = "stolen"; d.artworkVariants[card.id] = d.artworkVariants[card.id].map((variant) => ({ ...variant, src: `./assets/card-art/stolen/${variant.id}.png` })); });
  assert.equal((await post(stolen, { type: "edit", uid: source.cards[0].uid }, revision, { artworkRename: { oldKey: source.cards[1].artworkKey, newKey: "stolen" } })).status, 400);
  assert.equal(fs.readFileSync(path.join(dir, "data/cards.json"), "utf8"), saved);
  const removed = source.cards[0];
  const deleted = revised((d) => { d.cards = d.cards.filter((c) => c.uid !== removed.uid); delete d.artworkVariants[removed.id]; delete d.selectedArtworkIds[removed.id]; });
  assert.equal((await post(deleted, { type: "delete", uid: removed.uid })).status, 200);
  assert.equal((await (await fetch(`${url}/api/cards/state`)).json()).dataset.cards.length, 136);
});

 test("current designer revisions can add effects to formerly blank cards", (t) => {
  const edited = revised((d) => { d.cards.find((c) => c.uid === bridge.blankEffectUids[0]).rulesText = "入场：抽1张牌。"; });
  const exported = exportDirtyDesigns(fixture(t, edited));
  assert.equal(exported.cards.find((c) => c.uid === bridge.blankEffectUids[0]).rulesText, "入场：抽1张牌。");
  assert.equal(exported.policy.blankEffectUids.includes(bridge.blankEffectUids[0]), false);
  assert.equal(bridge.blankEffectUids.length, 4);
});
