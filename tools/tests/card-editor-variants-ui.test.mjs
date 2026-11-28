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
  return { value: "", checked: false, hidden: false, style: { setProperty() {} }, dataset: {}, textContent: "", options: [], children: [],
    classList: { toggle(key, on) { if (on === undefined) on = !classes.has(key); on ? classes.add(key) : classes.delete(key); }, contains: key => classes.has(key), add: key => classes.add(key), remove: key => classes.delete(key) },
    setAttribute() {}, append(child) { this.children.push(child); }, replaceChildren() { this.children = []; }, focus() {}, querySelectorAll() { return []; }, getContext() { return null; } };
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
    document: { createElement() { return node(); }, querySelector: element, querySelectorAll: () => [], body: { style: {} } } };
  context.window = context; context.confirm = () => true;
  let script = fs.readFileSync(path.join(root, "card-editor.js"), "utf8");
  script = script.replace("  window.initFormalCardEditor =", `
    renderArtworkVariantList = () => {}; renderHand = () => {}; renderDerivativeRail = () => {}; renderVersionTabs = () => {}; renderGallery = () => {};
    persist = async () => true;
    globalThis.editor = { load(value) { dataset = value; }, setLayout(value) { layout = value; }, createCardRender, showCard, selectVersion, closeEditor, saveCard, readForm, filteredCards, remapCardIds, artworkFor,
      deleteCurrentCard, addMainCard, addDerivative, createUpgradeDesign, moveMainCardToPosition, busy: () => savingCard,
      category(value) { browseCategory = value; }, getCurrent: () => currentId, getDataset: () => dataset, setPersist(fn) { persist = fn; },
      setArt(variants, selected) { pendingArtworkVariants = variants; pendingSelectedArtworkId = selected; },
      getArt: () => ({ variants: pendingArtworkVariants, selected: pendingSelectedArtworkId }), drafts: () => formDrafts, isEmpty: () => unconfiguredUpgrade };
  window.initFormalCardEditor =`);
  vm.runInNewContext(script, context); context.editor.load(data);
  return { api: context.editor, fields, element, data, form };
}

test("version switches preserve text and original readiness drafts without committing them when saving upgrade text", async () => {
  const base = card("FNG-001"), upgrade = card("FNG-001-UP", { upgradeOfUid: base.uid, collectable: false, collectionKind: "NonCollectible" });
  const h = harness([base, upgrade]);
  h.api.showCard(base.id);
  h.fields.get("rulesText").value = "原版未保存修改";
  h.api.setArt([{id:"unsaved-art", src:"data:image/png;base64,AAAA"}], "unsaved-art");
  h.fields.get("playtestReady").checked = true;
  h.api.selectVersion(true);
  h.fields.get("rulesText").value = "升级版未保存修改";
  assert.equal(h.fields.get("playtestReady").checked, false);
  assert.equal(h.fields.get("playtestReady").disabled, true);
  assert.equal(h.element("#playtestReadyToggle").hidden, true);
  assert.match(h.element("#playtestReadyInherited").textContent, /原版开关尚未保存/);
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
  assert.equal(h.data.cards.find(c => c.uid === base.uid).playtestReady, false);
  assert.equal(h.data.cards.find(c => c.uid === upgrade.uid).playtestReady, false);
  h.api.selectVersion(false);
  assert.equal(h.fields.get("rulesText").value, "原版未保存修改");
  assert.equal(h.fields.get("playtestReady").checked, true);
});

test("saving the original toggles both forms; an older upgrade text draft cannot undo the shared selection", async () => {
  const base = card("FNG-001"), upgrade = card("FNG-001-UP", { upgradeOfUid: base.uid, collectable: false, collectionKind: "NonCollectible" });
  const h = harness([base, upgrade]);
  h.api.showCard(upgrade.id); h.fields.get("rulesText").value = "升级版草稿";
  h.api.selectVersion(false); h.fields.get("playtestReady").checked = true;
  assert.equal(await h.api.saveCard(), true);
  assert.ok(h.data.cards.every(c => c.playtestReady));
  h.api.selectVersion(true);
  assert.equal(h.fields.get("rulesText").value, "升级版草稿");
  assert.match(h.element("#playtestReadyInherited").textContent, /随原版纳入/);
  assert.equal(await h.api.saveCard(), true);
  assert.ok(h.data.cards.every(c => c.playtestReady));
  h.api.selectVersion(false); h.fields.get("playtestReady").checked = false;
  assert.equal(await h.api.saveCard(), true);
  assert.ok(h.data.cards.every(c => !c.playtestReady));
  h.api.selectVersion(true); assert.match(h.element("#playtestReadyInherited").textContent, /暂不纳入/);
});

