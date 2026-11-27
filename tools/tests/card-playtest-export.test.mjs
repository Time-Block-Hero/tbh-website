import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import contract from '../../card-design-contract.js';
import { designHash, selectPlaytestDataset, validateProductionExecution, toAuthoringDocument } from '../card-execution.mjs';
import { exportCommittedDesigns, exportDirtyDesigns } from '../export-card-designs.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = name => fs.readFileSync(path.join(root, name));
const source = JSON.parse(read('data/cards.json'));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const options = { contentId: 'playtest-fixture', contentVersion: '1' };
function fixtureDataset() {
  const dataset = structuredClone(source);
  dataset.schemaVersion = 6;
  dataset.artworkVariants = {};
  dataset.selectedArtworkIds = {};
  dataset.shared = { statuses: [] };
  for (const card of dataset.cards) {
    card.upgradeOfUid = null;
    card.playtestReady = false;
    card.execution = contract.plannedExecution();
  }
  return dataset;
}
function ready(card) {
  card.playtestReady = true;
  card.execution = contract.plannedExecution();
  card.execution.runtimeSupport = 'Implemented';
  card.execution.reviewedDesignHash = designHash(card);
  return card;
}
function base(dataset) { return dataset.cards.find(card => !card.parentUid); }
function writeFixture(t, dataset) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tbh-playtest-export-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'data'));
  fs.writeFileSync(path.join(dir, 'data/cards.json'), JSON.stringify(dataset));
  for (const name of ['card-identity-migration.json', 'card-design-source-revision.json']) fs.writeFileSync(path.join(dir, 'data', name), read(`data/${name}`));
  return dir;
}
function commit(dir) {
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init'); git('add', 'data');
  git('-c', 'user.name=Playtest Test', '-c', 'user.email=playtest@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '-m', 'fixture');
  return git('rev-parse', 'HEAD');
}

test('schema6 formal export selects ready identities and never embeds excluded drafts', t => {
  const dataset = fixtureDataset(), card = ready(base(dataset));
  const dir = writeFixture(t, dataset), sha = commit(dir);
  const result = exportCommittedDesigns(dir, sha);
  assert.equal(result.schemaVersion, 3);
  assert.equal(result.source.selection, 'playtest-ready');
  assert.equal(result.source.cardsSha256, sha256(fs.readFileSync(path.join(dir, 'data/cards.json'))));
  assert.deepEqual(result.cards.map(card => card.uid), [card.uid]);
  assert.deepEqual(result.sourceDataset.cards.map(card => card.uid), [card.uid]);
  assert.equal(result.cards[0].playtestReady, true);
  assert.equal(result.cards[0].upgradeOfUid, null);
  assert.equal(toAuthoringDocument(dataset, options).cardBundles.length, 1);
  assert.deepEqual(exportCommittedDesigns(dir, sha), result);
});

test('schema6 dirty preview retains new and unready designs and cannot be confused with formal output', t => {
  const dataset = fixtureDataset();
  const added = structuredClone(base(dataset));
  added.uid = randomUUID(); added.id = 'NEW-DRAFT'; dataset.cards.push(added);
  const dir = writeFixture(t, dataset), result = exportDirtyDesigns(dir);
  assert.equal(result.source.selection, 'all-designs');
  assert.equal(result.source.dirty, true);
  assert.equal(result.source.commit, null);
  assert.deepEqual(result.sourceDataset, dataset);
  assert.equal(result.cards.length, dataset.cards.length);
  assert.throws(() => exportCommittedDesigns(dir, commit(dir)), /No cards are marked/);
});

test('schema6 selection does not weaken selected execution review or approved identity checks', t => {
  const dataset = fixtureDataset(), card = ready(base(dataset));
  card.rulesText += ' changed';
  assert.throws(() => validateProductionExecution(dataset), /stale design review/);
  ready(card); card.execution.runtimeSupport = 'Planned';
  assert.throws(() => validateProductionExecution(dataset), /not Implemented/);
  ready(card); card.uid = randomUUID(); card.execution.reviewedDesignHash = designHash(card);
  // Keep derivative identity references valid while changing this synthetic base.
  dataset.cards = [card];
  const dir = writeFixture(t, dataset);
  assert.throws(() => exportCommittedDesigns(dir, commit(dir)), /outside approved source revision/);
});

test('execution and shared status references cannot silently pull unready cards into production', () => {
  const dataset = fixtureDataset(), card = ready(base(dataset));
  const omitted = dataset.cards.find(value => value.uid !== card.uid);
  card.execution.properties.upgradeToCardId = omitted.uid;
  assert.throws(() => validateProductionExecution(dataset), /dangling card UID/);
  assert.equal(omitted.playtestReady, false);
  delete card.execution.properties.upgradeToCardId;
  dataset.shared.statuses.push({ id: 'synthetic-status', targetCard: omitted.uid });
  assert.throws(() => validateProductionExecution(dataset), /shared.statuses.*dangling card UID/);
});

test('upgrade and derivative relationships require explicit complete selections', () => {
  const dataset = fixtureDataset(), original = ready(base(dataset));
  const upgrade = structuredClone(original);
  upgrade.uid = randomUUID(); upgrade.id = `${original.id}-UP`;
  upgrade.upgradeOfUid = original.uid; upgrade.parentUid = null;
  upgrade.collectable = false; upgrade.tags = upgrade.tags.filter(tag => tag !== 'InitialHero');
  upgrade.collectionKind = 'NonCollectible'; upgrade.playtestReady = false;
  dataset.cards.push(upgrade);
  assert.throws(() => selectPlaytestDataset(dataset), /upgrade: required card/);
  ready(upgrade); original.playtestReady = false;
  assert.throws(() => selectPlaytestDataset(dataset), /upgradeOfUid: required card/);
  original.playtestReady = true;
  assert.equal(selectPlaytestDataset(dataset).cards.length, 2);
  assert.throws(() => toAuthoringDocument(dataset, options), /require a new game content adapter/);
  // Selection remains enforced even when a synthetic caller skips effect validation.
  assert.throws(() => toAuthoringDocument(dataset, { ...options, validate: false }), /require a new game content adapter/);
  const derivative = dataset.cards.find(card => card.parentUid);
  dataset.cards.forEach(card => card.playtestReady = false);
  ready(derivative);
  assert.throws(() => selectPlaytestDataset(dataset), /parentUid: required card/);
});

test('events remain editable drafts and explicitly fail executable export until runtime support exists', () => {
  const dataset = fixtureDataset(), event = ready(base(dataset));
  event.cardType = 'Event'; event.collectable = false; event.collectionKind = 'NonCollectible';
  event.tags = []; event.parentUid = null; event.execution.reviewedDesignHash = designHash(event);
  // Remove derivatives of the former fixture base; events are not derivative parents.
  dataset.cards = [event];
  assert.throws(() => validateProductionExecution(dataset), /Event is a design-only type/);
  assert.throws(() => toAuthoringDocument(dataset, { ...options, validate: false }), /require a new game content adapter/);
});

test('legacy schema5 execution still exports its full collection without readiness metadata', () => {
  const dataset = structuredClone(source);
  dataset.schemaVersion = 5;
  for (const card of dataset.cards) { delete card.upgradeOfUid; delete card.playtestReady; }
  assert.equal(selectPlaytestDataset(dataset), dataset);
  assert.equal(toAuthoringDocument(dataset, options).cardBundles.length, dataset.cards.length);
});
