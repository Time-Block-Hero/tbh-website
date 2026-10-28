import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import contract from "../chibi-workbench-contract.js";
import { publishBundle } from "./publish-chibi-workbench.mjs";
import { compileBundle, hash } from "./export-chibi-workbench.mjs";

function sameLocalOrigin(request) {
  const addresses = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];
  if (!addresses.includes(request.socket.remoteAddress)) return false;
  try {
    const target = new URL(`http://${request.headers.host}`);
    if (!["127.0.0.1", "localhost", "[::1]"].includes(target.hostname)) return false;
    return !request.headers.origin || request.headers.origin === target.origin;
  } catch { return false; }
}
function tar(files) {
  const parts = [];
  for (const { name, bytes } of files) {
    const head = Buffer.alloc(512);
    head.write(name, 0, 100); head.write("0000644\0", 100); head.write("0000000\0", 108); head.write("0000000\0", 116);
    head.write(bytes.length.toString(8).padStart(11, "0") + "\0", 124); head.write("00000000000\0", 136);
    head.fill(32, 148, 156); head.write("0", 156); head.write("ustar\0", 257); head.write("00", 263);
    head.write([...head].reduce((sum, byte) => sum + byte, 0).toString(8).padStart(6, "0") + "\0 ", 148);
    parts.push(head, bytes, Buffer.alloc((512 - bytes.length % 512) % 512));
  }
  return Buffer.concat([...parts, Buffer.alloc(1024)]);
}
export function createChibiApi(root, { sendJson, readBody }) {
  const file = path.join(root, "data/chibi-workbench.json");
  let queue = Promise.resolve();
  const read = () => {
    const bytes = fs.readFileSync(file), reviewBytes = fs.readFileSync(path.join(root, "data/chibi-review.json"));
    return { bytes, dataset: JSON.parse(bytes), revision: hash(bytes), reviewRevision: hash(reviewBytes), review: JSON.parse(reviewBytes), cards: JSON.parse(fs.readFileSync(path.join(root, "data/cards.json"))) };
  };
  return async function handle(request, response, url) {
    if (!url.pathname.startsWith("/api/chibi/")) return false;
    try {
      if (request.method === "GET" && url.pathname === "/api/chibi/state") {
        const state = read(); contract.validate(state.dataset, state.review, state.cards, { allowStale: true });
        sendJson(response, 200, { dataset: state.dataset, revision: state.revision, reviewRevision: state.reviewRevision, projectWrite: sameLocalOrigin(request) }); return true;
      }
      if (request.method !== "POST" || !["/api/chibi/save", "/api/chibi/export", "/api/chibi/publish"].includes(url.pathname)) { sendJson(response, 405, { error: "不支持的Chibi请求" }); return true; }
      if (!sameLocalOrigin(request) || request.headers["x-tbh-chibi"] !== "1" || !request.headers["content-type"]?.startsWith("application/json")) {
        sendJson(response, 403, { error: "仅接受本机同源Chibi工作台的JSON请求" }); return true;
      }
      const body = JSON.parse(await readBody(request, 4 * 1024 * 1024));
      if (url.pathname === "/api/chibi/export") {
        if (!["manifest", "bundle"].includes(body.format)) throw new Error("未知运行包格式");
        const state = read();
        if (body.baseRevision !== state.revision) { sendJson(response, 409, { error: "配置已变化，请重新读取后导出" }); return true; }
        const bundle = compileBundle(root, body.uids || null);
        if (body.format === "manifest") sendJson(response, 200, bundle.manifest);
        else {
          const bytes = tar([{ name: "manifest.json", bytes: Buffer.from(JSON.stringify(bundle.manifest, null, 2) + "\n") }, ...bundle.images.map(i => ({ name: i.path, bytes: i.bytes }))]);
          response.writeHead(200, { "Content-Type": "application/x-tar", "Content-Disposition": 'attachment; filename="tbh-chibi-runtime.tar"', "Cache-Control": "no-store" }); response.end(bytes);
        }
        return true;
      }
      const job = () => {
        const state = read();
        if (body.baseRevision !== state.revision || body.reviewRevision !== state.reviewRevision) {
          const error = new Error("配置或素材已变化；未覆盖磁盘，请重新读取后合并草稿"); error.status = 409; throw error;
        }
        if (url.pathname === "/api/chibi/publish") return { ok: true, published: publishBundle(root) };
        contract.validate(body.dataset, state.review, state.cards, { allowStale: true });
        const bytes = Buffer.from(JSON.stringify(body.dataset, null, 2) + "\n"), temp = `${file}.${randomUUID()}.tmp`;
        try { fs.writeFileSync(temp, bytes, { flag: "wx" }); fs.renameSync(temp, file); }
        finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
        return { ok: true, revision: hash(bytes), reviewRevision: state.reviewRevision };
      };
      queue = queue.then(job, job); sendJson(response, 200, await queue);
    } catch (error) { sendJson(response, error.status || 400, { ok: false, error: error.message }); }
    return true;
  };
}
