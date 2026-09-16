import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Resolve identities before reading current card IDs or selected artwork. */
export function buildSettingData(config, cardData, summaries = {}) {
  if (config.schemaVersion !== 1)
    throw new Error("Unsupported setting schema version");
  const byKey = new Map();
  for (const card of cardData.cards) {
    if (!card.artworkKey) continue;
    if (byKey.has(card.artworkKey))
      throw new Error(`Ambiguous artworkKey: ${card.artworkKey}`);
    byKey.set(card.artworkKey, card);
  }
  const resolve = (key, identityNameIncludes) => {
    const card = byKey.get(key);
    if (!card)
      throw new Error(
        `Missing source identity: ${key}; update the explicit dossier mapping after a rename`,
      );
    if (identityNameIncludes && !card.nameKey.includes(identityNameIncludes)) {
      throw new Error(
        `Source identity mismatch: ${key} no longer names ${identityNameIncludes}`,
      );
    }
    const selectedId = cardData.selectedArtworkIds?.[card.id];
    const selected = (cardData.artworkVariants?.[card.id] || []).find(
      (item) => item.id === selectedId,
    );
    if (selectedId && !selected)
      throw new Error(`Missing selected artwork: ${card.id} / ${selectedId}`);
    return {
      cardId: card.id,
      artworkKey: key,
      name: card.nameKey,
      englishName: card.englishName || null,
      classId: card.classId,
      cardType: card.cardType,
      rulesText: card.rulesText || "",
      artDescription: card.artDescription || "",
      selectedArtworkId: selected?.id || null,
      cover: selected?.src || null,
    };
  };

  const factions = config.factions.map((faction) => ({
    ...faction,
    sourceCards: faction.sourceArtworkKeys.map((key) => resolve(key)),
  }));
  if (
    factions.length !== 4 ||
    new Set(factions.map((item) => item.classId)).size !== 4
  ) {
    throw new Error(
      "Exactly four distinct non-neutral class concepts are required",
    );
  }
  const factionByClass = new Map(
    factions.map((faction) => [faction.classId, faction.id]),
  );
  const seen = new Set();
  const characters = config.characters.map((entry) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id) || seen.has(entry.id)) {
      throw new Error(`Invalid or duplicate dossier ID: ${entry.id}`);
    }
    seen.add(entry.id);
    const sources = entry.sourceArtworkKeys.map((key) =>
      resolve(key, entry.identityNameIncludes),
    );
    const primary = sources[0];
    if (!primary && !entry.retainedIdentity)
      throw new Error(`Dossier ${entry.id} has no approved identity source`);
    if (
      primary &&
      sources.some((source) => source.classId !== primary.classId)
    ) {
      throw new Error(
        `Dossier ${entry.id} has conflicting classes; review the identity map`,
      );
    }
    const identity = primary || entry.retainedIdentity;
    const cover = primary?.cover || null;
    const summary = summaries[entry.id];
    const basis = sources.map((source) => ({
      artworkKey: source.artworkKey,
      name: source.name,
      artDescription: source.artDescription,
    }));
    const hash = createHash("sha256")
      .update(JSON.stringify(basis))
      .digest("hex");
    const currentSummary =
      summary &&
      summary.sourceDesignHash === hash &&
      JSON.stringify(summary.sourceArtworkKeys) ===
        JSON.stringify(entry.sourceArtworkKeys)
        ? { zh: summary.zh, en: summary.en }
        : null;
    return {
      id: entry.id,
      name: identity.name,
      englishName: identity.englishName,
      classId: identity.classId,
      faction: factionByClass.get(identity.classId) || "neutral",
      status: "incomplete",
      description: null,
      appearanceSummary: currentSummary,
      artDescription: primary?.artDescription || "",
      rulesText: primary?.rulesText || "",
      cover,
      sourceArtworkKeys: entry.sourceArtworkKeys,
      identityNameIncludes: entry.identityNameIncludes || null,
      sources,
      sourceNote: primary
        ? "人物身份与美术描述来自最新卡牌设计；完整档案尚未完成。"
        : entry.retainedIdentity.reason,
      assetStatus: "人物设定板、补充插画与小人资产待完善。",
      assets: { cover, conceptSheet: null, illustrations: [], chibi: null },
      assetStates: {
        cover: cover ? "selected-card-art" : "incomplete",
        conceptSheet: "incomplete",
        illustrations: "optional",
        chibi: "incomplete",
      },
    };
  });
  return {
    schemaVersion: 1,
    background: config.background,
    factions,
    characters,
  };
}

export function validateSettingAssets(data, directory = root) {
  const images = [
    ...data.factions.map((faction) => faction.image),
    ...data.characters.flatMap((character) =>
      character.sources.map((source) => source.cover),
    ),
  ].filter(Boolean);
  for (const image of images) {
    const absolute = path.resolve(directory, image);
    if (
      !absolute.startsWith(`${path.resolve(directory)}${path.sep}`) ||
      !fs.existsSync(absolute)
    ) {
      throw new Error(`Missing or nonlocal setting asset: ${image}`);
    }
  }
}

export function buildSettingFile(directory = root) {
  const config = JSON.parse(
    fs.readFileSync(path.join(directory, "data/setting.json"), "utf8"),
  );
  const cards = JSON.parse(
    fs.readFileSync(path.join(directory, "data/cards.json"), "utf8"),
  );
  const summaries = JSON.parse(
    fs.readFileSync(
      path.join(directory, "data/character-summaries.json"),
      "utf8",
    ),
  );
  const data = buildSettingData(config, cards, summaries);
  validateSettingAssets(data, directory);
  const output = `/* Generated by tools/build-setting-data.mjs; edit data/setting.json and data/cards.json instead. */\nwindow.__SETTING_DATA__ = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.join(directory, "setting-data.js"), output);
  return data;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const data = buildSettingFile();
  console.log(
    `Built setting-data.js: ${data.characters.length} character dossiers, ${data.factions.length} class concepts.`,
  );
}
