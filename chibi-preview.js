(() => {
  "use strict";
  const labels = { idle: "常规待机", move: "移动", hit: "受击", attack: "攻击", effect: "发动效果", rare: "彩蛋待机" };
  const mounts = new WeakMap();
  function sourceRect(layout, index) {
    const r = layout.frames[index].rect;
    return { x: r.x, y: layout.sourceHeight - r.y - r.height, width: r.width, height: r.height };
  }
  function frameAt(clip, seconds) {
    const step = Math.floor(Math.max(0, seconds) * clip.fps);
    return clip.frames[clip.loop ? step % clip.frames.length : Math.min(step, clip.frames.length - 1)];
  }
  function create(tag, text, className) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function message(host, text) {
    mounts.get(host)?.dispose();
    host.replaceChildren(create("p", text, "chibi-preview-empty"));
  }
  function mount(host, entry, name) {
    mounts.get(host)?.dispose();
    host.replaceChildren();
    if (!entry || !entry.layout?.frames || !entry.atlasSrc?.startsWith(`./assets/card-chibis/${entry.uid}/`)) {
      message(host, "这张卡牌没有旧十二帧试稿记录；当前素材请前往正式 Chibi 人物工坊。");
      return;
    }
    const layout = entry.layout;
    const viewport = create("div", null, "chibi-viewport");
    const canvas = create("canvas"); canvas.width = 800; canvas.height = 760;
    canvas.setAttribute("aria-label", `${name} 的 Chibi 动作预览`);
    viewport.append(canvas);
    const toolbar = create("div", null, "chibi-toolbar");
    const select = create("select"); select.setAttribute("aria-label", "动作");
    for (const [key, label] of Object.entries(labels)) {
      const option = create("option", label); option.value = key; option.disabled = !layout.clips?.[key]; select.append(option);
    }
    const play = create("button", "暂停"); play.type = "button";
    const flip = create("button", "朝向 ←"); flip.type = "button";
    const background = create("button", "浅色背景"); background.type = "button";
    background.setAttribute("aria-pressed", "false");
    const rareLabel = create("label", null, "chibi-check");
    const automatic = create("input"); automatic.type = "checkbox"; automatic.checked = true;
    rareLabel.append(automatic, document.createTextNode("偶发彩蛋"));
    const zoomLabel = create("label", "缩放 ");
    const zoom = create("input"); zoom.type = "range"; zoom.min = ".5"; zoom.max = "1.5"; zoom.step = ".05"; zoom.value = "1"; zoom.setAttribute("aria-label", "角色缩放");
    zoomLabel.append(zoom);
    const scrubLabel = create("label", "逐帧 ");
    const scrub = create("input"); scrub.type = "range"; scrub.min = "0"; scrub.max = String(layout.frames.length - 1); scrub.step = "1"; scrub.value = "0"; scrub.setAttribute("aria-label", "动作帧");
    scrubLabel.append(scrub);
    toolbar.append(select, play, flip, background, rareLabel, zoomLabel, scrubLabel);
    const status = create("p", "", "chibi-preview-caption");
    const provenance = create("p", `${name} · ${entry.frameCount}/12 帧 · 历史试稿（已停用，非游戏素材）`, "chibi-provenance");
    host.append(viewport, toolbar, status, provenance);
    const image = new Image();
    let disposed = false, raf = 0, previous = 0, elapsed = 0, playing = true, facing = 1, manual = null, rareElapsed = 0;
    let nextRare = 8 + Math.random() * 7, clipName = "idle";
    const ctx = canvas.getContext("2d");
    function clip() { return layout.clips[clipName]; }
    function draw(index) {
      if (!image.complete || !image.naturalWidth) return;
      const r = sourceRect(layout, index), pivot = layout.frames[index].pivot;
      const scale = Math.min(620 / (layout.sourceWidth / 3), 570 / (layout.sourceHeight / 4)) * Number(zoom.value);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save(); ctx.translate(canvas.width / 2, canvas.height * .8); ctx.scale(facing, 1);
      ctx.drawImage(image, r.x, r.y, r.width, r.height, -r.width * pivot.x * scale, -r.height * (1 - pivot.y) * scale, r.width * scale, r.height * scale);
      ctx.restore(); scrub.value = String(index);
      status.textContent = manual === null
        ? `${labels[clipName]} · 第 ${index + 1} / ${layout.frames.length} 帧 · ${clip().fps} fps`
        : `逐帧浏览 · 第 ${index + 1} / ${layout.frames.length} 帧`;
    }
    function setClip(name) { clipName = name; select.value = name; elapsed = 0; manual = null; }
    function tick(now) {
      if (disposed) return;
      const dt = previous ? Math.min(.1, (now - previous) / 1000) : 0; previous = now;
      if (playing && !document.hidden && host.offsetParent !== null) {
        elapsed += dt;
        if (clipName === "idle" && automatic.checked) {
          rareElapsed += dt;
          if (rareElapsed >= nextRare && layout.clips.rare) { setClip("rare"); rareElapsed = 0; nextRare = 8 + Math.random() * 7; }
        } else if (clipName === "rare" && elapsed >= clip().frames.length / clip().fps) setClip("idle");
      }
      draw(manual ?? frameAt(clip(), elapsed)); raf = requestAnimationFrame(tick);
    }
    select.addEventListener("change", () => { setClip(select.value); rareElapsed = 0; });
    play.addEventListener("click", () => { playing = !playing; manual = null; play.textContent = playing ? "暂停" : "播放"; });
    flip.addEventListener("click", () => { facing *= -1; flip.textContent = facing === 1 ? "朝向 ←" : "朝向 →"; });
    background.addEventListener("click", () => {
      const light = viewport.classList.toggle("chibi-viewport-light");
      background.textContent = light ? "深色背景" : "浅色背景";
      background.setAttribute("aria-pressed", String(light));
    });
    scrub.addEventListener("input", () => { playing = false; manual = Number(scrub.value); play.textContent = "播放"; draw(manual); });
    image.addEventListener("error", () => { if (!disposed) message(host, "Chibi 图片无法加载，请检查镜像文件与来源提交。"); });
    image.src = entry.atlasSrc;
    mounts.set(host, { dispose() { disposed = true; cancelAnimationFrame(raf); } });
    raf = requestAnimationFrame(tick);
  }
  globalThis.TbhChibiPreview = { mount, message, sourceRect, frameAt };
})();
