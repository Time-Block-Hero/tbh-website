import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cardsPath = path.join(root, "data", "cards.json");
const formalPath = path.join(root, "formal_card_ref.json");
const referencePath = path.join(root, "ReferenceDocs", "cards (1).json");

const dataset = JSON.parse(fs.readFileSync(cardsPath, "utf8"));
const formal = JSON.parse(fs.readFileSync(formalPath, "utf8"));
const skyborneCards = dataset.cards.filter(
  (card) => card.classId === "SkyborneAlliance",
);
const tribeAliases = {
  Mech: "机械",
  Human: "人类",
  Pirate: "反抗军",
  Resistance: "反抗军",
  HollowNull: "空亡体",
  "Hollow-Null": "空亡体",
  Avatar: "兽裔(Avatar)",
};

if (!skyborneCards.length)
  throw new Error("data/cards.json contains no SkyborneAlliance cards.");
if (
  new Set(skyborneCards.map((card) => card.id)).size !== skyborneCards.length
) {
  throw new Error(
    "data/cards.json contains duplicate SkyborneAlliance card IDs.",
  );
}
if (
  new Set(dataset.cards.map((card) => card.id)).size !== dataset.cards.length
) {
  throw new Error("data/cards.json contains duplicate card IDs.");
}

dataset.sourceSchemaVersion = dataset.schemaVersion;
dataset.source = "data/cards.json";

function gameplayProjection(card, normalizeTribes = false) {
  const tribes =
    card.cardType === "Minion" && Array.isArray(card.tribes) ? card.tribes : [];
  return {
    id: card.id,
    cardType: card.cardType || "Minion",
    classId: card.classId,
    rarity: card.rarity || "Common",
    collectable: Boolean(card.collectable),
    costResource: card.costResource || "Star",
    costAmount: Number(card.costAmount || 0),
    attack: card.cardType === "Minion" ? Number(card.attack || 0) : 0,
    health: card.cardType === "Minion" ? Number(card.health || 0) : 0,
    movement: card.cardType === "Minion" ? Number(card.movement || 0) : 0,
    durability: Number(card.durability || 0),
    rulesText: card.rulesText || "",
    arrows: Array.isArray(card.arrows) ? card.arrows : [],
    tribes: normalizeTribes
      ? tribes.map((tribe) => tribeAliases[tribe] || tribe)
      : tribes,
    tags: Array.isArray(card.tags) ? card.tags : [],
  };
}

function hasSameGameplay(existing, card) {
  if (!existing) return false;
  return (
    JSON.stringify(gameplayProjection(existing, true)) ===
    JSON.stringify(gameplayProjection(card))
  );
}

function toFormalCard(card, existing) {
  const preserveRuntime = hasSameGameplay(existing, card);
  const formalCard = {
    id: card.id,
    nameKey: card.nameKey || "",
    cardType: card.cardType || "Minion",
    classId: card.classId,
    rarity: card.rarity || "Common",
    collectable: Boolean(card.collectable),
    costResource: card.costResource || "Star",
    costAmount: Number(card.costAmount || 0),
    attack: card.cardType === "Minion" ? Number(card.attack || 0) : 0,
    health: card.cardType === "Minion" ? Number(card.health || 0) : 0,
    movement: card.cardType === "Minion" ? Number(card.movement || 0) : 0,
    durability: Number(card.durability || 0),
    rulesText: card.rulesText || "",
    upgradeToCardId: preserveRuntime
      ? (existing.upgradeToCardId ?? null)
      : null,
    arrows: Array.isArray(card.arrows) ? card.arrows : [],
    tribes:
      preserveRuntime && Array.isArray(existing.tribes)
        ? existing.tribes
        : card.cardType === "Minion" && Array.isArray(card.tribes)
          ? card.tribes
          : [],
    tags: Array.isArray(card.tags) ? card.tags : [],
    abilityRefs:
      preserveRuntime && Array.isArray(existing.abilityRefs)
        ? existing.abilityRefs
        : [],
    continuousEffectRefs:
      preserveRuntime && Array.isArray(existing.continuousEffectRefs)
        ? existing.continuousEffectRefs
        : [],
    artPath: card.artPath || "",
    englishName: card.englishName || "",
    runtimeSupport: preserveRuntime
      ? existing.runtimeSupport || "Implemented"
      : "Deferred",
    runtimeSupportNote: preserveRuntime
      ? (existing.runtimeSupportNote ?? null)
      : "Synced from data/cards.json; structured runtime effects require re-authoring.",
    grantableContinuousEffectRefs:
      preserveRuntime && Array.isArray(existing.grantableContinuousEffectRefs)
        ? existing.grantableContinuousEffectRefs
        : [],
  };
  for (const key of ["upgradeToCardIds", "placeCost", "quantitizedCardTags"]) {
    if (preserveRuntime && Object.hasOwn(existing, key))
      formalCard[key] = existing[key];
  }
  return formalCard;
}

const existingById = new Map(formal.cards.map((card) => [card.id, card]));
const previousCardIds = [...existingById.keys()].sort(
  (a, b) => b.length - a.length,
);
const canonicalIds = new Set(dataset.cards.map((card) => card.id));
const staleOwners = new Set(
  previousCardIds.filter((id) => {
    const canonical = dataset.cards.find((card) => card.id === id);
    return !canonical || !hasSameGameplay(existingById.get(id), canonical);
  }),
);

function artifactOwner(artifactId) {
  return previousCardIds.find(
    (cardId) =>
      artifactId === cardId ||
      artifactId.startsWith(`${cardId}.`) ||
      artifactId.startsWith(`${cardId}-`),
  );
}

function keepStructuredArtifact(artifactId) {
  const owner = artifactOwner(String(artifactId || ""));
  return !owner || (canonicalIds.has(owner) && !staleOwners.has(owner));
}

formal.cards = dataset.cards.map((card) =>
  toFormalCard(card, existingById.get(card.id)),
);
formal.continuousEffects = (formal.continuousEffects || []).filter((entry) =>
  keepStructuredArtifact(entry.id),
);
formal.abilities = (formal.abilities || []).filter((entry) =>
  keepStructuredArtifact(entry.id),
);
formal.plans = (formal.plans || []).filter((entry) =>
  keepStructuredArtifact(entry.planId),
);

fs.writeFileSync(cardsPath, `${JSON.stringify(dataset, null, 2)}\n`);
fs.writeFileSync(formalPath, `${JSON.stringify(formal, null, 2)}\n`);
fs.writeFileSync(referencePath, `${JSON.stringify(dataset, null, 2)}\n`);

await import(`./build-card-editor-fallback.mjs?sync=${Date.now()}`);
const { buildSettingFile } = await import("./build-setting-data.mjs");
buildSettingFile(root);
await import(`./build-bestiary.mjs?sync=${Date.now()}`);
console.log(
  `Synced ${dataset.cards.length} cards (${skyborneCards.length} Skyborne Alliance) from data/cards.json.`,
);
