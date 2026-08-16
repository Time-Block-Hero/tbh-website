import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const valueAfter = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const root = path.resolve(valueAfter("--root", scriptRoot));
const host = valueAfter("--host", "127.0.0.1");
const port = Number(valueAfter("--port", "4317"));
const cardsPath = path.join(root, "data", "cards.json");
const layoutPath = path.join(root, "card_layout_ref", "layout.json");
const fallbackPath = path.join(root, "card-editor-data.js");
const artworkRoot = path.join(root, "assets", "card-art");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};
let writeQueue = Promise.resolve();

function send(response, status, body, contentType = "application/json; charset=utf-8") {
  response.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(body);
}

function sendJson(response, status, value) {
  send(response, status, JSON.stringify(value));
}

function readBody(request, limit = 50 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("保存数据超过 50 MB 限制"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function validateDataset(dataset) {
  if (!dataset || !Array.isArray(dataset.cards)) throw new Error("卡牌数据格式无效");
  const cardIds = new Set();
  const artworkKeys = new Map();
  for (const card of dataset.cards) {
    if (!card?.id || cardIds.has(card.id)) throw new Error(`卡牌 ID 无效或重复：${card?.id || "空"}`);
    cardIds.add(card.id);
    if (card.artworkKey) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.artworkKey)) throw new Error(`插画名称无效：${card.artworkKey}`);
      const owner = artworkKeys.get(card.artworkKey);
      if (owner && owner !== card.id) throw new Error(`插画名称重复：${card.artworkKey}`);
      artworkKeys.set(card.artworkKey, card.id);
    }
  }
  for (const [cardId, variants] of Object.entries(dataset.artworkVariants || {})) {
    if (!cardIds.has(cardId) || !Array.isArray(variants)) throw new Error(`插画关联的卡牌不存在：${cardId}`);
    const ids = new Set();
    for (const variant of variants) {
      if (!variant?.id || ids.has(variant.id)) throw new Error(`插画 variant 重复：${cardId}`);
      if (typeof variant.src !== "string" || (!variant.src.startsWith("data:") && !variant.src.startsWith("./assets/card-art/"))) {
        throw new Error(`插画路径不安全：${variant?.src || "空"}`);
      }
      ids.add(variant.id);
    }
    const selected = dataset.selectedArtworkIds?.[cardId];
    if (selected && !ids.has(selected)) throw new Error(`正式插画不存在：${cardId}/${selected}`);
  }
}

function safeArtworkKey(value) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || "")) throw new Error(`插画名称无效：${value || "空"}`);
  return value;
}

function renameArtworkDirectory(oldKeyValue, newKeyValue) {
  const oldKey = safeArtworkKey(oldKeyValue);
  const newKey = safeArtworkKey(newKeyValue);
  if (oldKey === newKey) return () => {};
  const oldDirectory = path.join(artworkRoot, oldKey);
  const newDirectory = path.join(artworkRoot, newKey);
  if (!fs.existsSync(oldDirectory)) return () => {};
  if (fs.existsSync(newDirectory)) throw new Error(`目标插画目录已存在：${newKey}`);
  fs.renameSync(oldDirectory, newDirectory);
  const renamedFiles = [];
  try {
    for (const filename of fs.readdirSync(newDirectory)) {
      if (!filename.startsWith(`${oldKey}-`)) continue;
      const renamed = `${newKey}${filename.slice(oldKey.length)}`;
      fs.renameSync(path.join(newDirectory, filename), path.join(newDirectory, renamed));
      renamedFiles.push([renamed, filename]);
    }
  } catch (error) {
    for (const [renamed, original] of renamedFiles.reverse()) {
      fs.renameSync(path.join(newDirectory, renamed), path.join(newDirectory, original));
    }
    fs.renameSync(newDirectory, oldDirectory);
    throw error;
  }
  return () => {
    for (const [renamed, original] of renamedFiles.reverse()) {
      fs.renameSync(path.join(newDirectory, renamed), path.join(newDirectory, original));
    }
    fs.renameSync(newDirectory, oldDirectory);
  };
}

