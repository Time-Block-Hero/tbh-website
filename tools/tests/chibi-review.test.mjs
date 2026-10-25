import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { root, validateReview } from "../validate-chibi-review.mjs";

const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/chibi-review.json")));
const cards = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json")));
const sandbox = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "chibi-review.js"), "utf8"), sandbox);
const { frameAt, pickEntry } = sandbox.TbhChibiReview;

test("current review roster covers all units and verifies native image hashes", () => {
  const result = validateReview(manifest, cards);
  assert.equal(result.units, cards.cards.filter(c => c.cardType === "Minion").length);
  assert.equal(result.counts.golden, 1);
});
test("pending artwork is visibly old even if the previous manifest called it reviewed", () => {
  const selected = pickEntry("example", { baseline: { uid: "gold" }, entries: [{ uid: "example", status: "pending" }] }, { entries: [{ uid: "example", status: "reviewed", atlasSrc: "old.png" }] });
  assert.equal(selected.status, "pending");
  assert.equal(selected.atlasSrc, "old.png");
});
test("new original is selected without altering the golden baseline", () => {
  const baseline = { uid: "gold", atlasSrc: "original.png" };
  const selected = pickEntry("gold", { baseline, entries: [{ uid: "gold", atlasSrc: "wrong.png" }] }, { entries: [] });
  assert.equal(selected.atlasSrc, "original.png");
  assert.equal(selected.status, "golden");
  assert.equal(baseline.status, undefined);
});
test("animation clamps one-shot poses and loops movement at the declared cadence", () => {
  assert.equal(frameAt({ frames: [3, 4, 5], fps: 6, loop: true }, .5), 3);
  assert.equal(frameAt({ frames: [3, 4, 5], fps: 6, loop: true }, .2), 4);
  assert.equal(frameAt({ frames: [6], fps: 6, loop: false }, 99), 6);
  assert.equal(frameAt({ frames: [0, 1, 2], fps: 3, loop: true }, -2), 0);
});
test("duplicate identities and malformed source dimensions fail acceptance", () => {
  const duplicate = structuredClone(manifest);
  duplicate.entries.push(duplicate.entries[0]);
  assert.throws(() => validateReview(duplicate, cards), /duplicate UID/);
  const malformed = structuredClone(manifest);
  malformed.baseline.layout.sourceWidth++;
  assert.throws(() => validateReview(malformed, cards), /dimensions/);
});
test("candidate image corruption cannot silently pass as current art", () => {
  const changed = structuredClone(manifest);
  changed.baseline.atlasSha256 = "0".repeat(64);
  assert.throws(() => validateReview(changed, cards), /hash changed/);
});
