import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const formal = JSON.parse(fs.readFileSync(path.join(root, "formal_card_ref.json"), "utf8"));
const oldData = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json"), "utf8"));

const heroIds = {
  "SA-UN-001": "SA-000",
  "SC-UN-001": "SC-000",
  "AI-UN-001": "AI-000",
  "MCC-UN-001": "MCC-000",
};

const tribes = ["机械", "人类", "反抗军", "奇兽", "空亡体", "星云体", "兽裔(Avatar)", "晶灵"];
const tribeAliases = {
  Mech: "机械",
  Human: "人类",
  Pirate: "反抗军",
  HollowNull: "空亡体",
  "Hollow-Null": "空亡体",
  Avatar: "兽裔(Avatar)",
};

const derivativeIds = {
  "SC-UN-002": "SC-002-01",
  "SC-UN-003": "SC-002-02",
  "SC-UN-004": "SC-005-01",
  "SC-UN-005": "SC-011-01",
  "MCC-UN-002": "MCC-015-01",
};

const legacyCards = [
  ...(Array.isArray(oldData.cards) ? oldData.cards : []),
  ...(Array.isArray(oldData.customCards) ? oldData.customCards : []),
  ...Object.values(oldData.overrides || {}),
];
const legacyByName = new Map();
const legacyById = new Map();
const legacyByArtPath = new Map();
for (const card of legacyCards) {
  const name = card.nameKey || card.zh;
  const cardId = card.id || card._id;
  const current = (cardId && legacyById.get(cardId)) || (name && legacyByName.get(name)) || {};
  const existingDescription = card.artDescription || card.aiText || card.flavorText || card.desc || "";
  const legacy = {
    englishName: card.englishName || current.englishName || "",
    artworkKey: card.artworkKey || current.artworkKey || "",
    artDescription: existingDescription || current.artDescription || "",
    artDescriptionNeedsPolish: typeof card.artDescriptionNeedsPolish === "boolean"
      ? card.artDescriptionNeedsPolish
      : (card.aiText ? false : (current.artDescriptionNeedsPolish ?? true)),
    artRequest: Number.isFinite(Number(card.artRequest))
      ? Math.max(0, Math.trunc(Number(card.artRequest)))
      : current.artRequest,
  };
  if (name) legacyByName.set(name, legacy);
  if (cardId) legacyById.set(cardId, legacy);
  if (card.artPath) legacyByArtPath.set(card.artPath, legacy);
}

const existingArtworkVariants = structuredClone(oldData.artworkVariants || {});
const existingSelectedArtworkIds = structuredClone(oldData.selectedArtworkIds || {});
const removedLegacyCardIds = new Set(legacyCards
  .filter((card) => (card.classId || card.faction) === "Neutral" && card.tags?.includes("InitialHero"))
  .map((card) => card.id || card._id));
for (const [cardId, src] of Object.entries(oldData.cardImages || {})) {
  if (!src || existingArtworkVariants[cardId]?.length) continue;
  const variantId = `${cardId}-A01`;
  existingArtworkVariants[cardId] = [{ id: variantId, src }];
  existingSelectedArtworkIds[cardId] = variantId;
}

const cards = formal.cards
  .filter((source) => !(source.classId === "Neutral" && source.tags?.includes("InitialHero")))
  .map((source) => {
  const isHero = source.tags?.includes("InitialHero");
  const id = heroIds[source.id] || derivativeIds[source.id] || source.id;
  const legacy = legacyByArtPath.get(source.artPath) || legacyByName.get(source.nameKey) || legacyById.get(id) || legacyById.get(source.id) || {};
  const card = {
    id,
    nameKey: source.nameKey || "",
    englishName: source.englishName || legacy.englishName || "",
    cardType: source.cardType || "Minion",
    classId: source.classId || "Neutral",
    rarity: source.rarity || "Common",
    collectable: isHero ? true : Boolean(source.collectable),
    costResource: source.costResource || "Star",
    costAmount: Number(source.costAmount || 0),
    durability: Number(source.durability || 0),
    rulesText: source.rulesText || "",
    arrows: Array.isArray(source.arrows) ? source.arrows : [],
    tags: Array.isArray(source.tags) ? source.tags : [],
    artPath: source.artPath || "",
    artworkKey: legacy.artworkKey || "",
    artDescription: legacy.artDescription || "",
    artDescriptionNeedsPolish: legacy.artDescriptionNeedsPolish ?? true,
    artRequest: legacy.artRequest ?? (existingArtworkVariants[id]?.length ? 0 : 1),
  };
  if (card.cardType === "Minion") {
    card.attack = Number(source.attack || 0);
    card.health = Number(source.health || 0);
    card.movement = Number(source.movement || 0);
    card.tribes = [...new Set((Array.isArray(source.tribes) ? source.tribes : [])
      .map((tribe) => tribeAliases[tribe] || tribe)
      .filter((tribe) => tribes.includes(tribe)))];
  }
  return card;
});

