import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'bestiary-data.js'), 'utf8'), context);
const records = context.window.TBH_BESTIARY_RECORDS;
// Exact per-record fingerprints from bestiary.js at 557fb76, before the UI-only migration.
// Update only with an explicit content change, never to make a UI refactor pass.
const originalFingerprints = {
  "puru-beast": "d1f0f10f3ba30d0e17a25ab1df545abc1d83d3d6371f30c463ceca9bd57af78a",
  "borrowed-time-mayfly": "6679af4792226b71a4b770f606f50004ce3eb4dc9cf3cc48a8b0bea1a09a93ce",
  "navigation-sailbeast": "5659c7a1acd84fab44e992a82418355fa5dfd6928b0975f4dc5bc28f655dedd4",
  "star-shell-packbeast": "49074049db46564ea3bc4a4d702b6dbf312e5de448c3db8f125fec1a2afb6fd5",
  "sun-amber-swarm": "ddb65f3828ded5c0a6dbd2c7dce41e7fc494c8da145722464c91a8d4a3d9f4d4",
  "rust-eater-clawbeast": "f38b230b336f8c854e59b4ebfb7cdfe1933b03b538e1c1126e70fae9d332a677",
  "echo-homing-beast": "02634d3c0ee2754ec572c8c2ae070bee338569a165712929380049c99006a9ec",
  "riftsurf-diver": "a2aac9da5f61c4d47988c2196564455510ed3be1136c6c9f4da729b812329093",
  "duskbell-matriarch": "c1e067c14a09ad548045498ba4f48e804a00dccd3db4ca6cba78582b3c80e0d2",
  "celestial-angel": "ba3c3159c2fe980c55133b320fdf4764a704de4e263c3876784e46806147a95c",
  "celestial-sprite": "902b3a86567c05fc59c0795ded0f70e85368025a9b20d08bec9760bc843a27c2",
  "crystal-spirit": "b40ca4e5381af11a60ceba1a9a9caaa7e1a7b8007123f5b682e58ff4f1ed58d2",
  "avatar": "a9011962e76b6336bf1e032b3237ec6de6832fa2ad268522bde720ba64e9a814",
  "nebula-manifestation": "64c236a21b56d282277b29aa80b9197346b5108faf9b51282015d300bc346bec",
  "hollow-null": "e19bed0f7104383b607e171e5e7532217674b195dd738fd4cbbad24b69ac554e"
};

test('all 15 original creature records preserve every field and text exactly', () => {
  assert.equal(records.length, 15);
  assert.deepEqual(JSON.parse(JSON.stringify(records.map(record => record.id))), Object.keys(originalFingerprints));
  for (const record of records) {
    assert.equal(createHash('sha256').update(JSON.stringify(record)).digest('hex'), originalFingerprints[record.id], record.id);
  }
});

test('image references introduce no missing assets beyond the existing baseline gap', () => {
  const images = records.flatMap(record => [record.illustration, record.concept, ...(record.knownForms || []).map(form => form.concept), ...(record.specimens || []).map(specimen => specimen.src)]).filter(Boolean);
  assert.ok(images.length > 30);
  for (const image of images) assert.match(image, /^\.\/assets\//);
  const missing = images.filter(image => !fs.existsSync(path.join(root, image)));
  // This specimen was already absent at 557fb76; preserve its record and show an explicit UI placeholder.
  const knownMissing = './assets/card-art/rampaging-puru-beast/rampaging-puru-beast-01.png';
  assert.ok(missing.every(image => image === knownMissing), 'New missing image: ' + missing.join(', '));
});

test('legacy entrypoints preserve valid creature identities inside the homepage archive', () => {
  for (const [filename, homepage] of [['bestiary.html', 'index.html'], ['bestiary-en.html', 'index-en.html']]) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    const inline = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
    for (const [inputId, expectedId] of [['puru-beast', 'puru-beast'], ['missing-id', null]]) {
      let destination;
      const pageContext = {
        URL, URLSearchParams, window: { TBH_BESTIARY_RECORDS: records },
        location: { href: 'http://localhost/' + filename + '#' + inputId, hash: '#' + inputId, search: '', replace: value => { destination = new URL(value); } }
      };
      vm.runInNewContext(inline, pageContext);
      assert.equal(destination.pathname, '/' + homepage);
      assert.equal(destination.hash, '#bestiary');
      assert.equal(destination.searchParams.get('creature'), expectedId);
    }
  }
});
