// Source-format adapter only. The Rules schema22 compiler owns the executable language.
import { createHash } from 'node:crypto';
import contract from '../card-design-contract.js';
import { plansWithSemanticRoles } from './card-plan-roles.mjs';
export const DESIGN_FIELDS = contract.DESIGN_FIELDS;
export const canonical = contract.canonical;
export const semanticHash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
export const designHash = card => createHash('sha256').update(contract.designMaterial(card)).digest('hex');
export function executionHash(execution) {
  const { reviewedDesignHash, ...definition } = execution;
  return semanticHash(definition);
}
// Selection is mandatory for schema6 production paths; design previews never call this.
export function selectPlaytestDataset(dataset) {
  contract.validateDataset(dataset);
  if (dataset.schemaVersion !== 6) return dataset;
  // Never mutate source bytes or let a stale upgrade mirror admit/exclude a pair.
  dataset = structuredClone(dataset);
  contract.normalizePlaytestReady(dataset);
  const cards = dataset.cards.filter(card => contract.effectivePlaytestReady(dataset, card));
  if (!cards.length) throw new Error('No cards are marked playtestReady=true (没有纳入下次试玩的卡牌)');
  const selected = new Set(cards.map(card => card.uid));
  function requireSelected(uid, location) {
    if (uid && !selected.has(uid)) throw new Error(`${location}: required card ${uid} is not included in this playtest; mark it ready explicitly or revise the dependency`);
  }
  for (const card of cards) {
    requireSelected(card.parentUid, `${card.id}.parentUid`);
    requireSelected(card.upgradeOfUid, `${card.id}.upgradeOfUid`);
  }
  const ids = new Set(cards.map(card => card.id));
  const selectedMap = map => Object.fromEntries(Object.entries(map || {}).filter(([id]) => ids.has(id)));
  return { ...structuredClone(dataset), cards: structuredClone(cards),
    artworkVariants: structuredClone(selectedMap(dataset.artworkVariants)),
    selectedArtworkIds: structuredClone(selectedMap(dataset.selectedArtworkIds)) };
}
export function validateProductionExecution(input) {
  const dataset = selectPlaytestDataset(input);
  if (![5, 6].includes(dataset.schemaVersion)) throw new Error('Production execution requires schemaVersion 5 or 6');
  const uids = new Set(dataset.cards.map(card => card.uid));
  const definitions = new Set();
  function references(value, location) {
    if (typeof value === 'string' && contract.UUID.test(value) && !uids.has(value)) throw new Error(`${location}: dangling card UID ${value}`);
    if (Array.isArray(value)) value.forEach((item, i) => references(item, `${location}[${i}]`));
    else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) references(item, `${location}.${key}`);
  }
  for (const card of dataset.cards) {
    if ((card.cardType === 'Event' || card.upgradeOfUid) && dataset.executionSchemaVersion < 22) throw new Error(`${card.id}: Event and upgrade execution requires schema22`);
    if (card.cardType === 'Event' && card.execution.properties.canTriple === true) throw new Error(`${card.id}: events cannot triple`);
    const e = card.execution;
    if (e.arrowMode === 'OneTime' && JSON.stringify([...(e.properties.arrowRules || [])].filter(rule => rule.kind === 'Consumable').map(rule => rule.direction).sort()) !== JSON.stringify([...card.arrows].sort())) throw new Error(`${card.id}.execution.properties.arrowRules: OneTime directions must match design arrows`);
    if (e.runtimeSupport !== 'Implemented') throw new Error(`${card.id}.execution.runtimeSupport: not Implemented`);
    if (e.reviewedDesignHash !== designHash(card)) throw new Error(`${card.id}.execution.reviewedDesignHash: stale design review`);
    for (const [field, idKey] of [['abilities', 'id'], ['continuousEffects', 'id'], ['plans', 'planId']]) {
      for (const item of e[field]) {
        const id = item[idKey];
        if (typeof id !== 'string' || !id || definitions.has(id)) throw new Error(`${card.id}.execution.${field}: missing or duplicate identity ${id}`);
        definitions.add(id);
      }
    }
    references(e, `cards[${card.id}].execution`);
  }
  if (dataset.schemaVersion === 6) references(dataset.shared.statuses, "shared.statuses");
  return dataset;
}
export function toAuthoringDocument(input, { contentId, contentVersion, source = {}, artPaths = {}, validate = true } = {}) {
  // Even internal callers that skip effect validation cannot bypass selection.
  const dataset = validate ? validateProductionExecution(input) : selectPlaytestDataset(input);
  if (dataset.cards.some(card => card.upgradeOfUid || card.cardType === 'Event') && dataset.executionSchemaVersion < 22) throw new Error('Upgrade variants and Event cards require schema22');
  const upgrades = new Map(dataset.cards.filter(card => card.upgradeOfUid).map(card => [card.upgradeOfUid, card.uid]));
  const heroes = new Set(dataset.cards.filter(card => card.collectionKind === 'Hero').map(card => card.uid));
  if (!contentId || !contentVersion) throw new Error('Explicit contentId and contentVersion are required');
  return {
    authoringVersion: 1, schemaVersion: dataset.executionSchemaVersion, contentId, contentVersion, source,
    statuses: structuredClone(dataset.shared.statuses),
    cardBundles: dataset.cards.map(card => {
      const e = card.execution;
      const native = Object.fromEntries(['parentUid', 'collectionKind', 'nameKey', 'englishName', 'cardType', 'classId', 'rarity', 'collectable', 'costResource', 'costAmount', 'durability', 'rulesText', 'arrows', 'tags'].map(key => [key, structuredClone(card[key])]));
      Object.assign(native, { id: card.uid, uid: card.uid, displayId: card.id,
        attack: card.cardType === 'Minion' ? card.attack : 0,
        health: card.cardType === 'Minion' ? card.health : 0,
        movement: card.cardType === 'Minion' ? card.movement : 0,
        tribes: card.cardType === 'Minion' ? [...(card.tribes || [])] : [],
        artPath: Object.hasOwn(artPaths, card.uid) ? artPaths[card.uid] : null, runtimeSupport: e.runtimeSupport });
      if (card.collectionKind === 'Hero' || heroes.has(card.upgradeOfUid)) { native.collectionKind = 'Hero'; native.collectable = false; }
      if (native.costResource === 'Hero') native.costResource = 'Star';
      native.tags = [...new Set([...card.tags, ...e.keywordTags])];
      if (dataset.executionSchemaVersion >= 22) {
        native.upgradeOfUid = card.upgradeOfUid || null;
        native.tripleUpgradeUid = upgrades.get(card.uid) || null;
        native.canTriple = !!native.tripleUpgradeUid && card.collectionKind !== 'Hero' && e.properties.canTriple !== false;
        native.eventUnique = card.cardType === 'Event' && e.properties.eventUnique === true;
        if (card.cardType === 'Event') { native.costResource = 'Star'; native.costAmount = 0; native.collectable = false; }
      }
      if (e.arrowMode === 'OneTime') native.arrows = [];
      else native.arrows = native.arrows.filter(direction => !(e.properties.arrowRules || []).some(rule => rule.kind === 'Permanent' && rule.direction === direction));
      return { card: { ...structuredClone(e.properties), ...native }, abilities: structuredClone(e.abilities), continuousEffects: structuredClone(e.continuousEffects), plans: dataset.executionSchemaVersion >= 22 ? plansWithSemanticRoles(e) : structuredClone(e.plans) };
    }),
  };
}
