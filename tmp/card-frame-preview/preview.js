(() => {
  "use strict";

  const FACTIONS = {
    Neutral: { slug: "base", color: "#74d7f7" },
    SkyborneAlliance: { slug: "skyraider", color: "#78dc9d" },
    SolarChurch: { slug: "solar", color: "#ffc55f" },
    AstraImperium: { slug: "astra", color: "#c695ff" },
    MachineHeaven: { slug: "machine", color: "#74b9ff" },
  };
  const fallback = window.__CARD_EDITOR_FALLBACK__;
  const dataset = fallback.cards;
  const layout = fallback.layout;
  const textMeasureContext = document.createElement("canvas").getContext("2d");

  function assetForLayer(layer, card) {
    const faction = FACTIONS[card.classId] || FACTIONS.Neutral;
    if (layer.type === "frame") return `../../assets/card-template/Frames/card_frame_${faction.slug}.png`;
    if (layer.type === "boardFrame") {
      const suffix = faction.slug === "base" ? "" : `_${faction.slug}`;
      return `../../assets/card-template/Board/board_piece_frame${suffix}.png`;
    }
    const source = layer.src || "";
    const filename = source.split("/").pop();
    if (!filename || layer.id === "art") return "";
    if (source.includes("/Arrows/")) {
      const direction = layer.id.replace("arrow_", "").toUpperCase();
      if (!card.arrows?.includes(direction)) return "";
      const kind = ["N", "E", "S", "W"].includes(direction) ? "edge" : "corner";
      return `../../assets/card-template/Arrows/arrow_${kind}_active.png`;
    }
    if (source.includes("/Frames/")) return `../../assets/card-template/Frames/${filename}`;
    if (source.includes("/Icons/")) return `../../assets/card-template/Icons/${filename}`;
    return "";
  }

  function textForLayer(id, card) {
    return ({
      cost_value: card.costAmount,
      card_name: card.nameKey,
      tribe_text: (card.tribes || []).join(" · "),
      board_name: card.nameKey,
      effect_text: card.rulesText,
      atk_value: card.attack,
      board_atk_value: card.attack,
      mov_value: card.movement,
      board_mov_value: card.movement,
      hp_value: card.health,
      board_hp_value: card.health,
    })[id] ?? "";
  }

  function artworkFor(card) {
    const variants = dataset.artworkVariants?.[card.id] || [];
    const selectedId = dataset.selectedArtworkIds?.[card.id];
    const source = variants.find((variant) => variant.id === selectedId)?.src || variants[0]?.src || "";
    return source.replace(/^\.\/assets\//, "../../assets/");
  }

  function fittedTextSize(text, preferredSize, availableWidth, minimumSize = Math.max(22, preferredSize * 0.42)) {
    if (!textMeasureContext || !text) return preferredSize;
    textMeasureContext.font = `850 ${preferredSize}px Inter, "PingFang SC", "Microsoft YaHei", sans-serif`;
    const measuredWidth = textMeasureContext.measureText(text).width;
    if (measuredWidth <= availableWidth - 12) return preferredSize;
    return Math.max(minimumSize, preferredSize * (availableWidth - 12) / measuredWidth);
  }

  function createCardRender(card, view) {
    const viewName = `${view}${card.cardType === "Spell" ? "Spell" : "Unit"}`;
    const spec = layout[viewName];
    const canvas = spec.canvas;
    const render = document.createElement("div");
    render.className = `sample-render formal-card-render formal-card-render-${view}`;
    render.dataset.cardId = card.id;
    render.dataset.view = view;
    render.style.aspectRatio = `${canvas.width} / ${canvas.height}`;
    render.style.setProperty("--faction-color", (FACTIONS[card.classId] || FACTIONS.Neutral).color);

    for (const layerSpec of [...spec.layers].sort((a, b) => (a.z || 0) - (b.z || 0))) {
      if (layerSpec.visible === false) continue;
      let node;
      if (layerSpec.type === "text") {
        node = document.createElement("div");
        node.textContent = textForLayer(layerSpec.id, card);
        node.className = `formal-layer formal-text-layer ${layerSpec.className || ""}`;
        const preferredSize = layerSpec.fontSize || 40;
        const shouldFit = ["card_name", "board_name", "tribe_text"].includes(layerSpec.id);
        const fittedSize = shouldFit
          ? fittedTextSize(node.textContent, preferredSize, Number(layerSpec.w || canvas.width), layerSpec.id === "tribe_text" ? 12 : undefined)
          : preferredSize;
        node.style.fontSize = `${fittedSize / canvas.width * 100}cqw`;
      } else {
        const source = layerSpec.id === "art" ? artworkFor(card) : assetForLayer(layerSpec, card);
        if (!source) continue;
        node = document.createElement("img");
        node.src = source;
        node.alt = "";
        node.className = `formal-layer formal-image-layer layer-${layerSpec.id}`;
        if (layerSpec.fit === "topSquareCrop") node.style.objectPosition = "center top";
      }
      node.dataset.layer = layerSpec.id;
      node.style.left = `${Number(layerSpec.x || 0) / canvas.width * 100}%`;
      node.style.top = `${Number(layerSpec.y || 0) / canvas.height * 100}%`;
      node.style.width = `${Number(layerSpec.w || 0) / canvas.width * 100}%`;
      node.style.height = `${Number(layerSpec.h || 0) / canvas.height * 100}%`;
      node.style.zIndex = layerSpec.z || 1;
      node.style.opacity = layerSpec.opacity ?? 1;
      if (layerSpec.r) node.style.transform = `rotate(${layerSpec.r}deg)`;
      render.append(node);
    }
    return render;
  }

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "FNG-001";
  const view = params.get("view") === "board" ? "board" : "hand";
  const card = dataset.cards.find((item) => item.id === id);
  if (!card) throw new Error(`Unknown card: ${id}`);
  document.querySelector("#preview").append(createCardRender(card, view));
})();
