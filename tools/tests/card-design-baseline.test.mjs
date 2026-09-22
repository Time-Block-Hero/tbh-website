import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import contract from '../../card-design-contract.js';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const frozen = p => execFileSync('git', ['show', `100aef993209930ccdaadcf5d051fc2d274ac1db:${p}`], { cwd: root });
const read = p => readFileSync(new URL(`../../${p}`, import.meta.url));
const parse = p => JSON.parse(read(p));
const base = 'data/baselines/issue44-20260920';
const revision = parse(`${base}/revision.json`);
const previous = parse(`${base}/previous-cards.json`);
const current = JSON.parse(frozen('data/cards.json')); // Historical baseline, not the mutable next revision.
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
test('frozen design records exact current and previous bytes, without certifying runtime', () => {
  assert.equal(hash(frozen('data/cards.json')), revision.cardsSha256);
  assert.equal(hash(read(`${base}/previous-cards.json`)), revision.previousCardsSha256);
  contract.validateDataset(current, { exportArtwork: true });
  assert.equal(current.cards.length, 132);
  assert.equal(revision.status, 'DesignFrozen_ExecutionNotValidated');
});
test('explicit UID revision reconstructs all user changes without silent deletion or mutation', () => {
  const reconstructed = new Map(previous.cards.map(c => [c.uid, structuredClone(c)]));
  assert.equal(revision.deleted.length, 5);
  for (const c of revision.deleted) {
    assert.deepEqual(reconstructed.get(c.uid), c);
    assert.equal(c.classId, 'Neutral'); assert.equal(c.collectable, false);
    reconstructed.delete(c.uid);
  }
  for (const entry of revision.changed) {
    const c = reconstructed.get(entry.uid); assert.ok(c);
    for (const [field, change] of Object.entries(entry.fields)) {
      assert.deepEqual(c[field], change.before); c[field] = change.after;
    }
  }
  for (const c of revision.added) { assert.ok(!reconstructed.has(c.uid)); reconstructed.set(c.uid, c); }
  assert.deepEqual([...reconstructed.values()].sort((a,b)=>a.uid.localeCompare(b.uid)), [...current.cards].sort((a,b)=>a.uid.localeCompare(b.uid)));
});
test('all 36 neutral collectible designs remain unchanged and derivatives are outside execution acceptance', () => {
  const neutral = d => d.cards.filter(c => c.classId === 'Neutral' && c.collectionKind === 'Collectible');
  assert.equal(neutral(current).length, 36);
  assert.deepEqual(neutral(current), neutral(previous));
  assert.equal(current.cards.filter(c => c.classId === 'Neutral' && !c.collectable).length, 8);
  assert.equal(revision.changed.filter(c => c.fields.rulesText).length, 21);
});

test('frozen rulebook bytes are bound to the same design revision', () => {
  assert.ok(Object.keys(revision.rulesSha256).length >= 38);
  for (const [path, expected] of Object.entries(revision.rulesSha256)) assert.equal(hash(frozen(path)), expected, path);
});

test('current approved faction batch keeps latest designer bytes and exact typed scope', () => {
  const latest = parse('data/cards.json');
  const batch = parse('data/baselines/issue44-factions-v1/revision.json');
  assert.equal(hash(read('data/cards.json')), batch.sourceCardsSha256);
  const scope = latest.cards.filter(c => ['SkyborneAlliance', 'SolarChurch'].includes(c.classId) || c.classId === 'Neutral' && c.collectionKind === 'Collectible');
  assert.equal(scope.length, 81);
  assert.equal(new Set(scope.map(c => c.uid)).size, 81);
  assert.equal(scope.filter(c => c.classId === 'Neutral').length, 37);
  contract.validateDataset(latest, { exportArtwork: true });
});
