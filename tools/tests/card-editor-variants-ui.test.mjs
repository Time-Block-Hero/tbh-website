import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import { fileURLToPath } from "node:url";
import test from "node:test";
import contract from "../../card-design-contract.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const seed = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json"))).cards.find(card => card.collectable && card.collectionKind !== "Hero");
function card(id, values = {}) {
  return { ...structuredClone(seed), uid: webcrypto.randomUUID(), id, parentUid: null, upgradeOfUid: null, playtestReady: false, artworkKey: "", englishName: "", artRequest: 0, artDescription: "", artDescriptionNeedsPolish: false, ...values };
}
function node() {
  const classes = new Set();
  return { value: "", checked: false, hidden: false, style: {}, dataset: {}, textContent: "", options: [],
    classList: { toggle(key, on) { if (on === undefined) on = !classes.has(key); on ? classes.add(key) : classes.delete(key); }, contains: key => classes.has(key), add: key => classes.add(key), remove: key => classes.delete(key) },
    setAttribute() {}, append() {}, replaceChildren() {}, focus() {}, querySelectorAll() { return []; } };
}
function harness(cards) {
  const fields = new Map(), nodes = new Map();
  const form = node(); form.elements = { namedItem(name) { if (!fields.has(name)) fields.set(name, node()); return fields.get(name); } };
  const element = selector => { if (selector === "#cardEditorForm") return form; if (!nodes.has(selector)) nodes.set(selector, node()); return nodes.get(selector); };
  for (const selector of ["#cardFactionFilter", "#cardTypeFilter", "#cardPlaytestFilter"]) element(selector).value = "all";
  element("#cardViewSort").value = "id";
  const data = { schemaVersion: 6, executionSchemaVersion: 21, shared: { statuses: [] }, cards, artworkVariants: {}, selectedArtworkIds: {} };
  const context = { console, structuredClone, crypto: webcrypto, TextEncoder, TbhCardDesign: contract,
    localStorage: { setItem() {}, getItem() { return null; } },
    document: { createElement() { return { getContext() { return null; } }; }, querySelector: element, querySelectorAll: () => [], body: { style: {} } } };
  context.window = context; context.confirm = () => true;
  let script = fs.readFileSync(path.join(root, "card-editor.js"), "utf8");
  script = script.replace("  window.initFormalCardEditor =", `
    renderArtworkVariantList = () => {}; renderHand = () => {}; renderDerivativeRail = () => {}; renderVersionTabs = () => {}; renderGallery = () => {};
    persist = async () => true;
    globalThis.editor = { load(value) { dataset = value; }, showCard, selectVersion, closeEditor, saveCard, readForm, filteredCards, remapCardIds, artworkFor,
      category(value) { browseCategory = value; }, getCurrent: () => currentId, getDataset: () => dataset, setPersist(fn) { persist = fn; },
      setArt(variants, selected) { pendingArtworkVariants = variants; pendingSelectedArtworkId = selected; },
      getArt: () => ({ variants: pendingArtworkVariants, selected: pendingSelectedArtworkId }), drafts: () => formDrafts, isEmpty: () => unconfiguredUpgrade };
  window.initFormalCardEditor =`);
  vm.runInNewContext(script, context); context.editor.load(data);
  return { api: context.editor, fields, element, data, form };
}

test("version switches preserve independent text/readiness drafts; save affects only the selected version", async () => {
  const base = card("FNG-001"), upgrade = card("FNG-001-UP", { upgradeOfUid: base.uid, collectable: false, collectionKind: "NonCollectible" });
  const h = harness([base, upgrade]);
  h.api.showCard(base.id);
  h.fields.get("rulesText").value = "原版未保存修改";
  h.api.setArt([{id:"unsaved-art", src:"data:image/png;base64,AAAA"}], "unsaved-art");
  h.fields.get("playtestReady").checked = true;
  h.api.selectVersion(true);
  h.fields.get("rulesText").value = "升级版未保存修改";
  assert.equal(h.fields.get("playtestReady").checked, false);
  h.api.selectVersion(false);
  assert.equal(h.fields.get("rulesText").value, "原版未保存修改");
  assert.equal(h.api.getArt().selected, "unsaved-art");
  assert.equal(h.api.getArt().variants[0].src, "data:image/png;base64,AAAA");
  assert.equal(h.fields.get("playtestReady").checked, true);
  h.api.selectVersion(true);
  assert.equal(h.fields.get("rulesText").value, "升级版未保存修改");
  assert.equal(await h.api.saveCard(), true);
  assert.equal(h.data.cards.find(c => c.uid === upgrade.uid).rulesText, "升级版未保存修改");
  assert.notEqual(h.data.cards.find(c => c.uid === base.uid).rulesText, "原版未保存修改");
  assert.equal(h.api.drafts().size, 1);
  h.api.selectVersion(false);
  assert.equal(h.fields.get("rulesText").value, "原版未保存修改");
  assert.equal(h.fields.get("playtestReady").checked, true);
});

