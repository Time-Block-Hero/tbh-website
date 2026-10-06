// Source-format adapter only. The Rules schema21 compiler owns the executable language.
import { createHash } from 'node:crypto';
import contract from '../card-design-contract.js';
export const DESIGN_FIELDS = contract.DESIGN_FIELDS;
export const canonical = contract.canonical;
export const semanticHash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
export const designHash = card => createHash('sha256').update(contract.designMaterial(card)).digest('hex');
export function executionHash(execution) {
  const { reviewedDesignHash, ...definition } = execution;
  return semanticHash(definition);
}
export function validateProductionExecution(dataset) {
  contract.validateDataset(dataset);
  if (dataset.schemaVersion !== 5) throw new Error('Production execution requires schemaVersion 5');
  const uids = new Set(dataset.cards.map(card => card.uid));
  const definitions = new Set();
  for (const card of dataset.cards) {
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
    function references(value, location) {
      if (typeof value === 'string' && contract.UUID.test(value) && !uids.has(value)) throw new Error(`${location}: dangling card UID ${value}`);
      if (Array.isArray(value)) value.forEach((item, i) => references(item, `${location}[${i}]`));
      else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) references(item, `${location}.${key}`);
    }
    references(e, `cards[${card.id}].execution`);
  }
}
export function toAuthoringDocument(dataset, { contentId, contentVersion, source = {}, artPaths = {}, validate = true } = {}) {
  contract.validateDataset(dataset);
  if (validate) validateProductionExecution(dataset);
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
      if (card.collectionKind === 'Hero') { native.collectable = false; if (native.costResource === 'Hero') native.costResource = 'Star'; }
      native.tags = [...new Set([...card.tags, ...e.keywordTags])];
      if (e.arrowMode === 'OneTime') native.arrows = [];
      return { card: { ...native, ...structuredClone(e.properties) }, abilities: structuredClone(e.abilities), continuousEffects: structuredClone(e.continuousEffects), plans: structuredClone(e.plans) };
    }),
  };
}