const isDerivative = (id) => /^.+-\d{3}-\d{2}$/.test(id);
const getParentId = (id) => isDerivative(id) ? id.replace(/-\d{2}$/, "") : id;
const sequence = (id) => Number(id.match(/-(\d{3})$/)?.[1] || 0);
const factionPrefixes = {
  Neutral: "FNG",
  SkyborneAlliance: "SA",
  SolarChurch: "SC",
  AstraImperium: "AI",
  MachineHeaven: "MCC",
};
const rootIdMapping = {};
for (const classId of Object.keys(factionPrefixes)) {
  for (const collectable of [true, false]) {
    const roots = cards
      .filter((card) => !isDerivative(card.id) && card.classId === classId && Boolean(card.collectable) === collectable)
      .sort((a, b) => {
        const aHero = a.tags.includes("InitialHero");
        const bHero = b.tags.includes("InitialHero");
        if (aHero !== bHero) return aHero ? -1 : 1;
        return sequence(a.id) - sequence(b.id) || a.id.localeCompare(b.id, "en", { numeric: true });
      });
    let regularOrder = 0;
    roots.forEach((card) => {
      const number = card.tags.includes("InitialHero") ? "000" : String(++regularOrder).padStart(3, "0");
      rootIdMapping[card.id] = collectable
        ? `${factionPrefixes[classId]}-${number}`
        : `${factionPrefixes[classId]}-UN-${number}`;
    });
  }
}

const cardIdMapping = { ...rootIdMapping };
for (const card of cards) {
  if (!isDerivative(card.id)) continue;
  const oldParentId = getParentId(card.id);
  cardIdMapping[card.id] = `${rootIdMapping[oldParentId] || oldParentId}-${card.id.split("-").at(-1)}`;
}
for (const card of cards) card.id = cardIdMapping[card.id] || card.id;
const migratedCardById = new Map(cards.map((card) => [card.id, card]));
const factionOrder = Object.keys(factionPrefixes);
cards.sort((a, b) => {
  const aRoot = migratedCardById.get(getParentId(a.id)) || a;
  const bRoot = migratedCardById.get(getParentId(b.id)) || b;
  const factionDelta = factionOrder.indexOf(aRoot.classId) - factionOrder.indexOf(bRoot.classId);
  if (factionDelta) return factionDelta;
  const collectableDelta = Number(Boolean(bRoot.collectable)) - Number(Boolean(aRoot.collectable));
  if (collectableDelta) return collectableDelta;
  const sequenceDelta = sequence(aRoot.id) - sequence(bRoot.id);
  if (sequenceDelta) return sequenceDelta;
  if (a.id === aRoot.id) return -1;
  if (b.id === bRoot.id) return 1;
  return a.id.localeCompare(b.id, "en", { numeric: true });
});

const migratedIdByLegacyId = new Map();
for (const legacyCard of legacyCards) {
  const match = (legacyCard.artPath && cards.find((card) => card.artPath === legacyCard.artPath))
    || cards.find((card) => card.nameKey === (legacyCard.nameKey || legacyCard.zh)
      && card.classId === (legacyCard.classId || legacyCard.faction)
      && card.cardType === (legacyCard.cardType || legacyCard.type));
  const legacyId = legacyCard.id || legacyCard._id;
  if (legacyId && match) migratedIdByLegacyId.set(legacyId, match.id);
}

const artworkVariants = {};
const variantIdMapping = {};
for (const [oldCardId, variants] of Object.entries(existingArtworkVariants)) {
  if (removedLegacyCardIds.has(oldCardId)) continue;
  const newCardId = migratedIdByLegacyId.get(oldCardId) || cardIdMapping[oldCardId] || oldCardId;
  artworkVariants[newCardId] = variants.map((variant) => {
    const id = variant.id.startsWith(`${oldCardId}-A`)
      ? `${newCardId}${variant.id.slice(oldCardId.length)}`
      : variant.id;
    variantIdMapping[variant.id] = id;
    return { ...variant, id };
  });
}

const selectedArtworkIds = {};
for (const [oldCardId, variantId] of Object.entries(existingSelectedArtworkIds)) {
  if (removedLegacyCardIds.has(oldCardId)) continue;
  selectedArtworkIds[migratedIdByLegacyId.get(oldCardId) || cardIdMapping[oldCardId] || oldCardId] = variantIdMapping[variantId] || variantId;
}

const output = {
  schemaVersion: 3,
  sourceSchemaVersion: formal.schemaVersion,
  source: "formal_card_ref.json",
  cards,
  artworkVariants,
  selectedArtworkIds,
  customRaces: tribes,
};

fs.writeFileSync(path.join(root, "data/cards.json"), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Migrated ${cards.length} cards (${cards.filter((card) => card.collectable).length} collectable).`);
await import("./build-card-editor-fallback.mjs");
