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
const rulings = parse('docs/design/revisions/2026-09-27-rulings.json');
const playtest = parse('docs/design/revisions/2026-09-30-playtest-cards.json');
const foxnick = parse('docs/design/revisions/2026-09-27-foxnick-active-attack.json');
const currentBytes = read('data/cards.json');
const current = JSON.parse(currentBytes);
// Historical source receipts require full Git history, as do the existing baseline tests.
const base = JSON.parse(execFileSync('git', ['--no-replace-objects', 'show', `${revision.baseCommit}:data/cards.json`], { cwd: root }));
const sorted = cards => [...cards].sort((a, b) => a.uid.localeCompare(b.uid));
const additions = revision.cards.filter(card => card.kind === 'added');
const modifications = revision.cards.filter(card => card.kind === 'modified');
const order = parse('docs/design/revisions/2026-09-27-card-order.json');
const preparedBytes = dataset => `${JSON.stringify(dataset, null, 2)}\n`;

function reconstructPrepared() {
  assert.equal(revision.schemaVersion, 1);
  assert.equal(revision.baseCommit, 'ce357dcdfc332bb06662abfc62e6e4f2aee212e7');
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
  assert.equal(order.schemaVersion, 1);
  assert.equal(order.revision, '2026-09-27-electricity-cards.json');
  assert.equal(new Set(order.preparedUidOrder).size, 140);
  assert.deepEqual([...order.preparedUidOrder].sort(), [...reconstructed.keys()].sort());
  return { ...structuredClone(base), cards: order.preparedUidOrder.map(uid => reconstructed.get(uid)) };
}

