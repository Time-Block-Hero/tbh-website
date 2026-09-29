import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildEditorFallback } from "./card-editor-fallback.mjs";

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rosterPath = "Runtime/Resources/TimeBlockHeroAssets/stillfield-roster.json";
const uidPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

export function syncCardStandees({ assets, commit, root = defaultRoot, allowMissing = false, check = false }) {
  if (!/^[0-9a-f]{40}$/.test(commit || "")) throw new Error("必须指定完整的已提交 Assets SHA");
  assets = fs.realpathSync(assets);
  const gitBlob = (file) => execFileSync("git", ["-C", assets, "show", `${commit}:${file}`], { maxBuffer: 32 * 1024 * 1024 });
  const rosterBytes = gitBlob(rosterPath);
  const roster = JSON.parse(rosterBytes);
  const cards = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json")));
  const units = new Map(cards.cards.filter((card) => card.cardType === "Minion").map((card) => [card.uid, card]));
  const seen = new Set();
  const files = [];
  const entries = roster.cards.map((entry) => {
    const uid = entry.definitionUid;
    if (!uidPattern.test(uid || "") || !units.has(uid)) throw new Error(`未知单位 UID：${uid}`);
    if (seen.has(uid)) throw new Error(`重复立绘 UID：${uid}`);
    seen.add(uid);
    const expectedResource = `TimeBlockHeroAssets/Stillfield/${uid}`;
    if (entry.resourcePath !== expectedResource) throw new Error(`立绘路径不符合 UID 合同：${uid}`);
    if (entry.status !== "ready" || !/^[0-9a-f]{64}$/.test(entry.sha256 || "")) throw new Error(`立绘未就绪：${uid}`);
    const relativePath = `Runtime/Resources/${expectedResource}.png`;
    const fullPath = fs.realpathSync(path.join(assets, relativePath));
    if (!fullPath.startsWith(`${assets}${path.sep}`)) throw new Error(`立绘路径越界：${uid}`);
    const bytes = fs.readFileSync(fullPath);
    if (hash(bytes) !== entry.sha256) throw new Error(`立绘文件 SHA-256 不匹配：${uid}`);
    const committedBytes = gitBlob(relativePath);
    const pointer = committedBytes.toString("utf8").match(/^version https:\/\/git-lfs.github.com\/spec\/v1\noid sha256:([0-9a-f]{64})\nsize (\d+)\n$/);
    if (pointer ? pointer[1] !== entry.sha256 || Number(pointer[2]) !== bytes.length : hash(committedBytes) !== entry.sha256) {
      throw new Error(`立绘与指定提交不一致：${uid}`);
    }
    if (!bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || bytes.readUInt32BE(16) !== entry.pixelWidth || bytes.readUInt32BE(20) !== entry.pixelHeight) {
      throw new Error(`立绘 PNG 尺寸不匹配：${uid}`);
    }
    const src = `./assets/card-standees/${uid}.png`;
    files.push({ destination: path.join(root, src), bytes });
    return { definitionUid: uid, src, sha256: entry.sha256, pixelWidth: entry.pixelWidth, pixelHeight: entry.pixelHeight };
  }).sort((a, b) => a.definitionUid.localeCompare(b.definitionUid));
  const missing = [...units.keys()].filter((uid) => !seen.has(uid));
  if (missing.length && !allowMissing) throw new Error(`缺少 ${missing.length} 张单位立绘：${missing.join(", ")}`);
  const manifest = { schemaVersion: 1, source: { repository: "Time-Block-Hero/tbh-assets", commit, rosterPath, rosterSha256: hash(rosterBytes) }, entries };
  const manifestPath = path.join(root, "data/card-standees.json");
  const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
  if (check) {
    if (fs.readFileSync(manifestPath, "utf8") !== serialized) throw new Error("立绘索引需要同步");
    for (const file of files) if (!fs.readFileSync(file.destination).equals(file.bytes)) throw new Error(`网站立绘副本不一致：${file.destination}`);
    const expected = new Set(entries.map((entry) => `${entry.definitionUid}.png`));
    if (fs.readdirSync(path.join(root, "assets/card-standees")).some((name) => !expected.has(name))) throw new Error("存在未登记的网站立绘文件");
  } else {
    const destinationRoot = path.join(root, "assets/card-standees");
    fs.mkdirSync(destinationRoot, { recursive: true });
    for (const file of files) fs.writeFileSync(file.destination, file.bytes);
    const expected = new Set(entries.map((entry) => `${entry.definitionUid}.png`));
    for (const name of fs.readdirSync(destinationRoot)) {
      if (/^[0-9a-f-]{36}\.png$/.test(name) && !expected.has(name)) fs.unlinkSync(path.join(destinationRoot, name));
    }
    fs.writeFileSync(manifestPath, serialized);
    const layout = JSON.parse(fs.readFileSync(path.join(root, "card_layout_ref/layout.json")));
    fs.writeFileSync(path.join(root, "card-editor-data.js"), buildEditorFallback(root, cards, layout));
  }
  return { count: entries.length, missing, commit };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const value = (flag) => args[args.indexOf(flag) + 1];
  try {
    if (!args.includes("--assets") || !args.includes("--commit")) throw new Error("用法：node tools/sync-card-standees.mjs --assets <Assets路径> --commit <完整SHA> [--check] [--allow-missing]");
    console.log(JSON.stringify(syncCardStandees({ assets: value("--assets"), commit: value("--commit"), allowMissing: args.includes("--allow-missing"), check: args.includes("--check") }), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
