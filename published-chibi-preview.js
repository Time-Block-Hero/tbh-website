/* Reusable, read-only preview of the same published asset consumed by the game. */
(() => {
  "use strict";
  const ACTIONS = [["idle", "待机"], ["move", "移动"], ["hit", "受伤"], ["attack", "攻击"], ["effect", "发动效果"]];
  const create = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  function frameAt(clip, elapsed) {
    const index = Math.floor(Math.max(0, elapsed) * clip.fps);
    return clip.frames[clip.loop ? index % clip.frames.length : Math.min(index, clip.frames.length - 1)];
  }
  function mount(host, { uid, name = "" }) {
    const controller = new AbortController();
    let disposed = false, stage = null, raf = null, previous = null, elapsed = 0;
    let entry = null, action = "idle", playing = true;
    const message = create("p", "正在载入已发布 Chibi…", "published-chibi-status");
    message.setAttribute("role", "status");
    host.replaceChildren(message);
    function dispose() {
      if (disposed) return;
      disposed = true;
      controller.abort();
      if (raf !== null) cancelAnimationFrame(raf);
      stage?.dispose();
    }
    function fail(error) {
      if (disposed) return;
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      stage?.dispose();
      stage = null;
      host.replaceChildren(message);
      message.textContent = `Chibi 预览暂不可用：${error.message || error}。可前往人物工坊检查。`;
    }
    const ready = (async () => {
      try {
        if (location.protocol === "file:") throw new Error("请通过本地网站服务打开");
        const response = await fetch("./data/chibi-published.json", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("无法读取发布清单");
        const published = await response.json();
        if (disposed) return;
        entry = globalThis.TbhChibiPublished.entry(published, uid);
        const canvas = create("canvas");
        canvas.setAttribute("aria-label", `${name || "当前单位"}的已发布 Chibi 三维预览，可拖拽旋转和滚轮缩放`);
        const viewport = create("div", "", "published-chibi-viewport");
        viewport.append(canvas);
        const controls = create("div", "", "published-chibi-controls");
        const select = create("select");
        select.setAttribute("aria-label", "Chibi 动作");
        for (const [value, label] of ACTIONS) {
          const option = create("option", label);
          option.value = value;
          select.append(option);
        }
        const pause = create("button", "暂停");
        const flip = create("button", "朝向：右");
        const replay = create("button", "重播");
        for (const button of [pause, flip, replay]) button.type = "button";
        controls.append(select, pause, flip, replay);
        host.replaceChildren(viewport, controls, message);
        stage = new globalThis.TbhPaperStage(canvas);
        stage.compare = false;
        stage.reset();
        stage.onError = error => fail(new Error(error));
        await stage.setActor(0, entry);
        if (disposed || !stage) return;
        message.textContent = "已发布 Chibi · 拖拽旋转 · 滚轮缩放 · 双击复位";
        const options = { signal: controller.signal };
        select.addEventListener("change", () => {
          action = select.value;
          elapsed = 0;
          playing = true;
          pause.textContent = "暂停";
        }, options);
        pause.addEventListener("click", () => {
          playing = !playing;
          pause.textContent = playing ? "暂停" : "播放";
        }, options);
        flip.addEventListener("click", () => {
          stage.facing *= -1;
          flip.textContent = stage.facing === 1 ? "朝向：右" : "朝向：左";
        }, options);
        replay.addEventListener("click", () => {
          elapsed = 0;
          playing = true;
          pause.textContent = "暂停";
        }, options);
        function tick(now) {
          raf = null;
          if (disposed || !stage || document.hidden) return;
          if (previous !== null && playing && !document.hidden) elapsed += Math.min(.1, (now - previous) / 1000);
          previous = now;
          if (!document.hidden) {
            const clip = entry.layout.clips[action];
            const time = clip.loop ? elapsed : Math.min(elapsed, clip.frames.length / clip.fps);
            stage.action = action;
            stage.elapsed = time;
            stage.frameIndices[0] = frameAt(clip, time);
            stage.render();
          }
          if (!disposed && stage && !document.hidden) raf = requestAnimationFrame(tick);
        }
        document.addEventListener("visibilitychange", () => {
          previous = null;
          if (document.hidden) {
            if (raf !== null) cancelAnimationFrame(raf);
            raf = null;
          } else if (raf === null && !disposed && stage) raf = requestAnimationFrame(tick);
        }, options);
        if (!document.hidden) raf = requestAnimationFrame(tick);
      } catch (error) {
        fail(error);
      }
    })();
    return { dispose, ready };
  }
  globalThis.TbhPublishedChibiPreview = { mount, frameAt };
})();
