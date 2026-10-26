import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import contract from "../chibi-workbench-contract.js";
import { validateReview } from "./validate-chibi-review.mjs";
import { bakeAtlas, PROCESSING_VERSION } from "./chibi-alpha-bake.mjs";

export const hash = bytes => createHash("sha256").update(bytes).digest("hex");
export function compileBundle(root, requested = null) {
  if (requested !== null && (!Array.isArray(requested) || requested.some(uid => typeof uid !== "string"))) throw new Error("导出UID必须是数组");
  const reviewBytes = fs.readFileSync(path.join(root, "data/chibi-review.json"));
  const workbenchBytes = fs.readFileSync(path.join(root, "data/chibi-workbench.json"));
  const review = JSON.parse(reviewBytes), workbench = JSON.parse(workbenchBytes), cards = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json")));
  contract.validate(workbench, review, cards, { allowStale: true });
  validateReview(review, cards, root);
  const arts = new Map(contract.sources(review).map(e => [e.uid, e]));
  const cardMap = new Map(cards.cards.map(c => [c.uid, c]));
  const wanted = requested ? new Set(requested) : new Set(workbench.entries.filter(e => e.exportReady).map(e => e.uid));
  if (!wanted.size) throw new Error("请选择至少一个单位");
  for (const uid of wanted) if (!arts.has(uid)) throw new Error(`未知导出UID：${uid}`);
  const units = [], images = [];
  for (const config of workbench.entries.filter(e => wanted.has(e.uid)).sort((a, b) => a.uid.localeCompare(b.uid))) {
    if (!config.exportReady) throw new Error(`单位尚未选定导出：${config.uid}`);
    const art = arts.get(config.uid), card = cardMap.get(config.uid), resolved = contract.resolve(art, config, workbench.defaults);
    const atlasPath = `atlases/${config.uid}.png`;
    if (!/^[a-z0-9-]+$/.test(config.uid)) throw new Error("不安全的UID路径");
    const bytes = fs.readFileSync(path.resolve(root, art.atlasSrc));
    if (hash(bytes) !== art.atlasSha256) throw new Error("PNG与清单哈希不一致");
    const baked = bakeAtlas(bytes, resolved.layout);
    const unit = { uid: config.uid, cardId: card.id, name: card.nameKey, atlasPath, sourceAtlasSha256: art.atlasSha256, atlasSha256: hash(baked.bytes), ...resolved, layout: baked.layout, processing: baked.processing };
    unit.calibrationSha256 = hash(contract.stableStringify(unit));
    units.push(unit); images.push({ path: atlasPath, bytes: baked.bytes, sourcePath: art.atlasSrc });
  }
  let websiteCommit = "uncommitted";
  try { websiteCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch {}
  return { manifest: { schemaVersion: 2, source: { processingVersion: PROCESSING_VERSION, websiteCommit, reviewManifestSha256: hash(reviewBytes), workbenchSha256: hash(workbenchBytes), goldenSha256: review.baseline.atlasSha256 }, units }, images };
}
export function writeBundle(bundle, destination, overwrite = false) {
  const out = path.resolve(destination), parent = path.dirname(out);
  if (fs.existsSync(out) && !overwrite) throw new Error("导出目录已存在；请换目录或显式使用 --overwrite");
  const files = new Set(["manifest.json"]), directories = new Set(["atlases"]), preserved = [];
  for (const image of bundle.images) {
    if (!/^atlases\/[a-z0-9-]+\.png$/.test(image.path)) throw new Error("不安全的导出路径");
    if (files.has(image.path)) throw new Error("重复的导出路径");
    files.add(image.path);
  }
  // Unity owns matching .meta files. Refuse unrecognized contents before staging
  // rather than deleting user files or an old packet's assets on subset export.
  function inspect(directory, relative = "") {
    if (!fs.lstatSync(directory).isDirectory() || fs.lstatSync(directory).isSymbolicLink()) throw new Error("导出目录必须是普通目录");
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const name = relative ? `${relative}/${entry.name}` : entry.name, absolute = path.join(directory, entry.name);
      if (entry.isDirectory() && directories.has(name)) inspect(absolute, name);
      else if (entry.isFile() && files.has(name)) continue;
      else if (entry.isFile() && name.endsWith(".meta") && (files.has(name.slice(0, -5)) || directories.has(name.slice(0, -5)))) preserved.push({ path: name, bytes: fs.readFileSync(absolute) });
      else throw new Error(`拒绝覆盖未知文件或目录：${name}；请导出至新目录`);
    }
  }
  if (fs.existsSync(out)) inspect(out);
  fs.mkdirSync(parent, { recursive: true });
  const staging = fs.mkdtempSync(path.join(parent, ".chibi-export-")), backup = `${out}.previous-${randomUUID()}`;
  let moved = false;
  try {
    fs.mkdirSync(path.join(staging, "atlases"));
    for (const image of bundle.images) {
      fs.writeFileSync(path.join(staging, image.path), image.bytes);
    }
    for (const meta of preserved) fs.writeFileSync(path.join(staging, meta.path), meta.bytes);
    fs.writeFileSync(path.join(staging, "manifest.json"), JSON.stringify(bundle.manifest, null, 2) + "\n");
    if (fs.existsSync(out)) { fs.renameSync(out, backup); moved = true; }
    fs.renameSync(staging, out);
    if (moved) fs.rmSync(backup, { recursive: true });
  } catch (error) {
    if (moved && !fs.existsSync(out)) fs.renameSync(backup, out);
    fs.rmSync(staging, { recursive: true, force: true }); throw error;
  }
  return out;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), value = flag => args.includes(flag) ? args[args.indexOf(flag) + 1] : null;
  const root = path.resolve(value("--root") || path.dirname(fileURLToPath(import.meta.url)) + "/..");
  try {
    const result = compileBundle(root, value("--uids")?.split(",") || null);
    if (!args.includes("--check")) {
      if (!value("--out")) throw new Error("请提供 --out /absolute/bundle-directory 或 --check");
      writeBundle(result, value("--out"), args.includes("--overwrite"));
    }
    console.log(JSON.stringify({ units: result.manifest.units.length, digest: hash(contract.stableStringify(result.manifest)), output: value("--out"), source: result.manifest.source }, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