function currentApprovedDesign() {
  let dataset = reconstructPrepared();
  assert.equal(rulings.schemaVersion, 1);
  assert.equal(rulings.cards.length, 1);
  const amendment = rulings.cards[0];
  assert.equal(amendment.uid, 'ff153fcb-5387-455c-b673-ecf2d9ddfbc2');
  assert.equal(amendment.field, 'rulesText');
  const card = dataset.cards.find(value => value.uid === amendment.uid);
  assert.equal(card.rulesText, amendment.before);
  assert.equal(amendment.after, amendment.before.replace('敌方随从', '敌方单位'));
  card.rulesText = amendment.after;
  assert.equal(foxnick.uid, 'ff038236-2919-4bbc-9ca7-58c132b2c7fb');
  assert.equal(foxnick.field, 'rulesText');
  const fox = dataset.cards.find(value => value.uid === foxnick.uid);
  assert.equal(fox.rulesText, foxnick.before);
  assert.equal(foxnick.after, '每回合可以攻击两次。本随从主动攻击并造成伤害后，自身获得等量护甲。');
  fox.rulesText = foxnick.after;
  // Later committed revisions (Quick support, art naming and Foxnick speed) are
  // retained by the next approved batch; the earlier receipts stay historical.
  dataset = JSON.parse(execFileSync("git", ["--no-replace-objects", "show", `${playtest.baseCommit}:data/cards.json`], { cwd: root }));
  assert.deepEqual([playtest.oldCount, playtest.newCount, playtest.changed.length, playtest.added.length], [140, 143, 22, 3]);
  assert.deepEqual(playtest.deleted, []);
  for (const entry of playtest.changed) {
    const target = dataset.cards.find(value => value.uid === entry.uid);
    assert.ok(target, entry.uid);
    for (const [field, change] of Object.entries(entry.changes)) {
      assert.deepEqual(target[field], change.before, `${entry.name}/${field}`);
      target[field] = structuredClone(change.after);
    }
  }
  for (const card of playtest.added) {
    assert.ok(!dataset.cards.some(value => value.uid === card.uid));
    dataset.cards.push(structuredClone(card));
  }
  // Approved visual completion: exact names/keys only. These remain protected
  // non-art fields; this is not a blanket allowance to rename cards or bindings.
  const visualNames = [
    ['0580aac7-5301-43db-b2d9-1bc56b2e75b8', 'Shield of the Imperium', 'shield-of-the-imperium'],
    ['103f0af6-2a92-471e-be1a-e5fad6fa5735', 'Ashley the Empowerer', 'ashley-the-empowerer'],
    ['85fa412a-ca02-420f-8d4a-1f5f6b4cc56c', 'Mercy of the Void God', 'mercy-of-the-void-god'],
    ['094e7c7a-25de-48b2-8df1-b2c47f5b90ea', 'Lost Wisdom', 'lost-wisdom'],
  ];
  for (const [uid, englishName, artworkKey] of visualNames) {
    const target = dataset.cards.find(card => card.uid === uid);
    assert.ok(target, uid);
    assert.equal(target.englishName, englishName === 'Lost Wisdom' ? englishName : '');
    assert.equal(target.artworkKey, '');
    Object.assign(target, { englishName, artworkKey });
  }
  // Explicit 2026-10-01 ruling supersedes self-counting; retain the historical receipts.
  const musician = parse('docs/design/revisions/2026-10-01-musician-other-effects.json');
  assert.equal(musician.schemaVersion, 1);
  assert.equal(musician.uid, 'faba227c-aad4-425d-b905-a7c62f14a94e');
  assert.equal(musician.field, 'rulesText');
  const musicianCard = dataset.cards.find(card => card.uid === musician.uid);
  assert.equal(musicianCard.rulesText, musician.before);
  assert.equal(musician.after, musician.before.replace('你发动或触发效果的次数', '你发动或触发与本卡不同名的卡牌效果的次数'));
  musicianCard.rulesText = musician.after;
  const imported = parse('docs/design/revisions/2026-10-01-complete-card-import.json');
  assert.equal(imported.baseCommit, '6bd472e236c48a9b3c1a1ef678115ece9103273f');
  assert.deepEqual([imported.oldCount, imported.newCount, imported.added.length], [143, 146, 3]);
  assert.deepEqual(imported.deleted, []);
  dataset = JSON.parse(execFileSync('git', ['--no-replace-objects', 'show', `${imported.baseCommit}:data/cards.json`], { cwd: root }));
  for (const entry of imported.changed) {
    const target = dataset.cards.find(card => card.uid === entry.uid);
    assert.ok(target, entry.uid);
    for (const [field, delta] of Object.entries(entry.fields)) {
      assert.ok(!['uid', 'parentUid', 'collectionKind'].includes(field));
      assert.deepEqual(target[field], delta.before, entry.displayId + '/' + field);
      target[field] = structuredClone(delta.after);
    }
  }
  for (const card of imported.added) {
    assert.ok(!dataset.cards.some(value => value.uid === card.uid));
    dataset.cards.push(structuredClone(card));
  }
  const latest = parse('docs/design/revisions/2026-10-01-playtest147.json');
  assert.deepEqual([latest.oldCount, latest.newCount, latest.changed.length, latest.added.length], [146, 147, 13, 1]);
  assert.deepEqual(latest.deleted, []);
  for (const entry of latest.changed) {
    const target = dataset.cards.find(card => card.uid === entry.uid);
    assert.ok(target, entry.uid);
    for (const [field, delta] of Object.entries(entry.fields)) {
      assert.ok(!['uid', 'parentUid', 'collectionKind'].includes(field));
      assert.deepEqual(target[field], delta.before, entry.displayId + '/' + field);
      target[field] = structuredClone(delta.after);
    }
  }
  for (const card of latest.added) {
    assert.ok(!dataset.cards.some(value => value.uid === card.uid));
    dataset.cards.push(structuredClone(card));
  }
  const finalTune = parse('docs/design/revisions/2026-10-02-ashley-master-corona.json');
  assert.deepEqual([finalTune.oldCount, finalTune.newCount, finalTune.changed.length], [147, 147, 2]);
  assert.deepEqual(finalTune.added, []);
  assert.deepEqual(finalTune.deleted, []);
  for (const entry of finalTune.changed) {
    const target = dataset.cards.find(card => card.uid === entry.uid);
    assert.ok(target, entry.uid);
    for (const [field, delta] of Object.entries(entry.fields)) {
      assert.ok(!['uid', 'parentUid', 'collectionKind'].includes(field));
      assert.deepEqual(target[field], delta.before, entry.displayId + '/' + field);
      target[field] = structuredClone(delta.after);
    }
  }
  const balance = parse('docs/design/revisions/2026-10-03-balance147.json');
  assert.deepEqual([balance.oldCount, balance.newCount, balance.changed.length], [147, 147, 17]);
  assert.deepEqual(balance.added, []);
  assert.deepEqual(balance.deleted, []);
  for (const entry of balance.changed) {
    const target = dataset.cards.find(card => card.uid === entry.uid);
    assert.ok(target, entry.uid);
    for (const [field, delta] of Object.entries(entry.fields)) {
      assert.ok(!['uid', 'parentUid', 'collectionKind'].includes(field));
      assert.deepEqual(target[field], delta.before, entry.displayId + '/' + field);
      target[field] = structuredClone(delta.after);
    }
  }
  const finalBaseline = parse('docs/design/revisions/2026-10-05-baseline-test-repair.json');
  assert.equal(finalBaseline.sourceCommit, 'db210674f1143f3b1b82ea7a7f05234158a20d61');
  assert.equal(finalBaseline.changed.length, 4);
  for (const entry of finalBaseline.changed) {
    const target = dataset.cards.find(card => card.uid === entry.uid);
    for (const [field, delta] of Object.entries(entry.fields)) {
      assert.deepEqual(target[field], delta.before, entry.displayId + '/' + field);
      target[field] = structuredClone(delta.after);
    }
  }
  const executionMigration = parse('docs/design/revisions/2026-10-05-execution-migration.json');
  assert.deepEqual(executionMigration.unresolved, []);
  assert.equal(executionMigration.resolutions.length, 1);
  const durabilityRuling = executionMigration.resolutions[0];
  assert.equal(durabilityRuling.status, 'resolved');
  assert.equal(durabilityRuling.uid, '21401534-7b13-41d1-a4c4-e52108726727');
  assert.deepEqual([durabilityRuling.field, durabilityRuling.before, durabilityRuling.after], ['durability', 0, 1]);
  const phantom = dataset.cards.find(card => card.uid === durabilityRuling.uid);
  assert.equal(phantom.durability, durabilityRuling.before);
  phantom.durability = durabilityRuling.after;
  return dataset;
}

