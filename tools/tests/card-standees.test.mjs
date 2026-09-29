import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { syncCardStandees } from "../sync-card-standees.mjs";
import { buildEditorFallback } from "../card-editor-fallback.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const uid = "11111111-1111-4111-8111-111111111111";
const secondUid = "22222222-2222-4222-8222-222222222222";
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tbh-standee-test-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const assets = path.join(dir, "assets-repo"), website = path.join(dir, "website");
  fs.mkdirSync(path.join(assets, "Runtime/Resources/TimeBlockHeroAssets/Stillfield"), { recursive: true });
  fs.mkdirSync(path.join(website, "data"), { recursive: true });
  fs.mkdirSync(path.join(website, "card_layout_ref"));
  fs.writeFileSync(path.join(website, "data/cards.json"), JSON.stringify({ cards: [{ uid, id: "OLD-001", nameKey: "示例", cardType: "Minion" }] }));
  fs.writeFileSync(path.join(website, "card_layout_ref/layout.json"), "{}");
  const bytes = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4d8AAAAASUVORK5CYII=", "base64");
  const imagePath = path.join(assets, `Runtime/Resources/TimeBlockHeroAssets/Stillfield/${uid}.png`);
  const rosterPath = path.join(assets, "Runtime/Resources/TimeBlockHeroAssets/stillfield-roster.json");
  fs.writeFileSync(imagePath, bytes);
  const entry = { definitionUid: uid, resourcePath: `TimeBlockHeroAssets/Stillfield/${uid}`, sha256: digest(bytes), pixelWidth: 1, pixelHeight: 1, status: "ready" };
  const writeRoster = (cards) => fs.writeFileSync(rosterPath, JSON.stringify({ cards }));
  const git = (...args) => execFileSync("git", ["-C", assets, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init");
  const commit = () => { git("add", "."); git("-c", "user.name=Standee Test", "-c", "user.email=standee@example.invalid", "commit", "-qm", "fixture"); return git("rev-parse", "HEAD"); };
  writeRoster([entry]);
  return { assets, root: website, commit: commit(), entry, imagePath, writeRoster, save: commit };
}

test("sync is committed-source, UID-based, repeatable and retains offline standee metadata", (t) => {
  const f = fixture(t);
  syncCardStandees(f);
  const manifest = fs.readFileSync(path.join(f.root, "data/card-standees.json"), "utf8");
  const source = JSON.parse(manifest);
  assert.equal(source.source.commit, f.commit);
  assert.equal(source.entries[0].definitionUid, uid);
  f.writeRoster([]); // A dirty source roster must not become publication evidence.
  fs.writeFileSync(path.join(f.root, "data/cards.json"), JSON.stringify({ cards: [{ uid, id: "NEW-999", nameKey: "改名", cardType: "Minion" }] }));
  syncCardStandees(f);
  assert.equal(fs.readFileSync(path.join(f.root, "data/card-standees.json"), "utf8"), manifest);
  assert.equal(syncCardStandees({ ...f, check: true }).count, 1);
  const context = { window: {} };
  vm.runInNewContext(buildEditorFallback(f.root, {}, {}), context);
  assert.equal(context.window.__CARD_EDITOR_FALLBACK__.standees.entries[0].sha256, f.entry.sha256);
});

test("sync rejects duplicate, unknown and unsafe-path identities before writing", (t) => {
  const f = fixture(t);
  for (const [entries, expected] of [
    [[f.entry, f.entry], /重复/],
    [[{ ...f.entry, definitionUid: secondUid }], /未知/],
    [[{ ...f.entry, resourcePath: "../../outside" }], /路径/],
  ]) {
    f.writeRoster(entries); f.commit = f.save();
    assert.throws(() => syncCardStandees(f), expected);
    assert.equal(fs.existsSync(path.join(f.root, "data/card-standees.json")), false);
  }
});

test("sync fails closed for incomplete roster, altered images and mismatched committed hashes", (t) => {
  const f = fixture(t);
  f.writeRoster([]); f.commit = f.save();
  assert.throws(() => syncCardStandees(f), /缺少 1/);
  assert.equal(syncCardStandees({ ...f, allowMissing: true }).count, 0);
  f.writeRoster([f.entry]); f.commit = f.save();
  fs.appendFileSync(f.imagePath, "changed");
  assert.throws(() => syncCardStandees(f), /SHA-256/);
  f.writeRoster([{ ...f.entry, sha256: digest(fs.readFileSync(f.imagePath)) }]);
  // Commit only the roster; the image still differs from the selected commit.
  execFileSync("git", ["-C", f.assets, "add", "Runtime/Resources/TimeBlockHeroAssets/stillfield-roster.json"]);
  execFileSync("git", ["-C", f.assets, "-c", "user.name=Test", "-c", "user.email=test@example.invalid", "commit", "-qm", "roster only"]);
  f.commit = execFileSync("git", ["-C", f.assets, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  assert.throws(() => syncCardStandees(f), /指定提交/);
});

function editorHarness() {
  const node = () => ({ children: [], hidden: false, attributes: {}, dataset: {}, textContent: "", addEventListener(name, handler) { this[name] = handler; }, replaceChildren(...children) { this.children = children; }, append(...children) { this.children.push(...children); }, contains(child) { return this.children.includes(child); }, setAttribute(key, value) { this.attributes[key] = value; } });
  const hand = node(), standee = node();
  const tabs = ["card", "standee"].map((name) => Object.assign(node(), { dataset: { previewTab: name } }));
  const form = { value: "尚未保存的卡文" };
  const context = { console, document: { createElement: (tag) => tag === "canvas" ? { getContext: () => ({}) } : node(), querySelector: (selector) => ({ "#cardHandPreview": hand, "#cardStandeePreview": standee, "#cardEditorForm": form })[selector], querySelectorAll: () => tabs } };
  context.window = context;
  const script = fs.readFileSync(path.join(root, "card-editor.js"), "utf8").replace("  window.initFormalCardEditor =", "  globalThis.standeeTest = { renderStandee, selectPreviewTab, load: (value) => standees = value };\n  window.initFormalCardEditor =");
  vm.runInNewContext(script, context);
  return { ...context.standeeTest, hand, standee, tabs, form };
}

test("actual preview resolves immutable UID, preserves form on tab switch, and separates missing/non-unit states", () => {
  const h = editorHarness();
  h.load({ entries: [{ definitionUid: uid, src: `./assets/card-standees/${uid}.png` }] });
  h.renderStandee({ uid, id: "CHANGED-999", nameKey: "改名角色", cardType: "Minion" });
  assert.equal(h.standee.children[0].src, `./assets/card-standees/${uid}.png`);
  h.selectPreviewTab("standee");
  assert.equal(h.hand.hidden, true);
  assert.equal(h.tabs[1].attributes["aria-selected"], "true");
  h.selectPreviewTab("card");
  assert.equal(h.form.value, "尚未保存的卡文");
  for (const type of ["Spell", "Resource"]) {
    h.renderStandee({ uid, cardType: type });
    assert.equal(h.standee.children[0].textContent, "此类型不使用角色立绘");
  }
  h.renderStandee({ uid: secondUid, cardType: "Minion" });
  assert.match(h.standee.children[0].textContent, /尚未收录/);
  h.renderStandee({ uid, nameKey: "角色", cardType: "Minion" });
  h.standee.children[0].error();
  assert.match(h.standee.children[0].textContent, /无法加载/);
});

test("checked-in mirrored standees match their SHA and offline manifest", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/card-standees.json")));
  assert.equal(new Set(manifest.entries.map((entry) => entry.definitionUid)).size, manifest.entries.length);
  const currentCards = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json"))).cards;
  assert.deepEqual(manifest.entries.map((entry) => entry.definitionUid).sort(), currentCards.filter((card) => card.cardType === "Minion").map((card) => card.uid).sort());
  for (const entry of manifest.entries) assert.equal(digest(fs.readFileSync(path.join(root, entry.src))), entry.sha256);
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, "card-editor-data.js"), "utf8"), context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.__CARD_EDITOR_FALLBACK__.standees)), manifest);
});

test("direct-file initialization loads standee fallback without an HTTP request", async () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/card-standees.json")));
  const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json")));
  const context = {
    console, structuredClone,
    document: { createElement: () => ({ getContext: () => ({}) }) },
    localStorage: { getItem: () => null },
    fetch: () => { throw new Error("file preview must not fetch"); },
    location: { protocol: "file:" },
    __CARD_EDITOR_FALLBACK__: { cards: dataset, layout: {}, standees: manifest },
  };
  context.window = context;
  const script = fs.readFileSync(path.join(root, "card-editor.js"), "utf8").replace("  window.initFormalCardEditor =", `
  populateFactionInputs = () => {}; populateTribeInputs = () => {}; bindEvents = () => {}; renderGallery = () => {};
  normalizeDatasetForCurrentRules = () => false; loadLocalState = value => value; readLocalState = () => null; setStatus = () => {};
  globalThis.offlineTest = { initialize, getStandees: () => standees };
  window.initFormalCardEditor =`);
  vm.runInNewContext(script, context);
  await context.offlineTest.initialize();
  assert.deepEqual(context.offlineTest.getStandees(), manifest);
});
