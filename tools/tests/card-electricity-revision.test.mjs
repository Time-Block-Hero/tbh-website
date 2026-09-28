import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';
import contract from '../../card-design-contract.js';
import { exportDirtyDesigns } from '../export-card-designs.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = relative => readFileSync(new URL(`../../${relative}`, import.meta.url));
const parse = relative => JSON.parse(read(relative));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const revision = parse('docs/design/revisions/2026-09-27-electricity-cards.json');
const currentBytes = read('data/cards.json');
const current = JSON.parse(currentBytes);
// Historical source receipts require full Git history, as do the existing baseline tests.
const base = JSON.parse(execFileSync('git', ['--no-replace-objects', 'show', `${revision.baseCommit}:data/cards.json`], { cwd: root }));
const sorted = cards => [...cards].sort((a, b) => a.uid.localeCompare(b.uid));
const additions = revision.cards.filter(card => card.kind === 'added');
const modifications = revision.cards.filter(card => card.kind === 'modified');

test('electricity revision reconstructs exactly 23 existing changes and six additions without hidden field changes', () => {
  assert.equal(revision.schemaVersion, 1);
  assert.equal(revision.baseCommit, 'ce357dcdfc332bb06662abfc62e6e4f2aee212e7');
  assert.equal(hash(currentBytes), revision.preparedCardsSha256);
  assert.deepEqual([revision.designCardCount, revision.added, revision.modified], [140, 6, 23]);
  assert.deepEqual(revision.removed, []);
  assert.equal(revision.cards.length, 29);
  assert.equal(new Set(revision.cards.map(card => card.uid)).size, 29);
  assert.deepEqual([additions.length, modifications.length], [6, 23]);
  const reconstructed = new Map(base.cards.map(card => [card.uid, structuredClone(card)]));
  const mutable = new Set(['rulesText', 'arrows', 'attack', 'costAmount', 'health', 'movement', 'rarity']);
  for (const entry of modifications) {
    const card = reconstructed.get(entry.uid);
    assert.ok(card, entry.uid);
    assert.equal(card.id, entry.displayId);
    assert.equal(card.nameKey, entry.name);
    assert.ok(Object.keys(entry.fields).length > 0);
    for (const [field, change] of Object.entries(entry.fields)) {
      assert.ok(mutable.has(field), `${entry.displayId}: unexpected field ${field}`);
      assert.deepEqual(Object.keys(change).sort(), ['after', 'before']);
      assert.deepEqual(card[field], change.before);
      assert.notDeepEqual(change.before, change.after);
      card[field] = structuredClone(change.after);
    }
  }
  for (const entry of additions) {
    assert.equal(reconstructed.has(entry.uid), false);
    assert.equal(entry.after.uid, entry.uid);
    assert.equal(entry.after.id, entry.displayId);
    assert.equal(entry.after.nameKey, entry.name);
    reconstructed.set(entry.uid, structuredClone(entry.after));
  }
  assert.deepEqual(sorted([...reconstructed.values()]), sorted(current.cards));
  const withoutCards = dataset => Object.fromEntries(Object.entries(dataset).filter(([key]) => key !== 'cards'));
  assert.deepEqual(withoutCards(current), withoutCards(base));
});

test('preparing the approved input changes only the six new English names and artwork keys', () => {
  const restored = structuredClone(current);
  assert.deepEqual(additions.map(card => card.displayId), ['FNG-038', 'FNG-039', 'FNG-040', 'SA-020', 'SC-020', 'AI-020-02']);
  for (const entry of additions) {
    const card = restored.cards.find(value => value.uid === entry.uid);
    assert.ok(card.englishName.trim().length > 0);
    assert.match(card.artworkKey, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(card.artworkKey, card.englishName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    card.englishName = '';
    card.artworkKey = '';
  }
  // This reconstructs the exact approved input bytes, not just selected fields.
  assert.equal(hash(`${JSON.stringify(restored, null, 2)}\n`), revision.approvedInputCardsSha256);
});

test('current approved identities and parent references stay intact, including Augustus and all four admissions', () => {
  contract.validateDataset(current, { exportArtwork: true });
  const identities = parse('data/card-design-source-revision.json');
  assert.deepEqual(current.cards.map(card => card.uid).sort(), identities.expectedUids);
  const previous = new Map(base.cards.map(card => [card.uid, card]));
  for (const card of current.cards) {
    if (previous.has(card.uid)) {
      const before = previous.get(card.uid);
      for (const field of ['id', 'uid', 'parentUid', 'collectionKind', 'collectable']) assert.deepEqual(card[field], before[field]);
    }
    if (card.parentUid !== null) assert.ok(current.cards.some(parent => parent.uid === card.parentUid));
  }
  const augustus = current.cards.find(card => card.uid === 'a7ce77ca-ee11-49d0-8581-5da3fa1a92f5');
  assert.equal(augustus.parentUid, 'bdd6fa88-21f9-4eed-8248-00e550344739');
  assert.equal(augustus.collectionKind, 'Token');
  const exported = exportDirtyDesigns(root);
  assert.equal(exported.cards.length, 140);
  assert.deepEqual(exported.policy.excludedUids, []);
  for (const uid of identities.admittedPreviouslyExcludedUids) assert.ok(exported.cards.some(card => card.uid === uid));
});

test('current reference mirror, offline editor data and declarative preview match the authoritative cards', () => {
  assert.deepEqual(read('ReferenceDocs/cards (1).json'), currentBytes);
  const sandbox = { window: {} };
  vm.runInNewContext(read('card-editor-data.js').toString('utf8'), sandbox, { timeout: 1000 });
  assert.deepEqual(JSON.parse(JSON.stringify(sandbox.window.__CARD_EDITOR_FALLBACK__.cards)), current);
  const preview = parse('formal_card_ref.json');
  assert.deepEqual(preview, exportDirtyDesigns(root, { requireCompleteBaseline: false }));
  assert.equal(preview.source.dirty, true);
  assert.equal(preview.source.commit, null);
});
