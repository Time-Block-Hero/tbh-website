(async () => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const fallback = globalThis.__CARD_EDITOR_FALLBACK__ || {};
  const labels = { Neutral:"中立", SkyborneAlliance:"苍穹联合", SolarChurch:"太阳教会", AstraImperium:"星界帝国", MachineHeaven:"机械天国" };
  async function load(url, alternative) {
    if (location.protocol === "file:") return alternative;
    try { const response = await fetch(url, { cache:"no-store" }); if (response.ok) return await response.json(); } catch (_) { /* Offline mirror remains available. */ }
    return alternative;
  }
  try {
    const [dataset, manifest] = await Promise.all([load("./data/cards.json", fallback.cards), load("./data/card-chibis.json", fallback.chibis || { entries:[] })]);
    const units = dataset.cards.filter((c) => c.cardType === "Minion");
    const entries = new Map(manifest.entries.map((e) => [e.uid, e]));
    let selected = null;
    const actualCount = units.filter((c) => entries.has(c.uid)).length;
    $("chibiCoverage").textContent = `${actualCount} / ${units.length} 套历史试稿 · 已停用，非游戏素材 · 每套 12 帧 · 常规待机 / 移动 / 受击 / 攻击 / 发动效果 / 彩蛋待机。${manifest.source ? ` 来源 Presentation ${manifest.source.commit.slice(0, 10)}` : " 历史来源未记录。"}`;
    for (const [key, label] of Object.entries(labels)) { const option = document.createElement("option"); option.value = key; option.textContent = label; $("chibiFaction").append(option); }
    function select(card) {
      selected = card.uid;
      globalThis.TbhChibiPreview.mount($("chibiGalleryPreview"), entries.get(card.uid), card.nameKey);
      for (const button of $("chibiGrid").children) button.setAttribute("aria-pressed", String(button.dataset.uid === selected));
    }
    function render() {
      const search = $("chibiSearch").value.trim().toLowerCase(), faction = $("chibiFaction").value, availability = $("chibiAvailability").value;
      $("chibiGrid").replaceChildren();
      for (const card of units) {
        const entry = entries.get(card.uid);
        if ((faction && card.classId !== faction) || (search && !`${card.id} ${card.nameKey} ${card.englishName} ${card.uid}`.toLowerCase().includes(search)) || (availability === "ready" && !entry) || (availability === "missing" && entry)) continue;
        const button = document.createElement("button"); button.className = "chibi-library-card"; button.type = "button"; button.dataset.uid = card.uid; button.setAttribute("aria-pressed", String(card.uid === selected));
        const thumb = document.createElement("span");
        if (entry) {
          thumb.className = "chibi-thumbnail";
          const frame = globalThis.TbhChibiPreview.sourceRect(entry.layout, 0), scale = Math.min(76/frame.width, 84/frame.height);
          const img = document.createElement("img"); img.src = entry.atlasSrc; img.alt = ""; img.loading = "lazy"; img.style.width = `${entry.layout.sourceWidth*scale}px`; img.style.height = `${entry.layout.sourceHeight*scale}px`;
          img.style.left = `${-frame.x*scale + (76-frame.width*scale)/2}px`; img.style.top = `${-frame.y*scale + (84-frame.height*scale)/2}px`; thumb.append(img);
        } else { thumb.className = "chibi-missing-icon"; thumb.textContent = "◇"; }
        const name = document.createElement("strong"); name.textContent = card.nameKey;
        const meta = document.createElement("small"); meta.textContent = `${card.id} · ${labels[card.classId] || card.classId}`;
        const status = document.createElement("small"); status.textContent = entry ? "12 帧 · 历史试稿" : "无历史记录"; if(entry) status.className="chibi-available";
        button.append(thumb, name, meta, status); button.addEventListener("click", () => select(card)); $("chibiGrid").append(button);
      }
    }
    ["chibiSearch", "chibiFaction", "chibiAvailability"].forEach((id) => $(id).addEventListener("input", render));
    render();
    const requested = new URLSearchParams(location.search).get("unit");
    const first = units.find((c) => (c.uid === requested || c.id === requested) && entries.has(c.uid)) || units.find((c) => entries.has(c.uid)); if (first) select(first);
  } catch (error) { $("chibiCoverage").textContent = `合集加载失败：${error.message}`; }
})();
