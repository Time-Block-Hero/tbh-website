import assert from "node:assert/strict";
import contract from "../card-design-contract.js";

// Apply a declared editor operation by UID, not by mutable array position or display ID.
export function validateWrite(previous, next, operation) {
  contract.validateDataset(previous); contract.validateDataset(next);
  assert.ok(operation && ["edit", "create", "delete", "reorder", "import"].includes(operation.type), "Save requires an explicit identity operation");
  const oldCards = new Map(previous.cards.map((card) => [card.uid, card]));
  const newCards = new Map(next.cards.map((card) => [card.uid, card]));
  const added = [...newCards.keys()].filter((uid) => !oldCards.has(uid));
  const removed = [...oldCards.keys()].filter((uid) => !newCards.has(uid));
  const target = oldCards.get(operation.uid);
  if (operation.type === "create") {
    assert.deepEqual(added, [operation.uid], "Create must introduce exactly its declared fresh UID");
    assert.equal(removed.length, 0, "Create cannot remove existing identities");
  } else if (operation.type === "delete") {
    assert.ok(target, "Delete target UID does not exist");
    const expected = [target.uid, ...previous.cards.filter((card) => card.parentUid === target.uid).map((card) => card.uid)].sort();
    assert.deepEqual(removed.sort(), expected, "Delete must remove only its addressed card and children");
    assert.equal(added.length, 0, "Delete cannot add identities");
  } else {
    assert.equal(added.length, 0, "Existing card UID cannot be reassigned");
    assert.equal(removed.length, 0, "Existing card UID cannot be removed");
  }
  if (operation.type === "edit") assert.ok(target, "Edit target UID does not exist");
  const art = (dataset, card) => ({ variants: dataset.artworkVariants?.[card.id] || [], selected: dataset.selectedArtworkIds?.[card.id] ?? null });
  for (const [uid, before] of oldCards) {
    const after = newCards.get(uid);
    if (!after) continue;
    assert.equal(after.parentUid, before.parentUid, "Existing parent UID cannot be reassigned");
    if (operation.type === "import") {
      assert.equal(after.id, before.id, "Browser-draft import cannot change identity/display associations; apply reorders in the editor");
      continue;
    }
    if (operation.type === "edit" && uid === operation.uid) continue;
    const expected = { ...before }; const actual = { ...after };
    delete expected.id; delete actual.id;
    if (operation.type === "edit" && before.parentUid === operation.uid) expected.classId = newCards.get(operation.uid).classId;
    assert.deepEqual(actual, expected, `Operation changed an unaddressed identity: ${uid}`);
    assert.deepEqual(art(next, after), art(previous, before), `Operation changed artwork of an unaddressed identity: ${uid}`);
  }
}