function assertCurrentDesign(dataset) {
  contract.validateDataset(dataset, { exportArtwork: true });
  const prepared = currentApprovedDesign();
  // Execution is independently checked against frozen bundle hashes in card-execution.test.mjs.
  const artFields = new Set(['artDescription', 'artDescriptionNeedsPolish', 'artRequest', 'artPath', 'execution']);
  const withoutArt = card => Object.fromEntries(Object.entries(card).filter(([key]) => !artFields.has(key)));
  assert.deepEqual(sorted(dataset.cards).map(withoutArt), sorted(prepared.cards).map(withoutArt));
  const withoutCardsOrArt = value => Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['cards', 'artworkVariants', 'selectedArtworkIds'].includes(key)));
  if (dataset.schemaVersion === 5) {
    prepared.schemaVersion = 5; prepared.sourceSchemaVersion = 5;
    prepared.executionSchemaVersion = 21; prepared.shared = { statuses: [{ id: 'Retain', lifetime: 'Permanent', removableBySilence: true, tags: ['Retain'] }, { id: 'DivineShield', lifetime: 'Permanent', removableBySilence: true, tags: ['DivineShield'] }] };
  }
  assert.deepEqual(withoutCardsOrArt(dataset), withoutCardsOrArt(prepared));
}

test('electricity revision reconstructs the historical prepared bytes from 29 deltas and the retained UID order', () => {
  const prepared = reconstructPrepared();
  // These hashes certify T1's historical bytes, never the mutable art workflow.
  assert.equal(hash(preparedBytes(prepared)), revision.preparedCardsSha256);
});

test('preparing the approved input changes only the six new English names and artwork keys', () => {
  const restored = reconstructPrepared();
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
  assert.equal(hash(preparedBytes(restored)), revision.approvedInputCardsSha256);
});

test('current cards retain every approved non-art field while allowing subsequent illustration work', () => {
  assertCurrentDesign(current);
});

test('T5 illustration edits and selected variants pass without changing historical T1 receipts', () => {
  const dataset = currentApprovedDesign();
  const card = dataset.cards.find(value => value.uid === additions[0].uid);
  Object.assign(card, { artDescription: 'An approved new illustration prompt.', artDescriptionNeedsPolish: false,
    artRequest: 0, artPath: `CardArt/Designs/${card.uid}` });
  const variant = { id: `${card.artworkKey}-01`, src: `./assets/card-art/${card.artworkKey}/${card.artworkKey}-01.png` };
  dataset.artworkVariants[card.id] = [variant];
  dataset.selectedArtworkIds[card.id] = variant.id;
  assert.notEqual(hash(preparedBytes(dataset)), revision.preparedCardsSha256);
  assertCurrentDesign(dataset);
  assert.deepEqual(contract.selectedArtwork(dataset, card), [{ variantId: variant.id, sourcePath: variant.src }]);
  assert.equal(hash(preparedBytes(reconstructPrepared())), revision.preparedCardsSha256);
});

test('the art allowance cannot hide gameplay, English-name, artwork-key or identity changes', () => {
  for (const [field, value] of [['rulesText', 'Changed gameplay'], ['costAmount', 99], ['englishName', 'Changed Name'],
    ['artworkKey', 'changed-key'], ['uid', '00000000-0000-4000-8000-000000000001']]) {
    const dataset = currentApprovedDesign();
    dataset.cards.find(card => card.uid === additions[0].uid)[field] = value;
    assert.throws(() => assertCurrentDesign(dataset), undefined, field);
  }
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
  assert.equal(exported.cards.length, 147);
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
