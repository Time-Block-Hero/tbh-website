import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = path => JSON.parse(readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8'));
const data = read('data/cards.json');
const migration = read('data/card-timing-migration.json');
const expectedQuick = new Set(['AI-014', 'FNG-004', 'FNG-005', 'FNG-010', 'FNG-011', 'MCC-015',
  'SA-012', 'SC-001', 'SC-005', 'SC-008', 'SC-014', 'SC-017', 'SC-018']);

test('approved timing manifest covers every stable design without changing its identity', () => {
  assert.equal(migration.status, 'ApprovedTimingMigration');
  assert.equal(migration.cards.length, 137);
  const byUid = new Map(data.cards.map(card => [card.uid, card]));
  assert.equal(byUid.size, 137);
  assert.equal(new Set(migration.cards.map(card => card.uid)).size, 137);
  for (const entry of migration.cards) {
    const card = byUid.get(entry.uid);
    assert.ok(card, entry.displayId);
    assert.equal(card.id, entry.displayId);
    assert.equal(card.nameKey, entry.name);
    assert.equal(card.rulesText, entry.newText, entry.displayId);
    assert.equal(entry.changed, entry.currentText !== entry.newText, entry.displayId);
  }
});

test('only the reviewed deployment support entries receive explicit Quick', () => {
  const actual = new Set(data.cards.filter(card => card.rulesText?.includes('[快速]')).map(card => card.id));
  assert.deepEqual(actual, expectedQuick);
  assert.equal(migration.cards.filter(card => card.changed).length, 22);
  const sola = data.cards.find(card => card.id === 'SC-018');
  assert.ok(!sola.rulesText.split('入场：')[0].includes('[快速]'));
});

test('default entry removes old Slow labels while separate removal effects retain their timing', () => {
  for (const id of ['FNG-006', 'FNG-015', 'FNG-016', 'FNG-034', 'SA-008', 'SC-002', 'SC-010', 'SC-011', 'SC-013']) {
    assert.ok(!data.cards.find(card => card.id === id).rulesText.includes('[慢速]'), id);
  }
  for (const id of ['SA-010', 'SA-011', 'SA-016']) {
    assert.ok(data.cards.find(card => card.id === id).rulesText.includes('[慢速]'), id);
  }
});

test('Fence the Goods explicitly limits Quick removal to this TimeStop own placements', () => {
  assert.equal(data.cards.find(card => card.id === 'SA-012').rulesText,
    '入场：[快速] 选择并移除一张本时停中由你放置的己方场上卡牌，获得等同于其费用的星能。');
});
