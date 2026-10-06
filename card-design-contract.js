/* Shared by the browser editor and Node tooling. No gameplay implementation. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TbhCardDesign = api;
})(globalThis, function () {
  "use strict";
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  const TYPES = ["Minion", "Spell", "Resource"];
  const COLLECTIONS = ["Collectible", "Hero", "Token", "NonCollectible"];
  const DIRECTIONS = ["NW", "N", "NE", "W", "E", "SW", "S", "SE"];
  function require(condition, message) {
    if (!condition) throw new Error(message);
  }
  function newIdentity(cryptoProvider = globalThis.crypto) {
    require(cryptoProvider && typeof cryptoProvider.randomUUID === "function", "Secure UUID generation is unavailable");
    return cryptoProvider.randomUUID();
  }
  function collectionFor(card) {
    if (card.parentUid) return "Token";
    if (card.tags?.includes("InitialHero")) return "Hero";
    return card.collectable ? "Collectible" : "NonCollectible";
  }
  function assignNewIdentity(card, parentUid = null, cryptoProvider = globalThis.crypto) {
    card.uid = newIdentity(cryptoProvider);
    card.parentUid = parentUid;
    if (parentUid) {
      card.collectable = false;
      card.tags = (card.tags || []).filter((tag) => tag !== "InitialHero");
    }
    card.collectionKind = collectionFor(card);
    card.execution = plannedExecution();
    return card;
  }
  const DESIGN_FIELDS = ["uid", "parentUid", "collectionKind", "cardType", "classId", "rarity", "collectable", "costResource", "costAmount", "attack", "health", "movement", "durability", "arrows", "tribes", "tags", "rulesText"];
  function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
    return value;
  }
  function designMaterial(card) { return JSON.stringify(canonical(Object.fromEntries(DESIGN_FIELDS.map(field => [field, card[field] ?? null])))); }
  async function designHash(card, cryptoProvider = globalThis.crypto) {
    const bytes = new TextEncoder().encode(designMaterial(card));
    return [...new Uint8Array(await cryptoProvider.subtle.digest("SHA-256", bytes))].map(byte => byte.toString(16).padStart(2, "0")).join("");
  }
  const EXECUTION_PROPERTIES = ["constructionTarget", "runtimeSupportNote", "upgradeToCardId", "upgradeToCardIds", "placeCost", "arrowRules", "quantitizedCardTags", "continuousEffectRefs", "grantableContinuousEffectRefs", "abilityRefs", "textValueBindings", "attackRange", "progressEffects"];
  function plannedExecution() {
    return { runtimeSupport: "Planned", reviewedDesignHash: null, properties: {}, keywordTags: [], arrowMode: "Permanent", abilities: [], continuousEffects: [], plans: [] };
  }
  function validateExecution(card) {
    const execution = card.execution;
    require(execution && ["Implemented", "Planned", "Unsupported"].includes(execution.runtimeSupport), `Missing or invalid execution: ${card.id}`);
    for (const key of Object.keys(execution)) require(["runtimeSupport", "reviewedDesignHash", "properties", "keywordTags", "arrowMode", "abilities", "continuousEffects", "plans"].includes(key), `Unknown execution.${key}: ${card.id}`);
    require(execution.reviewedDesignHash === null || /^[a-f0-9]{64}$/.test(execution.reviewedDesignHash), `Invalid reviewedDesignHash: ${card.id}`);
    require(["Permanent", "OneTime"].includes(execution.arrowMode), `Invalid execution.arrowMode: ${card.id}`);
    require(execution.properties && typeof execution.properties === "object" && !Array.isArray(execution.properties), `Invalid execution.properties: ${card.id}`);
    for (const key of Object.keys(execution.properties)) require(EXECUTION_PROPERTIES.includes(key), `Forbidden execution.properties.${key}: ${card.id}; native design fields have a single owner`);
    for (const field of ["abilities", "continuousEffects", "plans", "keywordTags"]) require(Array.isArray(execution[field]), `Invalid execution.${field}: ${card.id}`);
    require(execution.keywordTags.every(tag => typeof tag === "string") && new Set(execution.keywordTags).size === execution.keywordTags.length, `Invalid execution.keywordTags: ${card.id}`);
  }
  function executionReferences(dataset, targetUids) {
    const targets = new Set(targetUids), found = [];
    function visit(value, location) {
      if (typeof value === "string" && targets.has(value)) found.push(location);
      else if (Array.isArray(value)) value.forEach((entry, index) => visit(entry, `${location}[${index}]`));
      else if (value && typeof value === "object") for (const [key, entry] of Object.entries(value)) visit(entry, `${location}.${key}`);
    }
    for (const card of dataset.cards) if (!targets.has(card.uid)) visit(card.execution, `cards[${card.id}].execution`);
    return found;
  }
  function mapSelection(selection, mapping) {
    const remap = (id) => mapping[id] || id;
    return Array.isArray(selection) ? selection.map(remap) : selection == null ? selection : remap(selection);
  }
  function selectedArtwork(dataset, card) {
    const raw = dataset.selectedArtworkIds?.[card.id];
    const ids = raw == null || raw === "" ? [] : Array.isArray(raw) ? raw : [raw];
    require(new Set(ids).size === ids.length, `Duplicate selected artwork: ${card.id}`);
    const variants = dataset.artworkVariants?.[card.id] || [];
    return ids.map((variantId) => {
      require(typeof variantId === "string" && variantId.length > 0, `Invalid selected artwork: ${card.id}`);
      const matches = variants.filter((variant) => variant.id === variantId);
      require(matches.length === 1, `Missing or duplicate selected artwork: ${card.id}/${variantId}`);
      const sourcePath = matches[0].src;
      require(typeof sourcePath === "string" && /^\.\/assets\/card-art\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:png|jpe?g|webp)$/i.test(sourcePath), `Invalid selected artwork path: ${card.id}/${variantId}`);
      require(!sourcePath.slice(2).split("/").some((part) => part === "." || part === ".."), `Noncanonical artwork path: ${sourcePath}`);
      return { variantId, sourcePath };
    });
  }
  function validateDataset(dataset, { exportArtwork = false } = {}) {
    require([4, 5].includes(dataset?.schemaVersion) && Array.isArray(dataset.cards), "Expected card dataset schemaVersion 4 or 5");
    if (dataset.schemaVersion === 5) require(dataset.executionSchemaVersion === 21 && Array.isArray(dataset.shared?.statuses), "Expected executionSchemaVersion 21 and shared.statuses");
    const ids = new Set(), byUid = new Map();
    for (const card of dataset.cards) {
      require(card && UUID.test(card.uid), `Missing or invalid card UID: ${card?.id}`);
      require(!byUid.has(card.uid), `Duplicate card UID: ${card.uid}`);
      require(typeof card.id === "string" && card.id.length > 0 && !ids.has(card.id), `Missing or duplicate display ID: ${card.id}`);
      require(TYPES.includes(card.cardType), `Invalid card type: ${card.id}/${card.cardType}`);
      require(COLLECTIONS.includes(card.collectionKind), `Invalid collection kind: ${card.id}`);
      require(card.parentUid === null || UUID.test(card.parentUid), `Invalid parent UID: ${card.id}`);
      require(typeof card.collectable === "boolean" && card.collectionKind === collectionFor(card), `Inconsistent collection kind: ${card.id}`);
      require(card.collectionKind !== "Hero" || card.cardType === "Minion", `Hero must be a minion: ${card.id}`);
      require(card.collectionKind !== "Token" || !card.collectable && !card.tags?.includes("InitialHero"), `Token cannot be a hero or collectible: ${card.id}`);
      for (const field of ["nameKey", "englishName", "classId", "rarity", "costResource", "rulesText"]) require(typeof card[field] === "string", `Invalid ${field}: ${card.id}`);
      for (const field of ["costAmount", "durability"]) require(Number.isSafeInteger(card[field]) && card[field] >= 0, `Invalid ${field}: ${card.id}`);
      if (card.cardType === "Minion") for (const field of ["attack", "health", "movement"]) require(Number.isSafeInteger(card[field]), `Invalid ${field}: ${card.id}`);
      for (const field of ["arrows", "tags"]) require(Array.isArray(card[field]) && card[field].every((value) => typeof value === "string"), `Invalid ${field}: ${card.id}`);
      require(card.arrows.every((arrow) => DIRECTIONS.includes(arrow)) && new Set(card.arrows).size === card.arrows.length, `Invalid arrows: ${card.id}`);
      require(card.tribes == null || Array.isArray(card.tribes) && card.tribes.every((value) => typeof value === "string"), `Invalid tribes: ${card.id}`);
      if (dataset.schemaVersion === 5) validateExecution(card);
      ids.add(card.id); byUid.set(card.uid, card);
      if (exportArtwork) selectedArtwork(dataset, card);
    }
    for (const card of dataset.cards) {
      if (!card.parentUid) continue;
      const parent = byUid.get(card.parentUid);
      require(parent && parent.uid !== card.uid && parent.parentUid === null, `Missing, self, or nested parent: ${card.id}`);
      require(parent.classId === card.classId, `Parent faction mismatch: ${card.id}`);
    }
    return dataset;
  }
  return { DESIGN_FIELDS, canonical, designMaterial, designHash, EXECUTION_PROPERTIES, plannedExecution, validateExecution, executionReferences, UUID, TYPES, COLLECTIONS, newIdentity, collectionFor, assignNewIdentity, mapSelection, selectedArtwork, validateDataset };
});