test("unconfigured upgrade is lazy and preserves the original draft; Event has no version navigation", () => {
  const base = card("FNG-001"), event = card("FNG-EV-001", { cardType: "Event", collectable: false, collectionKind: "NonCollectible", arrows: [] });
  const h = harness([base, event]);
  h.api.showCard(base.id); h.fields.get("rulesText").value = "等待保存";
  h.api.selectVersion(true); assert.equal(h.api.isEmpty(), true); assert.equal(h.data.cards.length, 2);
  h.api.selectVersion(false); assert.equal(h.fields.get("rulesText").value, "等待保存");
  h.api.showCard(event.id); h.api.selectVersion(true);
  assert.equal(h.api.getCurrent(), event.id); assert.equal(h.api.isEmpty(), false);
  assert.equal(h.fields.get("cardType").disabled, true); assert.equal(h.fields.get("collectable").disabled, true);
  const read = h.api.readForm();
  assert.equal(read.collectable, false); assert.equal("health" in read, false); assert.equal(read.arrows.length, 0);
});

test("category and readiness filters are exclusive and hide upgrade and derivative entities", () => {
  const base = card("FNG-001", { playtestReady: true }), ordinary = card("FNG-UN-001", { collectable: false, collectionKind: "NonCollectible" });
  const token = card("FNG-001-01", { parentUid: base.uid, collectable: false, collectionKind: "Token" });
  const upgrade = card("FNG-001-UP", { upgradeOfUid: base.uid, collectable: false, collectionKind: "NonCollectible" });
  const event = card("FNG-EV-001", { cardType: "Event", collectable: false, collectionKind: "NonCollectible" });
  const h = harness([base, ordinary, token, upgrade, event]);
  const ids = () => Array.from(h.api.filteredCards(), c => c.id);
  assert.deepEqual(ids(), [base.id]); h.element("#cardPlaytestFilter").value = "false"; assert.deepEqual(ids(), []);
  h.element("#cardPlaytestFilter").value = "all"; h.api.category("noncollectible"); assert.deepEqual(ids(), [ordinary.id]);
  h.api.category("event"); assert.deepEqual(ids(), [event.id]);
});

test("reordering retains stable relations and remaps both derivative upgrade display IDs and artwork selections", () => {
  const base = card("FNG-001"), token = card("FNG-001-01", { parentUid: base.uid, collectable: false, collectionKind: "Token" });
  const upgrade = card("FNG-001-01-UP", { upgradeOfUid: token.uid, collectable: false, collectionKind: "NonCollectible" });
  const h = harness([base, token, upgrade]);
  h.data.artworkVariants[upgrade.id] = [{ id: `${upgrade.id}-A01`, src: "./assets/card-art/own/own-01.png" }];
  h.data.selectedArtworkIds[upgrade.id] = [`${upgrade.id}-A01`];
  h.api.remapCardIds({ "FNG-001": "FNG-009" });
  assert.equal(token.id, "FNG-009-01"); assert.equal(upgrade.id, "FNG-009-01-UP"); assert.equal(upgrade.upgradeOfUid, token.uid);
  assert.deepEqual(Array.from(h.data.selectedArtworkIds[upgrade.id]), ["FNG-009-01-UP-A01"]);
  assert.equal(h.data.artworkVariants[upgrade.id][0].src, "./assets/card-art/own/own-01.png");
});

test("close prompts for all version drafts and forced discard does not persist them", () => {
  const base = card("FNG-001"), h = harness([base]);
  h.api.showCard(base.id); h.fields.get("rulesText").value = "未保存"; h.api.closeEditor();
  assert.equal(h.element("#unsavedChangesDialog").hidden, false); assert.equal(h.api.getCurrent(), base.id);
  h.api.closeEditor(true); assert.equal(h.api.getCurrent(), null); assert.notEqual(base.rulesText, "未保存");
});

test("upgrade preview references original artwork until independent artwork is selected", () => {
  const base = card("FNG-001"), upgrade = card("FNG-001-UP", { upgradeOfUid: base.uid });
  const h = harness([base, upgrade]);
  h.data.artworkVariants[base.id] = [{ id: "base-01", src: "base.png" }];
  h.data.selectedArtworkIds[base.id] = "base-01";
  assert.equal(h.api.artworkFor(upgrade), "base.png");
  h.data.artworkVariants[upgrade.id] = [{ id: "gold-01", src: "gold.png" }];
  assert.equal(h.api.artworkFor(upgrade), "gold.png"); assert.equal(h.api.artworkFor(base), "base.png");
});


test("save validation errors roll back dataset changes and retain the editable form", async () => {
  const base = card("FNG-001"), h = harness([base]);
  h.api.showCard(base.id); h.fields.get("rulesText").value = "尚未保存的效果";
  h.api.setPersist(async () => { throw new Error("Invalid costAmount"); });
  assert.equal(await h.api.saveCard(), false);
  assert.equal(h.api.getDataset().cards[0].rulesText, base.rulesText);
  assert.equal(h.fields.get("rulesText").value, "尚未保存的效果");
  assert.equal(h.api.drafts().get(base.uid).card.rulesText, "尚未保存的效果");
  assert.match(h.element("#cardSaveStatus").textContent, /未保存.*Invalid costAmount/);
});
