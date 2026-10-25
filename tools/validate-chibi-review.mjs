import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export function validateReview(manifest, cards, directory = root) {
  const expected = new Set(cards.cards.filter(c => c.cardType === "Minion").map(c => c.uid));
  const seen = new Set();
  if (manifest.schemaVersion !== 1 || !manifest.baseline || !Array.isArray(manifest.entries)) throw new Error("Unsupported review manifest");
  if (manifest.baseline.status !== "golden") throw new Error("The original golden reference must remain explicitly identified");
  const counts = { golden: 0, pending: 0, generated: 0, reviewed: 0, "needs-fix": 0 };
  for (const entry of [manifest.baseline, ...manifest.entries]) {
    if (!expected.has(entry.uid) || seen.has(entry.uid)) throw new Error(`Unknown/duplicate UID: ${entry.uid}`);
    seen.add(entry.uid);
    if (!(entry.status in counts)) throw new Error(`Unknown status: ${entry.status}`);
    counts[entry.status]++;
    if (entry.status === "pending") {
      if (entry.atlasSrc || entry.layout) throw new Error("Pending entry must not disguise old artwork as a new candidate");
      continue;
    }
    if (!/^\.\/assets\/chibi-review\/[a-z0-9-]+\/atlas\.png$/.test(entry.atlasSrc || "")) throw new Error("Unsafe atlas path");
    const bytes = fs.readFileSync(path.join(directory, entry.atlasSrc));
    if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || bytes[25] !== 6) throw new Error("Atlas must be native RGBA PNG");
    if (createHash("sha256").update(bytes).digest("hex") !== entry.atlasSha256) throw new Error("Atlas hash changed");
    const layout = entry.layout;
    if (layout.sourceWidth !== bytes.readUInt32BE(16) || layout.sourceHeight !== bytes.readUInt32BE(20)) throw new Error("Atlas dimensions differ from layout");
    if (layout.frames?.length !== 9 || entry.frameCount !== 9 || layout.columns !== 3 || layout.rows !== 3) throw new Error("Candidate must contain nine source frames");
    for (const frame of layout.frames) {
      const r = frame.rect, p = frame.pivot;
      if (!r || !p || ![r.x, r.y, r.width, r.height, p.x, p.y].every(Number.isFinite)
        || r.x < 0 || r.y < 0 || r.width <= 0 || r.height <= 0 || r.x + r.width > layout.sourceWidth || r.y + r.height > layout.sourceHeight
        || p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) throw new Error("Invalid frame bounds or foot pivot");
    }
    if (layout.clips.rare) throw new Error("Special idle is not part of this review set");
    for (const [name, expectedFrames] of Object.entries({ idle: [0, 1, 2], move: [3, 4, 5], hit: [6], attack: [7], effect: [8] })) {
      const clip = layout.clips[name];
      if (!clip || !Number.isFinite(clip.fps) || clip.fps <= 0 || clip.fps > 24 || !Array.isArray(clip.frames)
        || new Set(clip.frames).size !== expectedFrames.length || expectedFrames.some(i => !clip.frames.includes(i))) throw new Error(`Invalid clip: ${name}`);
    }
  }
  if (seen.size !== expected.size) throw new Error("Roster coverage differs from canonical card source");
  return { units: seen.size, counts, pixelPolicy: "Original RGBA bytes; shared scale; variable frame rectangles" };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/chibi-review.json")));
  const cards = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json")));
  console.log(JSON.stringify(validateReview(manifest, cards), null, 2));
}
