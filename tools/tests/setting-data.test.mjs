import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildSettingData, validateSettingAssets } from "../build-setting-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const config = JSON.parse(fs.readFileSync(path.join(root, "data/setting.json"), "utf8"));
const cards = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json"), "utf8"));

test("current dossiers preserve named people and distinct forms without old placeholder identities", () => {
  const data = buildSettingData(config, cards);
  const ids = new Set(data.characters.map((item) => item.id));
  for (const id of ["vera", "mira", "jinbai", "noa", "aletheia", "luolan", "nyx", "drake", "ald", "magellan", "alesta", "emilys", "sola", "elaine", "weiyang"]) {
    assert.ok(ids.has(id), `Missing approved character ${id}`);
  }
  for (const id of ["xianyue", "reinhardt", "ling", "helios", "sancheres", "evelyn", "saifa", "grant"]) {
    assert.ok(!ids.has(id), `Retired placeholder ${id} returned`);
  }
  assert.equal(data.characters.find((item) => item.id === "vera").name, "铁驭姬-维拉");
  assert.equal(data.characters.find((item) => item.id === "drake").sources.length, 2);
  assert.equal(data.characters.find((item) => item.id === "jinbai").sources.length, 2);
  assert.equal(data.background.body, null);
  assert.equal(data.factions.length, 4);
  validateSettingAssets(data, root);
});

test("card reorder and new numeric IDs cannot change dossier identity or selected artwork", () => {
  const before = buildSettingData(config, cards);
  const reordered = structuredClone(cards);
  reordered.cards.reverse();
  reordered.artworkVariants = {};
  reordered.selectedArtworkIds = {};
  reordered.cards.forEach((card, index) => {
    const oldId = card.id;
    card.id = `REORDERED-${index}`;
    reordered.artworkVariants[card.id] = cards.artworkVariants[oldId];
    reordered.selectedArtworkIds[card.id] = cards.selectedArtworkIds[oldId];
  });
  const after = buildSettingData(config, reordered);
  assert.deepEqual(after.characters.map(({ id, name, cover }) => ({ id, name, cover })), before.characters.map(({ id, name, cover }) => ({ id, name, cover })));
});

test("new card text and selected artwork are derived without overwriting either input", () => {
  const changed = structuredClone(cards);
  const vera = changed.cards.find((card) => card.artworkKey === "titan-maiden-vera");
  vera.rulesText = "更新的卡牌效果";
  vera.artDescription = "Updated card art description.";
  changed.artworkVariants[vera.id].push({ id: "new-variant", src: "./new-variant.png" });
  changed.selectedArtworkIds[vera.id] = "new-variant";
  const inputBefore = JSON.stringify({ config, changed });
  const resolved = buildSettingData(config, changed).characters.find((item) => item.id === "vera");
  assert.equal(resolved.rulesText, vera.rulesText);
  assert.equal(resolved.artDescription, vera.artDescription);
  assert.equal(resolved.cover, "./new-variant.png");
  assert.equal(JSON.stringify({ config, changed }), inputBefore);
});

test("missing, renamed, duplicated, or repurposed identities fail instead of falling back to IDs", () => {
  const missing = structuredClone(cards);
  missing.cards = missing.cards.filter((card) => card.artworkKey !== "titan-maiden-vera");
  assert.throws(() => buildSettingData(config, missing), /Missing source identity/);
  const renamed = structuredClone(cards);
  renamed.cards.find((card) => card.artworkKey === "titan-maiden-vera").artworkKey = "new-vera-key";
  assert.throws(() => buildSettingData(config, renamed), /Missing source identity/);
  const duplicate = structuredClone(cards);
  duplicate.cards.push({ ...duplicate.cards.find((card) => card.artworkKey === "titan-maiden-vera"), id: "DUPLICATE" });
  assert.throws(() => buildSettingData(config, duplicate), /Ambiguous artworkKey/);
  const repurposed = structuredClone(cards);
  repurposed.cards.find((card) => card.artworkKey === "titan-maiden-vera").nameKey = "无关角色";
  assert.throws(() => buildSettingData(config, repurposed), /Source identity mismatch/);
});

test("broken selected artwork does not silently promote a candidate", () => {
  const broken = structuredClone(cards);
  const vera = broken.cards.find((card) => card.artworkKey === "titan-maiden-vera");
  broken.selectedArtworkIds[vera.id] = "missing-selection";
  assert.throws(() => buildSettingData(config, broken), /Missing selected artwork/);
});

test("story-only identities and uncreated assets remain explicitly incomplete", () => {
  const data = buildSettingData(config, cards);
  for (const character of data.characters) {
    assert.equal(character.assets.conceptSheet, null);
    assert.equal(character.assets.chibi, null);
    assert.equal(character.description, null);
    assert.equal(character.status, "incomplete");
  }
  for (const id of ["elaine", "weiyang"]) {
    const character = data.characters.find((item) => item.id === id);
    assert.equal(character.cover, null);
    assert.deepEqual(character.sources, []);
  }
});
