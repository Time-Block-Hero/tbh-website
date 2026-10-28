import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildEditorFallback } from "./card-editor-fallback.mjs";

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const rosterPath = "Runtime/VisualAssets/Chibi/roster.json";
const uidPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const clipNames = ["idle", "move", "hit", "attack", "effect", "rare"];

export function validateChibiLayout(layout, width, height) {
  if (layout.sourceWidth !== width || layout.sourceHeight !== height) throw new Error("Chibi atlas 尺寸与 layout 不匹配");
  if (layout.columns !== 3 || layout.rows !== 4 || layout.frames?.length !== 12) throw new Error("Chibi 必须包含 3 列 4 行的 12 帧");
  for (const frame of layout.frames) {
    const r = frame.rect, p = frame.pivot;
    if (!r || !p || ![r.x, r.y, r.width, r.height, p.x, p.y].every(Number.isFinite)
      || r.x < 0 || r.y < 0 || r.width <= 0 || r.height <= 0 || r.x + r.width > width || r.y + r.height > height
      || p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) throw new Error("Chibi 帧范围或 pivot 无效");
  }
  for (const name of clipNames) {
    const clip = layout.clips?.[name];
    if (!clip || !Array.isArray(clip.frames) || !clip.frames.length || !Number.isFinite(clip.fps) || clip.fps <= 0 || clip.fps > 60
      || clip.frames.some((i) => !Number.isInteger(i) || i < 0 || i >= 12)) throw new Error(`Chibi 缺少有效动作：${name}`);
  }
}

function committedFile(presentation, commit, relativePath, expectedHash) {
  if (!relativePath?.startsWith("Runtime/VisualAssets/Chibi/") || relativePath.split("/").some((p) => p === ".." || !p)) throw new Error("Chibi 路径越界");
  if (!/^[0-9a-f]{64}$/.test(expectedHash || "")) throw new Error("Chibi SHA-256 无效");
  const blob = execFileSync("git", ["-C", presentation, "show", `${commit}:${relativePath}`], { maxBuffer: 64 * 1024 * 1024 });
  const pointer = blob.toString("utf8").match(/^version https:\/\/git-lfs.github.com\/spec\/v1\noid sha256:([0-9a-f]{64})\nsize (\d+)\n$/);
  let bytes = blob;
  if (pointer) {
    // LFS files must be materialized in the selected checkout; never resolve an arbitrary external symlink.
    const absolute = fs.realpathSync(path.join(presentation, relativePath));
    if (!absolute.startsWith(`${presentation}${path.sep}`)) throw new Error("Chibi LFS 路径越界");
    bytes = fs.readFileSync(absolute);
    if (pointer[1] !== expectedHash || Number(pointer[2]) !== bytes.length) throw new Error("Chibi LFS 与指定提交不一致");
  }
  if (hash(bytes) !== expectedHash) throw new Error(`Chibi SHA-256 与指定提交不一致：${relativePath}`);
  return bytes;
}

export function syncCardChibis({ presentation, commit, root = defaultRoot, allowMissing = false, check = false }) {
  if (!/^[0-9a-f]{40}$/.test(commit || "")) throw new Error("必须指定完整的已提交 Presentation SHA");
  presentation = fs.realpathSync(presentation);
  const rosterBytes = execFileSync("git", ["-C", presentation, "show", `${commit}:${rosterPath}`], { maxBuffer: 16 * 1024 * 1024 });
  const roster = JSON.parse(rosterBytes);
  if (roster.schemaVersion !== 1 || !Array.isArray(roster.entries)) throw new Error("不支持的 Chibi roster schema");
  const cards = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json")));
  const units = new Map(cards.cards.filter((c) => c.cardType === "Minion").map((c) => [c.uid, c]));
  const seen = new Set(), files = [];
  const entries = roster.entries.map((entry) => {
    if (!uidPattern.test(entry.uid || "") || !units.has(entry.uid)) throw new Error(`未知单位 UID：${entry.uid}`);
    if (seen.has(entry.uid)) throw new Error(`重复 Chibi UID：${entry.uid}`);
    seen.add(entry.uid);
    if (entry.frameCount !== 12) throw new Error(`Chibi 帧数不完整：${entry.uid}`);
    const bytes = committedFile(presentation, commit, entry.atlasPath, entry.atlasSha256);
    if (bytes.length < 33 || !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error("Chibi atlas 不是 PNG");
    const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
    const layoutBytes = committedFile(presentation, commit, entry.layoutPath, entry.layoutSha256);
    const layout = JSON.parse(layoutBytes);
    validateChibiLayout(layout, width, height);
    const atlasSrc = `./assets/card-chibis/${entry.uid}/atlas.png`;
    const layoutSrc = `./assets/card-chibis/${entry.uid}/layout.json`;
    files.push({ destination: path.join(root, atlasSrc), bytes }, { destination: path.join(root, layoutSrc), bytes: layoutBytes });
    return { uid: entry.uid, atlasSrc, layoutSrc, atlasSha256: entry.atlasSha256, layoutSha256: entry.layoutSha256,
      frameCount: 12, status: entry.status || "provisional", bodyType: entry.bodyType || null,
      height: entry.height ?? null, contentHeightRatio: entry.contentHeightRatio ?? null,
      artworkFacesRight: entry.artworkFacesRight ?? null, provenance: entry.provenance || null, layout };
  }).sort((a, b) => a.uid.localeCompare(b.uid));
  const missing = [...units.keys()].filter((uid) => !seen.has(uid)).sort();
  if (missing.length && !allowMissing) throw new Error(`缺少 ${missing.length} 套 Chibi：${missing.join(", ")}`);
  const manifest = { schemaVersion: 1, source: { repository: "Time-Block-Hero/tbh-presentation-ui", commit, rosterPath, rosterSha256: hash(rosterBytes) },
    coverage: { expected: units.size, available: entries.length, missing }, entries };
  const destination = path.join(root, "data/card-chibis.json"), serialized = `${JSON.stringify(manifest, null, 2)}\n`;
  if (check) {
    if (!fs.existsSync(destination) || fs.readFileSync(destination, "utf8") !== serialized) throw new Error("Chibi 索引需要同步");
    for (const file of files) if (!fs.existsSync(file.destination) || !fs.readFileSync(file.destination).equals(file.bytes)) throw new Error(`网站 Chibi 镜像不一致：${file.destination}`);
  } else {
    for (const file of files) { fs.mkdirSync(path.dirname(file.destination), { recursive: true }); fs.writeFileSync(file.destination, file.bytes); }
    fs.writeFileSync(destination, serialized);
    const layout = JSON.parse(fs.readFileSync(path.join(root, "card_layout_ref/layout.json")));
    fs.writeFileSync(path.join(root, "card-editor-data.js"), buildEditorFallback(root, cards, layout));
  }
  return { count: entries.length, expected: units.size, missing, commit };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), value = (flag) => args[args.indexOf(flag) + 1];
  try {
    if (!args.includes("--presentation") || !args.includes("--commit")) throw new Error("用法：node tools/sync-card-chibis.mjs --presentation <Presentation路径> --commit <完整SHA> [--check] [--allow-missing]");
    console.log(JSON.stringify(syncCardChibis({ presentation: value("--presentation"), commit: value("--commit"), allowMissing: args.includes("--allow-missing"), check: args.includes("--check") }), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
