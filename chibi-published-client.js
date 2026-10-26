(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.TbhChibiPublished = api;
})(typeof globalThis === "undefined" ? this : globalThis, function () {
  "use strict";
  function entry(published, uid) {
    if (published?.schemaVersion !== 2 || published.source?.processingVersion !== "chibi-alpha-bake-v1") throw new Error("不支持的游戏发布格式");
    const unit = published.units.find(u => u.uid === uid), source = published.webAtlasSources[uid];
    if (!unit) throw new Error("此单位尚未发布");
    if (!/^\.\/assets\/(?:chibi-review\/[a-z0-9-]+\/atlas|chibi-published\/[a-z0-9-]+)\.png$/.test(source || "")) throw new Error("发布图集路径无效");
    if (!/^[a-f0-9]{64}$/.test(unit.atlasSha256) || !/^[a-f0-9]{64}$/.test(unit.sourceAtlasSha256) || unit.processing?.version !== published.source.processingVersion || unit.layout.frames.some(f => f.excludedRects?.length)) throw new Error("游戏发布包含未处理的图集或修补配置");
    return { ...unit, atlasSrc: source, verifyAtlasSha256: true };
  }
  function current(unit, art, resolved, stableStringify) {
    if (!unit || unit.sourceAtlasSha256 !== art.atlasSha256) return false;
    const repairs=resolved.layout.frames.flatMap((frame,frameIndex)=>(frame.excludedRects||[]).map(rect=>({frameIndex,rect})));
    if(stableStringify(repairs)!==stableStringify(unit.processing.repairs))return false;
    const clean = structuredClone(resolved);
    for (const f of clean.layout.frames) delete f.excludedRects;
    return Object.keys(clean).every(key => stableStringify(clean[key]) === stableStringify(unit[key]));
  }
  async function imageBytes(e) {
    const response = await fetch(`${e.atlasSrc}?v=${e.atlasSha256}`, { cache: "no-store" });
    if (!response.ok) throw new Error("无法读取已发布 PNG");
    const bytes = await response.arrayBuffer(), digest = await crypto.subtle.digest("SHA-256", bytes);
    const actual = Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, "0")).join("");
    if (actual !== e.atlasSha256) throw new Error("已发布 PNG 的哈希不符，请重新发布；未使用旧图代替");
    return bytes;
  }
  function tar(files) {
    const encode = new TextEncoder(), parts = [];
    for (const { name, bytes } of files) {
      if (encode.encode(name).length > 99) throw new Error("运行包文件名过长");
      const head = new Uint8Array(512), write = (text, at) => head.set(encode.encode(text), at);
      write(name, 0); write("0000644\0", 100); write("0000000\0", 108); write("0000000\0", 116);
      write(bytes.byteLength.toString(8).padStart(11, "0") + "\0", 124); write("00000000000\0", 136);
      head.fill(32, 148, 156); write("0", 156); write("ustar\0", 257); write("00", 263);
      write(head.reduce((sum, byte) => sum + byte, 0).toString(8).padStart(6, "0") + "\0 ", 148);
      parts.push(head, bytes, new Uint8Array((512 - bytes.byteLength % 512) % 512));
    }
    return new Blob([...parts, new Uint8Array(1024)], { type: "application/x-tar" });
  }
  async function unitBundle(published, uid) {
    const e = entry(published, uid), unit = published.units.find(u => u.uid === uid), bytes = await imageBytes(e);
    const manifest = { schemaVersion: published.schemaVersion, source: published.source, units: [unit] };
    return tar([{ name: "manifest.json", bytes: new TextEncoder().encode(JSON.stringify(manifest, null, 2) + "\n") }, { name: unit.atlasPath, bytes }]);
  }
  return { entry, current, imageBytes, unitBundle, tar };
});
