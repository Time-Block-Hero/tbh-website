import { inflateSync, deflateSync } from "node:zlib";

export const PROCESSING_VERSION = "chibi-alpha-bake-v1";
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const maxPixels = 4096 * 4096;
const crcTable = Uint32Array.from({ length: 256 }, (_, n) => {
  for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ n >>> 1 : n >>> 1;
  return n >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ crc >>> 8;
  return (crc ^ 0xffffffff) >>> 0;
}
export function pngChunk(type, data) {
  const out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length); out.write(type, 4); data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, out.length - 4)), out.length - 4);
  return out;
}
export function readRgbaPng(bytes) {
  if (!bytes.subarray(0, 8).equals(signature) || bytes.length > 100 * 1024 * 1024) throw new Error("烘焙需要有界 RGBA PNG");
  const chunks = [], compressed = [];
  let offset = 8, ended = false;
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset), end = offset + length + 12;
    if (end > bytes.length) throw new Error("PNG chunk 截断");
    const type = bytes.toString("ascii", offset + 4, offset + 8), data = bytes.subarray(offset + 8, end - 4);
    if (crc32(bytes.subarray(offset + 4, end - 4)) !== bytes.readUInt32BE(end - 4)) throw new Error("PNG CRC 无效");
    if (!["IHDR", "PLTE", "IDAT", "IEND"].includes(type) && /^[A-Z]/.test(type)) throw new Error(`不支持 PNG critical chunk: ${type}`);
    if (["acTL", "fcTL", "fdAT"].includes(type)) throw new Error("不支持动画 PNG");
    chunks.push({ type, data }); if (type === "IDAT") compressed.push(data);
    offset = end; if (type === "IEND") { ended = true; break; }
  }
  const header = chunks[0];
  if (!ended || offset !== bytes.length || header?.type !== "IHDR" || header.data.length !== 13 || !compressed.length || chunks.filter(c => c.type === "IHDR").length !== 1) throw new Error("PNG 结构无效");
  const h = header.data, width = h.readUInt32BE(), height = h.readUInt32BE(4);
  if (!width || !height || width * height > maxPixels || h[8] !== 8 || h[9] !== 6 || h[10] || h[11] || h[12]) throw new Error("只支持最多 4096² 像素的非交错 8-bit RGBA PNG");
  const stride = width * 4, expected = (stride + 1) * height;
  const raw = inflateSync(Buffer.concat(compressed), { maxOutputLength: expected });
  if (raw.length !== expected) throw new Error("PNG 像素长度不符");
  const pixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]; if (filter > 4) throw new Error("不支持 PNG filter");
    for (let x = 0; x < stride; x++) {
      const at = y * stride + x, a = x >= 4 ? pixels[at - 4] : 0, b = y ? pixels[at - stride] : 0, c = y && x >= 4 ? pixels[at - stride - 4] : 0;
      let prediction = 0;
      if (filter === 1) prediction = a;
      else if (filter === 2) prediction = b;
      else if (filter === 3) prediction = (a + b) >>> 1;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        prediction = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      pixels[at] = raw[y * (stride + 1) + 1 + x] + prediction;
    }
  }
  return { width, height, pixels, chunks };
}
export function writeRgbaPng(image) {
  const stride = image.width * 4, raw = Buffer.alloc((stride + 1) * image.height);
  for (let y = 0; y < image.height; y++) image.pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  let written = false;
  const chunks = [];
  for (const chunk of image.chunks) {
    if (chunk.type === "IDAT") {
      if (!written) { chunks.push(pngChunk("IDAT", deflateSync(raw, { level: 9 }))); written = true; }
    } else chunks.push(pngChunk(chunk.type, chunk.data));
  }
  return Buffer.concat([signature, ...chunks]);
}
const overlaps = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
export function bakeAtlas(bytes, layout) {
  const outputLayout = structuredClone(layout), cuts = [], repairs = [];
  outputLayout.frames.forEach((frame, index) => {
    for (const cut of frame.excludedRects || []) {
      if (![cut.x, cut.y, cut.width, cut.height].every(Number.isInteger) || cut.x < 0 || cut.y < 0 || cut.width <= 0 || cut.height <= 0 || cut.x + cut.width > frame.rect.width || cut.y + cut.height > frame.rect.height) throw new Error("离线修补矩形必须是帧内整数像素");
      const absolute = { x: frame.rect.x + cut.x, y: frame.rect.y + cut.y, width: cut.width, height: cut.height };
      if (layout.frames.some((other, i) => i !== index && overlaps(absolute, other.rect))) throw new Error("修补区域与其他帧共享像素，须重新排版图集后发布");
      cuts.push(absolute); repairs.push({ frameIndex: index, rect: { ...cut } });
    }
    delete frame.excludedRects;
  });
  const processing = { version: PROCESSING_VERSION, alphaClearedPixels: 0, exclusionRectCount: cuts.length, repairs };
  if (!cuts.length) return { bytes, layout: outputLayout, processing };
  const image = readRgbaPng(bytes);
  if (image.width !== layout.sourceWidth || image.height !== layout.sourceHeight) throw new Error("PNG 与发布尺寸不符");
  for (const cut of cuts) for (let y = cut.y; y < cut.y + cut.height; y++) for (let x = cut.x; x < cut.x + cut.width; x++) {
    const alpha = ((image.height - 1 - y) * image.width + x) * 4 + 3;
    if (image.pixels[alpha]) { processing.alphaClearedPixels++; image.pixels[alpha] = 0; }
  }
  return { bytes: writeRgbaPng(image), layout: outputLayout, processing };
}
