import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { compileBundle, hash } from "./export-chibi-workbench.mjs";

export function publishBundle(root, bundle = compileBundle(root)) {
  const directory = path.join(root, "assets/chibi-published"), output = path.join(root, "data/chibi-published.json");
  fs.mkdirSync(directory, { recursive: true });
  if (fs.lstatSync(directory).isSymbolicLink() || (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink())) throw new Error("发布目标不能是符号链接");
  const webAtlasSources = {};
  const images = new Map(bundle.images.map(i => [i.path, i]));
  // Hash-named derived images are immutable. Publish the manifest last so a
  // failed publish leaves the previous manifest unchanged. Unmodified source
  // images are reused by verified hash; later source replacement requires a
  // new publication (the browser refuses stale pixels).
  for (const unit of bundle.manifest.units) {
    const image = images.get(unit.atlasPath);
    if (!image || hash(image.bytes) !== unit.atlasSha256) throw new Error("发布包图集哈希不符");
    if (unit.sourceAtlasSha256 === unit.atlasSha256) webAtlasSources[unit.uid] = image.sourcePath;
    else {
      const name = `${unit.uid}-${unit.atlasSha256}.png`, filename = path.join(directory, name);
      if (fs.existsSync(filename)) {
        if (!fs.lstatSync(filename).isFile() || fs.lstatSync(filename).isSymbolicLink() || hash(fs.readFileSync(filename)) !== unit.atlasSha256) throw new Error("已发布图集身份不符");
      } else {
        const temp = `${filename}.${randomUUID()}.tmp`;
        try { fs.writeFileSync(temp, image.bytes, { flag: "wx" }); fs.renameSync(temp, filename); }
        finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
      }
      webAtlasSources[unit.uid] = `./assets/chibi-published/${name}`;
    }
  }
  const published = { ...bundle.manifest, webAtlasSources }, temp = `${output}.${randomUUID()}.tmp`;
  try { fs.writeFileSync(temp, JSON.stringify(published, null, 2) + "\n", { flag: "wx" }); fs.renameSync(temp, output); }
  finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
  return published;
}
export function checkPublished(root, bundle = compileBundle(root)) {
  const published = JSON.parse(fs.readFileSync(path.join(root, "data/chibi-published.json")));
  const normalize = m => JSON.stringify({ schemaVersion: m.schemaVersion, source: { ...m.source, websiteCommit: null }, units: m.units });
  if (normalize(published) !== normalize(bundle.manifest)) throw new Error("网页发布快照与当前保存配置/烘焙产物不同，请重新发布");
  for (const unit of published.units) {
    const source = published.webAtlasSources[unit.uid];
    if (!/^\.\/assets\/(?:chibi-review\/[a-z0-9-]+\/atlas|chibi-published\/[a-z0-9-]+)\.png$/.test(source || "")) throw new Error("发布图集路径不安全");
    if (hash(fs.readFileSync(path.join(root, source))) !== unit.atlasSha256) throw new Error(`网页发布图集已变化：${unit.uid}`);
  }
  return published;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), index = args.indexOf("--root"), root = path.resolve(index >= 0 ? args[index + 1] : path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
  try {
    const result = args.includes("--check") ? checkPublished(root) : publishBundle(root);
    console.log(JSON.stringify({ units: result.units.length, processingVersion: result.source.processingVersion, repaired: result.units.filter(u => u.processing.exclusionRectCount).map(u => ({ uid: u.uid, ...u.processing })), manifest: "data/chibi-published.json" }, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
