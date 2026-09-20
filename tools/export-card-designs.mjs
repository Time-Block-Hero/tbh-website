import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import contract from "../card-design-contract.js";

export const REPOSITORY = "https://github.com/Time-Block-Hero/tbh-website";
export const BASELINE_COMMIT = "61934bf29d0eec856c869aed0813e214e97f3cdc";
export const BASELINE_CARDS_SHA256 = "36b25808a643997769d68610645ca4cf6705a467cfa75318eb33a6953f7b1438";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const require = (condition, message) => { if (!condition) throw new Error(message); };

export function validateBridge(bridge, dataset, { requireCompleteBaseline = true } = {}) {
  require(bridge.schemaVersion === 1 && bridge.baselineCommit === BASELINE_COMMIT && bridge.baselineCardsSha256 === BASELINE_CARDS_SHA256, "Identity bridge baseline mismatch");
  require(Array.isArray(bridge.cards) && bridge.cards.length === 137, "Identity bridge must retain all 137 baseline records");
  const displayIds = new Set(), uids = new Set();
  const current = new Map(dataset.cards.map((card) => [card.uid, card]));
  for (const entry of bridge.cards) {
    require(typeof entry.baselineDisplayId === "string" && entry.baselineDisplayId.length > 0 && !displayIds.has(entry.baselineDisplayId), "Invalid or duplicate baseline display ID");
    require(contract.UUID.test(entry.uid) && !uids.has(entry.uid), "Invalid or duplicate bridge UID");
    if (requireCompleteBaseline) require(current.has(entry.uid), `Baseline UID missing from dataset: ${entry.baselineDisplayId}`);
    displayIds.add(entry.baselineDisplayId); uids.add(entry.uid);
  }
  const expected = {
    excludedUids: ["AI-020", "AI-020-01", "MCC-009", "MCC-009-01"],
    blankEffectUids: ["FNG-013", "FNG-UN-004", "FNG-UN-011", "SC-019"],
    resourceMigrationUids: [3, 5, 6, 7, 10, 12, 13].map((number) => `FNG-UN-${String(number).padStart(3, "0")}`),
  };
  const baseline = new Map(bridge.cards.map((entry) => [entry.baselineDisplayId, entry.uid]));
  for (const [field, ids] of Object.entries(expected)) {
    const wanted = ids.map((id) => baseline.get(id)).sort();
    require(wanted.every(Boolean) && Array.isArray(bridge[field]) && JSON.stringify([...bridge[field]].sort()) === JSON.stringify(wanted), `Identity bridge policy mismatch: ${field}`);
  }
  for (const uid of bridge.resourceMigrationUids.filter((uid) => current.has(uid))) require(current.get(uid).cardType === "Resource", `Resource type migration missing: ${uid}`);
  for (const uid of bridge.blankEffectUids.filter((uid) => current.has(uid))) require(current.get(uid).rulesText === "", `Blank design has an invented effect: ${uid}`);
  return bridge;
}

function buildExport(cardsBytes, bridgeBytes, commit, options = {}) {
  const dataset = contract.validateDataset(JSON.parse(cardsBytes), { exportArtwork: true });
  const bridge = validateBridge(JSON.parse(bridgeBytes), dataset, options);
  return {
    schemaVersion: 1,
    kind: "timeblock.card-designs",
    source: {
      repository: REPOSITORY,
      commit,
      cardsSha256: hash(cardsBytes),
      identityBridgeSha256: hash(bridgeBytes),
      datasetSchemaVersion: dataset.schemaVersion,
      dirty: commit === null,
    },
    cards: dataset.cards.map((card) => ({
      uid: card.uid,
      displayId: card.id,
      name: card.nameKey,
      nameEn: card.englishName,
      cardType: card.cardType,
      collectionKind: card.collectionKind,
      parentUid: card.parentUid,
      classId: card.classId,
      rarity: card.rarity,
      costResource: card.costResource,
      costAmount: card.costAmount,
      durability: card.durability,
      attack: card.cardType === "Minion" ? card.attack : null,
      health: card.cardType === "Minion" ? card.health : null,
      movement: card.cardType === "Minion" ? card.movement : null,
      arrows: [...card.arrows],
      tribes: card.cardType === "Minion" ? [...(card.tribes || [])] : [],
      tags: [...card.tags],
      rulesText: card.rulesText,
      artwork: { key: card.artworkKey || null, selected: contract.selectedArtwork(dataset, card) },
    })).sort((left, right) => left.uid < right.uid ? -1 : left.uid > right.uid ? 1 : 0),
    policy: {
      excludedUids: [...bridge.excludedUids].sort(),
      blankEffectUids: [...bridge.blankEffectUids].sort(),
      resourceMigrationUids: [...bridge.resourceMigrationUids].sort(),
    },
  };
}