test("derivative pairs and events keep their own selection independent from the parent pair", async () => {
  const base = card("FNG-001", { playtestReady: true });
  const token = card("FNG-001-01", { parentUid: base.uid, collectable: false, collectionKind: "Token" });
  const upgrade = card("FNG-001-01-UP", { upgradeOfUid: token.uid, collectable: false, collectionKind: "NonCollectible" });
  const event = card("FNG-EV-001", { cardType: "Event", collectable: false, collectionKind: "NonCollectible", arrows: [] });
  const h = harness([base, token, upgrade, event]);
  h.api.showCard(token.id); h.fields.get("playtestReady").checked = true;
  assert.equal(await h.api.saveCard(), true);
  assert.equal(h.data.cards.find(c => c.uid === upgrade.uid).playtestReady, true);
  assert.equal(event.playtestReady, false);
  h.api.showCard(event.id);
  assert.equal(h.element("#playtestReadyToggle").hidden, false);
  assert.equal(h.fields.get("playtestReady").disabled, false);
  assert.match(h.element("#playtestReadyHelp").textContent, /此事件/);
  h.fields.get("playtestReady").checked = true;
  assert.equal(await h.api.saveCard(), true);
  h.api.showCard(base.id); h.fields.get("playtestReady").checked = false;
  assert.equal(await h.api.saveCard(), true);
  assert.ok(h.data.cards.filter(c => c.uid !== base.uid).every(c => c.playtestReady));
});

