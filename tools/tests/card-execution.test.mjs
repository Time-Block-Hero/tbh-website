import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import contract from '../../card-design-contract.js';
import { designHash, executionHash, semanticHash, toAuthoringDocument, validateProductionExecution } from '../card-execution.mjs';
import { validateWrite } from '../card-design-write-contract.mjs';
import { exportDirtyDesigns } from '../export-card-designs.mjs';
import { buildEditorFallback } from '../card-editor-fallback.mjs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const read = p => JSON.parse(fs.readFileSync(new URL(`../../${p}`, import.meta.url)));
const current = read('data/cards.json');
const evidence = read('docs/design/revisions/2026-10-05-execution-migration.json');
const options = { contentId: 'test', contentVersion: 'fixture', artPaths: Object.fromEntries(evidence.entries.map(e => [e.uid, e.runtimeArtPath])) };
const revise = fn => { const copy = structuredClone(current); fn(copy); return copy; };
const oneCard = () => {
  const d = structuredClone(current); d.cards = [d.cards.find(c => c.rulesText === '' && c.parentUid === null)];
  return d;
};
test('schema5 production maps all 147 reviewed identities and frozen execution bundles after the approved durability ruling', () => {
  contract.validateDataset(current);
  assert.equal(current.cards.length, 147);
  assert.deepEqual([...current.cards.map(c => c.uid)].sort(), evidence.entries.map(e => e.uid).sort());
  assert.deepEqual(evidence.unresolved, []);
  validateProductionExecution(current);
  const generated = toAuthoringDocument(current, options);
  for (const b of generated.cardBundles) {
    const entry = evidence.entries.find(e => e.uid === b.card.uid);
    assert.equal(semanticHash(b), entry.bundleHash, b.card.displayId);
    const card = current.cards.find(c => c.uid === b.card.uid);
    assert.equal(designHash(card), entry.designHash, card.id);
    assert.equal(executionHash(card.execution), entry.executionHash, card.id);
  }
});
test('semantic review excludes names, artwork and display order, but binds card text, numeric stats and identity', async () => {
  const c = current.cards[0];
  assert.equal(await contract.designHash(c, webcrypto), designHash(c));
  assert.equal(designHash({ ...c, nameKey: '改名', englishName: 'Rename', id: 'NEW-001', artPath: 'x' }), designHash(c));
  for (const delta of [{ rulesText: 'changed' }, { costAmount: c.costAmount + 1 }, { uid: webcrypto.randomUUID() }]) assert.notEqual(designHash({ ...c, ...delta }), designHash(c));
  const e = structuredClone(c.execution); e.properties.abilityRefs.push('new');
  assert.notEqual(executionHash(e), executionHash(c.execution));
});
test('new cards and copied derivatives always start Planned without inherited effect identities', () => {
  const c = contract.assignNewIdentity(structuredClone(current.cards[0]), current.cards[0].uid, webcrypto);
  assert.deepEqual(c.execution, contract.plannedExecution());
  assert.equal(c.execution.reviewedDesignHash, null);
});
test('production rejects stale reviews, planned content, native overrides, duplicate effect ids and dangling UIDs', () => {
  const d = oneCard(); validateProductionExecution(d);
  d.cards[0].costAmount++; assert.throws(() => validateProductionExecution(d), /stale design review/);
  d.cards[0].execution.reviewedDesignHash = designHash(d.cards[0]); validateProductionExecution(d);
  d.cards[0].execution.runtimeSupport = 'Planned'; assert.throws(() => validateProductionExecution(d), /not Implemented/);
  assert.throws(() => contract.validateDataset(revise(d => d.cards[0].execution.properties.attack = 99)), /Forbidden.*attack/);
  const u = oneCard(); u.cards[0].execution.plans = [{ planId: 'same' }, { planId: 'same' }]; assert.throws(() => validateProductionExecution(u), /duplicate identity/);
  const v = oneCard(); v.cards[0].execution.properties.upgradeToCardId = webcrypto.randomUUID(); assert.throws(() => validateProductionExecution(v), /dangling card UID/);
});
test('schema5 write, dirty export and offline fallback preserve all execution and shared data', () => {
  const next = revise(d => { d.cards[0].nameKey = '新名称'; });
  validateWrite(current, next, { type: 'edit', uid: current.cards[0].uid });
  assert.deepEqual(next.cards[0].execution, current.cards[0].execution);
  const exported = exportDirtyDesigns(root);
  assert.deepEqual(exported.sourceDataset, current); assert.deepEqual(exported.shared, current.shared);
  const context = { window: {} }; vm.runInNewContext(buildEditorFallback(root, current, {}), context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.__CARD_EDITOR_FALLBACK__.cards)), current);
  const old = structuredClone(current); old.schemaVersion = 4;
  assert.throws(() => validateWrite(current, old, { type: 'import' }), /Legacy drafts/);
  const lost = revise(d => delete d.cards[0].execution);
  assert.throws(() => validateWrite(current, lost, { type: 'edit', uid: current.cards[0].uid }), /execution/);
});
test('deleting a referenced card reports the exact card execution location', () => {
  const previous = oneCard();
  const target = contract.assignNewIdentity(structuredClone(previous.cards[0]), null, webcrypto);
  target.id = 'SYNTHETIC-DELETE'; previous.cards.push(target);
  previous.cards[0].execution.properties.upgradeToCardId = target.uid;
  const next = structuredClone(previous); next.cards.pop();
  assert.throws(() => validateWrite(previous, next, { type: 'delete', uid: target.uid }), /Deleted card is referenced at: cards\[.*execution/);
});