export function exportCommittedDesigns(root, commit) {
  require(typeof commit === "string" && /^[0-9a-f]{40}$/.test(commit), "Export requires an explicit full committed SHA");
  const resolved = execFileSync("git", ["--no-replace-objects", "rev-parse", "--verify", `${commit}^{commit}`], { cwd: root, encoding: "utf8" }).trim();
  require(resolved === commit, "Source SHA did not resolve to the specified commit");
  const read = (relative) => execFileSync("git", ["--no-replace-objects", "show", `${commit}:${relative}`], { cwd: root, maxBuffer: 20 * 1024 * 1024 });
  return buildExport(read("data/cards.json"), read("data/card-identity-migration.json"), commit);
}

export function exportDirtyDesigns(root, options = {}) {
  return buildExport(fs.readFileSync(path.join(root, "data/cards.json")), fs.readFileSync(path.join(root, "data/card-identity-migration.json")), null, options);
}

function canonicalPath(value) {
  let ancestor = path.resolve(value);
  const missing = [];
  while (!fs.existsSync(ancestor)) {
    missing.unshift(path.basename(ancestor));
    const parent = path.dirname(ancestor);
    require(parent !== ancestor, "Cannot resolve output path");
    ancestor = parent;
  }
  return path.join(fs.realpathSync(ancestor), ...missing);
}

export function guardExportOutput(root, target) {
  let repositoryRoot = root;
  try {
    repositoryRoot = execFileSync("git", ["--no-replace-objects", "rev-parse", "--show-toplevel"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch { /* Development fixture without Git: protect the supplied source root. */ }
  const output = canonicalPath(target);
  const relative = path.relative(canonicalPath(repositoryRoot), output);
  const outside = relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
  require(outside || relative.startsWith(`artifacts${path.sep}`), "Export output must be outside the source repository or inside its artifacts directory");
  if (!outside && fs.existsSync(output)) {
    const tracked = execFileSync("git", ["--no-replace-objects", "ls-files", "--", relative], { cwd: repositoryRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
    require(!tracked, "Export cannot overwrite a tracked source file");
  }
  return output;
}

const ownPath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === ownPath) {
  try {
    const args = process.argv.slice(2);
    const flags = new Set(["--root", "--commit", "--output", "--dirty"]);
    for (let index = 0; index < args.length; index++) {
      require(flags.has(args[index]), `Unknown argument: ${args[index]}`);
      if (args[index] !== "--dirty") require(args[++index] && !args[index].startsWith("--"), "Missing flag value");
    }
    const value = (name) => args.includes(name) ? args[args.indexOf(name) + 1] : null;
    require(args.includes("--dirty") !== args.includes("--commit"), "Specify exactly one of --commit SHA or --dirty (development only)");
    const root = path.resolve(value("--root") || path.join(path.dirname(ownPath), ".."));
    const result = args.includes("--dirty") ? exportDirtyDesigns(root) : exportCommittedDesigns(root, value("--commit"));
    const json = `${JSON.stringify(result, null, 2)}\n`;
    if (value("--output")) {
      const output = guardExportOutput(root, value("--output"));
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.writeFileSync(output, json);
    }
    else process.stdout.write(json);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