function writeProject(dataset, artworkRename) {
  validateDataset(dataset);
  if (artworkRename?.oldKey || artworkRename?.newKey) {
    const oldKey = safeArtworkKey(artworkRename.oldKey);
    const newKey = safeArtworkKey(artworkRename.newKey);
    if (oldKey === newKey) throw new Error("插画名称没有变化");
    const owner = dataset.cards.find((card) => card.artworkKey === newKey);
    if (!owner) throw new Error(`新插画名称没有对应卡牌：${newKey}`);
    const variants = dataset.artworkVariants?.[owner.id] || [];
    if (variants.some((variant) => !variant.src.startsWith("data:") && !variant.src.startsWith(`./assets/card-art/${newKey}/`))) {
      throw new Error(`插画路径尚未更新为英文名：${newKey}`);
    }
  }
  const layout = JSON.parse(fs.readFileSync(layoutPath, "utf8"));
  const cardsText = `${JSON.stringify(dataset, null, 2)}\n`;
  const fallbackText = `/* Generated by tools/build-card-editor-fallback.mjs. */\nwindow.__CARD_EDITOR_FALLBACK__ = ${JSON.stringify({ cards: dataset, layout })};\n`;
  const oldCardsText = fs.readFileSync(cardsPath, "utf8");
  const oldFallbackText = fs.readFileSync(fallbackPath, "utf8");
  let rollbackArtwork = () => {};
  try {
    if (artworkRename?.oldKey && artworkRename?.newKey) {
      rollbackArtwork = renameArtworkDirectory(artworkRename.oldKey, artworkRename.newKey);
    }
    fs.writeFileSync(cardsPath, cardsText);
    fs.writeFileSync(fallbackPath, fallbackText);
  } catch (error) {
    const rollbackErrors = [];
    try { rollbackArtwork(); } catch (rollbackError) { rollbackErrors.push(rollbackError); }
    try { fs.writeFileSync(cardsPath, oldCardsText); } catch (rollbackError) { rollbackErrors.push(rollbackError); }
    try { fs.writeFileSync(fallbackPath, oldFallbackText); } catch (rollbackError) { rollbackErrors.push(rollbackError); }
    if (rollbackErrors.length) {
      throw new Error(`${error.message}；回滚异常：${rollbackErrors.map((entry) => entry.message).join("；")}`);
    }
    throw error;
  }
}

async function handleSave(request, response) {
  try {
    const body = JSON.parse(await readBody(request));
    const job = () => writeProject(body.dataset, body.artworkRename);
    writeQueue = writeQueue.then(job, job);
    await writeQueue;
    sendJson(response, 200, { ok: true, savedAt: new Date().toISOString() });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message });
  }
}

function serveStatic(request, response, url) {
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  } catch {
    sendJson(response, 400, { error: "地址格式无效" });
    return;
  }
  if (pathname.split("/").some((segment) => segment.startsWith("."))) {
    sendJson(response, 403, { error: "禁止访问隐藏文件" });
    return;
  }
  const target = path.resolve(root, `.${pathname}`);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    sendJson(response, 403, { error: "禁止访问项目目录之外的文件" });
    return;
  }
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    sendJson(response, 404, { error: "文件不存在" });
    return;
  }
  response.writeHead(200, {
    "Content-Type": mimeTypes[path.extname(target).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  if (request.method === "HEAD") response.end();
  else fs.createReadStream(target).pipe(response);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${host}:${port}`);
  if (request.method === "GET" && url.pathname === "/api/editor-capabilities") {
    sendJson(response, 200, { projectWrite: true, artworkRename: true });
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/cards/save") {
    await handleSave(request, response);
    return;
  }
  if (request.method === "GET" || request.method === "HEAD") {
    serveStatic(request, response, url);
    return;
  }
  sendJson(response, 405, { error: "不支持的请求方法" });
});

server.listen(port, host, () => {
  console.log(`Time-Block Hero card editor: http://${host}:${port}`);
  console.log(`Project writes enabled for: ${root}`);
});
