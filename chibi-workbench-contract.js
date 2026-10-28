(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.TbhChibiContract = api;
})(typeof globalThis === "undefined" ? this : globalThis, function () {
  "use strict";
  const CLIPS = { idle: [0, 1, 2], move: [3, 4, 5], hit: [6], attack: [7], effect: [8] };
  const ACTIONS = Object.keys(CLIPS);
  const CLASSES = ["small", "standard", "heavy", "colossal", "floating"];
  const fail = message => { throw new Error(message); };
  const object = value => value && typeof value === "object" && !Array.isArray(value);
  function keys(value, allowed, label) {
    if (!object(value)) fail(`${label} 必须是对象`);
    for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${label} 不支持字段 ${key}`);
  }
  function number(value, min, max, label) { if (!Number.isFinite(value) || value < min || value > max) fail(`${label} 须在 ${min}–${max} 范围内`); }
  function vector(value, axes, min, max, label) { keys(value, axes, label); for (const key of axes) number(value[key], min, max, `${label}.${key}`); }
  function text(value, label) { if (typeof value !== "string" || value.length > 50000) fail(`${label} 文本无效或过长`); }
  function prompts(value, allowed, label) {
    keys(value, allowed, label);
    for (const [key, val] of Object.entries(value)) {
      if (key === "actions") { keys(val, ACTIONS, `${label}.actions`); for (const [action, content] of Object.entries(val)) text(content, `${label}.${action}`); }
      else text(val, `${label}.${key}`);
    }
  }
  function sources(review) { return [review.baseline, ...review.entries]; }
  function validate(data, review, cards, { allowStale = false } = {}) {
    keys(data, ["schemaVersion", "defaults", "entries", "provenance", "updatedAt"], "工作台");
    if (data.schemaVersion !== 1 || !Array.isArray(data.entries)) fail("不支持的工作台格式");
    keys(data.defaults, ["prompt"], "defaults");
    prompts(data.defaults.prompt, ["style", "negative", "actions"], "defaults.prompt");
    const expected = new Set(cards.cards.filter(c => c.cardType === "Minion").map(c => c.uid));
    const arts = new Map(sources(review).map(e => [e.uid, e])), seen = new Set(), stale = [];
    for (const e of data.entries) {
      keys(e, ["uid", "atlasSha256", "scale", "offset", "anchor", "actions", "frames", "prompt", "exportReady", "sizeClass", "bodyKind", "artworkFacesRight", "provenance", "updatedAt"], "单位配置");
      if (!expected.has(e.uid) || seen.has(e.uid) || !arts.has(e.uid)) fail(`未知或重复UID：${e.uid}`);
      seen.add(e.uid);
      if (!/^[a-f0-9]{64}$/.test(e.atlasSha256 || "")) fail("图集SHA-256格式无效");
      if (e.atlasSha256 !== arts.get(e.uid).atlasSha256) {
        stale.push(e.uid); if (!allowStale) fail(`素材已变化，须显式重新绑定：${e.uid}`);
      }
      number(e.scale, .1, 8, "整套尺寸"); vector(e.offset, ["x", "y", "z"], -4, 4, "棋盘偏移");
      if (e.anchor !== null) vector(e.anchor, ["x", "y"], 0, 1, "整套锚点");
      if (typeof e.artworkFacesRight !== "boolean" || typeof e.exportReady !== "boolean" || !CLASSES.includes(e.sizeClass) || !["humanoid", "quadruped", "floating"].includes(e.bodyKind)) fail("导出状态或体型无效");
      keys(e.actions, ACTIONS, "actions");
      for (const [name, action] of Object.entries(e.actions)) {
        keys(action, ["fps", "offset"], `actions.${name}`);
        if (action.fps !== undefined) number(action.fps, 1, 24, "动作fps");
        if (action.offset !== undefined) vector(action.offset, ["x", "y"], -4, 4, "动作偏移");
      }
      keys(e.frames, Array.from({ length: 9 }, (_, i) => String(i)), "frames");
      for (const frame of Object.values(e.frames)) {
        keys(frame, ["anchor", "offset"], "逐帧覆盖");
        if (frame.anchor !== undefined) vector(frame.anchor, ["x", "y"], 0, 1, "逐帧锚点");
        if (frame.offset !== undefined) vector(frame.offset, ["x", "y"], -4, 4, "逐帧偏移");
      }
      prompts(e.prompt, ["base", "notes", "actions"], "prompt");
    }
    if (seen.size !== expected.size) fail("工作台必须覆盖当前全部随从UID");
    return { units: seen.size, stale };
  }
  function resolve(art, config, defaults = {}) {
    if (!config || config.uid !== art.uid || config.atlasSha256 !== art.atlasSha256) fail("校准与当前素材不匹配");
    const layout = art.layout;
    if (layout?.frames?.length !== 9) fail("需要九帧图集");
    if (!Number.isFinite(layout.nominalCellHeight) || layout.nominalCellHeight <= 0) fail("名义图格高度须为正数");
    for(const frame of layout.frames){const r=frame.rect;if(!r||![r.x,r.y,r.width,r.height].every(Number.isInteger)||r.x<0||r.y<0||r.width<=0||r.height<=0||r.x+r.width>layout.sourceWidth||r.y+r.height>layout.sourceHeight)fail("原图帧rect必须是边界内整数");}
    for(const name of ACTIONS)if(JSON.stringify(layout.clips?.[name]?.frames)!==JSON.stringify(CLIPS[name]))fail("原图动作帧顺序不匹配");
    if(layout.clips.rare)fail("不支持彩蛋待机");
    const clips = {}, frames = layout.frames.map((frame, index) => {
      const name = ACTIONS.find(action => CLIPS[action].includes(index));
      const a = config.actions[name] || {}, f = config.frames[String(index)] || {};
      return { rect: { ...frame.rect }, pivot: { ...(f.anchor || config.anchor || frame.pivot) },
        offsetInTiles: { x: (a.offset?.x || 0) + (f.offset?.x || 0), y: (a.offset?.y || 0) + (f.offset?.y || 0) },
        ...(frame.excludedRects ? { excludedRects: frame.excludedRects.map(r => ({ ...r })) } : {}) };
    });
    for (const name of ACTIONS) clips[name] = { frames: [...CLIPS[name]], fps: config.actions[name]?.fps ?? layout.clips[name].fps, loop: name === "idle" || name === "move" };
    const prompt = { style: defaults.prompt?.style || "", negative: defaults.prompt?.negative || "", base: config.prompt.base || "", notes: config.prompt.notes || "", actions: {} };
    for (const name of ACTIONS) prompt.actions[name] = config.prompt.actions?.[name]?.trim() ? config.prompt.actions[name] : defaults.prompt?.actions?.[name] || "";
    return { bodyKind: config.bodyKind, artworkFacesRight: config.artworkFacesRight, heightInTiles: config.scale, groundOffsetInTiles: { ...config.offset },
      layout: { sourceWidth: layout.sourceWidth, sourceHeight: layout.sourceHeight, nominalCellHeight: layout.nominalCellHeight || layout.frames[0].rect.height, frames, clips }, prompt };
  }
  function assembledPrompt(config, defaults) {
    return [defaults.prompt?.style, config.prompt.base, ...ACTIONS.map(a => `${a}: ${config.prompt.actions?.[a]?.trim() ? config.prompt.actions[a] : defaults.prompt?.actions?.[a] || ""}`), config.prompt.notes, defaults.prompt?.negative ? `Avoid: ${defaults.prompt.negative}` : ""].filter(Boolean).join("\n\n");
  }
  function stableStringify(value) {
    const sort = v => Array.isArray(v) ? v.map(sort) : object(v) ? Object.fromEntries(Object.keys(v).sort().map(k => [k, sort(v[k])])) : v;
    return JSON.stringify(sort(value));
  }
  function recoveryContext(recovery, currentRevision, currentReviewRevision) {
    // Restoring old text does not grant permission to overwrite a newer disk snapshot.
    const revision = recovery.baseRevision || null, reviewRevision = recovery.reviewRevision || null;
    return { revision, reviewRevision, conflict: revision !== currentRevision || reviewRevision !== currentReviewRevision };
  }
  return { ACTIONS, CLIPS, CLASSES, validate, resolve, sources, assembledPrompt, stableStringify, recoveryContext };
});
