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
    return card;
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
    require(dataset?.schemaVersion === 4 && Array.isArray(dataset.cards), "Expected card dataset schemaVersion 4");
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
  return { UUID, TYPES, COLLECTIONS, newIdentity, collectionFor, assignNewIdentity, mapSelection, selectedArtwork, validateDataset };
});