test("failed pair selection save restores both persisted flags and retains the original checkbox draft", async () => {
  const base = card("FNG-001"), upgrade = card("FNG-001-UP", { upgradeOfUid: base.uid, collectable: false, collectionKind: "NonCollectible" });
  const h = harness([base, upgrade]);
  h.api.showCard(base.id); h.fields.get("playtestReady").checked = true;
  h.api.setPersist(async () => { throw new Error("revision conflict"); });
  assert.equal(await h.api.saveCard(), false);
  assert.ok(h.api.getDataset().cards.every(c => !c.playtestReady));
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


function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

test("deletion locks reused display IDs until persistence finishes: stale form cannot overwrite the next UID", async () => {
  const a = card("FNG-001", { nameKey: "卡牌 A", rulesText: "A 的效果" });
  const b = card("FNG-002", { nameKey: "卡牌 B", rulesText: "B 的效果" });
  const c = card("FNG-003", { nameKey: "卡牌 C", rulesText: "C 的效果" });
  const h = harness([a, b, c]), gate = deferred(), writes = [];
  h.api.showCard(a.id);
  h.api.setPersist(options => { writes.push(options.operation.type); return gate.promise; });
  const deletion = h.api.deleteCurrentCard();
  assert.equal(h.api.busy(), true);
  assert.equal(h.api.getDataset().cards.find(entry => entry.uid === b.uid).id, "FNG-001");
  assert.equal(h.fields.get("nameKey").value, "卡牌 A");
  assert.equal(h.element(".formal-card-editor-shell").inert, true);
  assert.equal(h.element(".formal-card-toolbar").inert, true);
  assert.equal(h.element("#cardCenterGrid").inert, true);
  assert.equal(await h.api.saveCard(), false);
  h.api.showCard(c.id); h.api.selectVersion(true); h.api.closeEditor();
  assert.equal(h.fields.get("nameKey").value, "卡牌 A");
  assert.equal(h.api.isEmpty(), false);
  assert.equal(await h.api.deleteCurrentCard(), false);
  assert.equal(await h.api.addMainCard(), false);
  assert.equal(await h.api.addDerivative(), false);
  assert.equal(await h.api.createUpgradeDesign(), false);
  assert.equal(h.api.moveMainCardToPosition(b.id, c.id, "after"), false);
  assert.deepEqual(writes, ["delete"]);
  gate.resolve(true); assert.equal(await deletion, true);
  assert.equal(h.api.busy(), false); assert.equal(h.element(".formal-card-editor-shell").inert, false);
  assert.equal(h.api.getCurrent(), null);
  const remaining = h.api.getDataset().cards.find(entry => entry.uid === b.uid);
  assert.equal(remaining.nameKey, "卡牌 B"); assert.equal(remaining.rulesText, "B 的效果");
});

for (const failureMode of ["throw", "false"]) {
 test(`failed deletion (${failureMode}) restores identities and unlocks the editor with the original draft intact`, async () => {
  const a = card("FNG-001", { nameKey: "A" }), b = card("FNG-002", { nameKey: "B" });
  const h = harness([a, b]), gate = deferred();
  h.api.showCard(a.id); h.fields.get("rulesText").value = "A 尚未保存";
  h.api.setPersist(() => gate.promise);
  const deletion = h.api.deleteCurrentCard();
  if (failureMode === "throw") gate.reject(new Error("save failed"));
  else gate.resolve(false);
  assert.equal(await deletion, false); assert.equal(h.api.busy(), false);
  assert.equal(h.api.getDataset().cards.find(entry => entry.uid === b.uid).id, "FNG-002");
  assert.equal(h.api.getCurrent(), "FNG-001"); assert.equal(h.fields.get("rulesText").value, "A 尚未保存");
  assert.equal(h.element(".formal-card-editor-shell").inert, false);
  h.api.showCard("FNG-002"); assert.equal(h.fields.get("nameKey").value, "B");
 });
}

for (const action of ["addMainCard", "addDerivative", "createUpgradeDesign", "reorder"]) {
  test(`${action} also holds the shared lock through its asynchronous write`, async () => {
    const a = card("FNG-001", { nameKey: "A" }), b = card("FNG-002", { nameKey: "B" });
    const h = harness([a, b]), gate = deferred(), writes = [];
    h.api.showCard(a.id); h.api.setPersist(options => { writes.push(options?.operation?.type || "reorder"); return gate.promise; });
    const mutation = action === "reorder" ? h.api.moveMainCardToPosition(a.id, b.id, "after") : h.api[action]();
    assert.equal(h.api.busy(), true);
    assert.equal(await h.api.saveCard(), false); assert.equal(await h.api.addMainCard(), false);
    h.api.showCard(b.id); assert.equal(h.fields.get("nameKey").value, "A");
    assert.equal(writes.length, 1);
    gate.resolve(true);
    if (action !== "reorder") assert.equal(await mutation, true);
    else { await gate.promise; await Promise.resolve(); await Promise.resolve(); }
    assert.equal(h.api.busy(), false);
    assert.equal(h.element(".formal-card-editor-shell").inert, false);
    assert.equal(h.api.getDataset().cards.find(entry => entry.uid === b.uid).nameKey, "B");
  });
}


test("event editor disables cost and preserves stored compatibility value while minion cost remains editable", () => {
  const event = card("FNG-EV-001", { cardType: "Event", collectable: false, collectionKind: "NonCollectible", rarity: "Rare", costAmount: 4, arrows: [] });
  const minion = card("FNG-001", { costAmount: 3 });
  const h = harness([event, minion]);
  h.api.showCard(event.id);
  assert.equal(h.form.classList.contains("is-event"), true);
  assert.equal(h.fields.get("costAmount").disabled, true);
  h.fields.get("costAmount").value = "999";
  h.fields.get("rarity").value = "Legendary";
  assert.equal(h.api.readForm().costAmount, 4);
  assert.equal(h.api.readForm().rarity, "Legendary");
  h.api.showCard(minion.id);
  assert.equal(h.form.classList.contains("is-event"), false);
  assert.equal(h.fields.get("costAmount").disabled, false);
  h.fields.get("costAmount").value = "7";
  assert.equal(h.api.readForm().costAmount, 7);
});

test("event board and hand renders show rarity tiers instead of cost layers", () => {
  const event = card("FNG-EV-001", { cardType: "Event", rarity: "Epic", costAmount: 97 });
  const minion = card("FNG-001", { costAmount: 3 });
  const h = harness([event, minion]);
  h.api.setLayout(JSON.parse(fs.readFileSync(path.join(root, "card_layout_ref/layout.json"))));
  for (const view of ["board", "hand"]) {
    const render = h.api.createCardRender(event, view);
    assert.ok(!render.children.some(child => ["cost_badge", "cost_value"].includes(child.dataset.layer)));
    assert.ok(!render.children.some(child => child.className === "formal-board-designer-cost"));
    assert.equal(render.children.find(child => child.className === "formal-event-rarity").textContent, "史诗事件 · III");
  }
  const ordinary = h.api.createCardRender(minion, "board");
  assert.equal(ordinary.children.find(child => child.className === "formal-board-designer-cost").textContent, "3");
  assert.ok(!ordinary.children.some(child => child.className === "formal-event-rarity"));
});

test("event list sorting follows rarity even when legacy cost differs", () => {
  const common = card("FNG-EV-002", { cardType: "Event", collectable: false, rarity: "Common", costAmount: 99 });
  const legendary = card("FNG-EV-001", { cardType: "Event", collectable: false, rarity: "Legendary", costAmount: 0 });
  const h = harness([common, legendary]);
  h.api.category("event");
  h.element("#cardViewSort").value = "cost-asc";
  assert.deepEqual(Array.from(h.api.filteredCards(), c => c.uid), [common.uid, legendary.uid]);
  h.element("#cardViewSort").value = "cost-desc";
  assert.deepEqual(Array.from(h.api.filteredCards(), c => c.uid), [legendary.uid, common.uid]);
});
