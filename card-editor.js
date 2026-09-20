(() => {
  "use strict";

  const STORAGE_KEY = "tbh-formal-card-editor-v5";
  const designContract = globalThis.TbhCardDesign;
  const RECOVERY_KEY = "tbh-card-editor-unsynced-recovery-v1";
  const DIRECTIONS = ["NW", "N", "NE", "W", "E", "SW", "S", "SE"];
  const TRIBES = ["机械", "人类", "反抗军", "奇兽", "空亡体", "星云体", "兽裔(Avatar)", "晶灵", "建筑"];
  const TRIBE_ALIASES = {
    Mech: "机械",
    Human: "人类",
    Pirate: "反抗军",
    HollowNull: "空亡体",
    "Hollow-Null": "空亡体",
    Avatar: "兽裔(Avatar)",
    Building: "建筑",
  };
  const FACTIONS = {
    Neutral: { label: "中立（银河航商会）", slug: "base", color: "#74d7f7", prefix: "FNG" },
    SkyborneAlliance: { label: "苍穹联合", slug: "skyraider", color: "#78dc9d", prefix: "SA" },
    SolarChurch: { label: "太阳教会", slug: "solar", color: "#ffc55f", prefix: "SC" },
    AstraImperium: { label: "星界帝国", slug: "astra", color: "#c695ff", prefix: "AI" },
    MachineHeaven: { label: "机械天国", slug: "machine", color: "#74b9ff", prefix: "MCC" },
  };

  let initialized = false;
  let layout = null;
  let dataset = null;
  let collectableView = true;
  let currentId = null;
  let pendingArtworkVariants = null;
  let pendingSelectedArtworkId = null;
  let pendingArtworkKey = "";
  let draggingCardId = null;
  let draggingInsertSide = "before";
  let suppressCardClick = false;
  let projectSyncAvailable = false;
  let artworkDeleteAvailable = false;
  let projectSyncQueue = Promise.resolve();
  let projectCardsRevision = null;
  let projectConfirmedDataset = null;
  let projectSyncBlocked = false;
  let browserDraftOverwriteWarningPending = false;
  let baseDatasetLabel = "仓库 JSON";
  const textMeasureContext = document.createElement("canvas").getContext("2d");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const isDerivative = (id) => Boolean(cardById(id)?.parentUid);
  const parentId = (id) => {
    const card = cardById(id);
    return card?.parentUid ? dataset.cards.find((entry) => entry.uid === card.parentUid)?.id : id;
  };
  const cardById = (id) => dataset?.cards.find((card) => card.id === id);
  const derivativesOf = (id) => dataset.cards.filter((card) => parentId(card.id) === parentId(id) && isDerivative(card.id));
  const isHero = (card) => card?.collectionKind === "Hero";
  const sameCardGroup = (a, b) => a?.classId === b?.classId && Boolean(a?.collectable) === Boolean(b?.collectable);

  function artworkKeyFromEnglishName(englishName) {
    return String(englishName || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function artworkKeyConflict(key, cardId) {
    return dataset.cards.find((card) => card.id !== cardId
      && (card.artworkKey || artworkKeyFromEnglishName(card.englishName)) === key);
  }

  function rootSequence(id) {
    return Number(id.match(/-(\d{3})$/)?.[1] || 0);
  }

  function rootsInGroup(classId, collectable) {
    return dataset.cards
      .filter((card) => !isDerivative(card.id) && card.classId === classId && Boolean(card.collectable) === Boolean(collectable))
      .sort((a, b) => {
        if (isHero(a) !== isHero(b)) return isHero(a) ? -1 : 1;
        return rootSequence(a.id) - rootSequence(b.id) || a.id.localeCompare(b.id, "en", { numeric: true });
      });
  }

  function sortDatasetCards() {
    const factionOrder = Object.keys(FACTIONS);
    dataset.cards.sort((a, b) => {
      const aRoot = cardById(parentId(a.id)) || a;
      const bRoot = cardById(parentId(b.id)) || b;
      const factionDelta = factionOrder.indexOf(aRoot.classId) - factionOrder.indexOf(bRoot.classId);
      if (factionDelta) return factionDelta;
      const collectableDelta = Number(Boolean(bRoot.collectable)) - Number(Boolean(aRoot.collectable));
      if (collectableDelta) return collectableDelta;
      const sequenceDelta = rootSequence(aRoot.id) - rootSequence(bRoot.id);
      if (sequenceDelta) return sequenceDelta;
      if (a.id === aRoot.id) return -1;
      if (b.id === bRoot.id) return 1;
      return a.id.localeCompare(b.id, "en", { numeric: true });
    });
  }

  function remapCardIds(rootMapping) {
    const cardMapping = { ...rootMapping };
    for (const card of dataset.cards) {
      if (!isDerivative(card.id)) continue;
      const oldParentId = parentId(card.id);
      const newParentId = rootMapping[oldParentId];
      if (newParentId) cardMapping[card.id] = `${newParentId}-${card.id.split("-").at(-1)}`;
    }

    const variantIdMapping = {};
    const remappedVariants = {};
    for (const [oldCardId, variants] of Object.entries(dataset.artworkVariants || {})) {
      const newCardId = cardMapping[oldCardId] || oldCardId;
      remappedVariants[newCardId] = variants.map((variant) => {
        const newVariantId = variant.id.startsWith(`${oldCardId}-A`)
          ? `${newCardId}${variant.id.slice(oldCardId.length)}`
          : variant.id;
        variantIdMapping[variant.id] = newVariantId;
        return { ...variant, id: newVariantId };
      });
    }

    const remappedSelected = {};
    for (const [oldCardId, variantId] of Object.entries(dataset.selectedArtworkIds || {})) {
      remappedSelected[cardMapping[oldCardId] || oldCardId] = designContract.mapSelection(variantId, variantIdMapping);
    }

    for (const card of dataset.cards) card.id = cardMapping[card.id] || card.id;
    dataset.artworkVariants = remappedVariants;
    dataset.selectedArtworkIds = remappedSelected;
    if (currentId) currentId = cardMapping[currentId] || currentId;
    sortDatasetCards();
    return cardMapping;
  }

  function renumberRootOrder(orderedRoots) {
    if (!orderedRoots.length) return {};
    const { classId, collectable } = orderedRoots[0];
    const faction = FACTIONS[classId] || FACTIONS.Neutral;
    const heroes = collectable ? orderedRoots.filter(isHero) : [];
    const regular = orderedRoots.filter((card) => !isHero(card));
    const canonicalOrder = [...heroes, ...regular];
    const rootMapping = {};
    let regularOrder = 0;
    canonicalOrder.forEach((card) => {
      const number = isHero(card) ? "000" : String(++regularOrder).padStart(3, "0");
      rootMapping[card.id] = collectable ? `${faction.prefix}-${number}` : `${faction.prefix}-UN-${number}`;
    });
    remapCardIds(rootMapping);
    return rootMapping;
  }

  function readLocalState(base) {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved?.schemaVersion === base.schemaVersion && Array.isArray(saved.cards)) {
        saved.artworkVariants ||= {};
        saved.selectedArtworkIds ||= {};
        return saved;
      }
    } catch (error) {
      console.warn("Unable to read local card edits", error);
    }
    return null;
  }

  function loadLocalState(base) {
    return readLocalState(base) || base;
  }

  function confirmBrowserDraftOverwrite() {
    if (projectSyncBlocked) {
      setStatus("请先导出未同步草稿，然后重新加载页面再继续编辑", "error");
      return false;
    }
    if (!browserDraftOverwriteWarningPending) return true;
    const confirmed = window.confirm(
      `你当前正在基于${baseDatasetLabel}进行编辑，但浏览器里已有一份不同的本地草稿。\n\n`
      + "继续保存会用当前编辑内容覆盖原有本地草稿。建议先导出需要保留的草稿。\n\n"
      + "点击“确定”继续并允许覆盖；点击“取消”返回且不保存本次修改。",
    );
    if (!confirmed) {
      setStatus("未保存；原有本地草稿未被覆盖", "error");
      return false;
    }
    browserDraftOverwriteWarningPending = false;
    return true;
  }

  function normalizeDatasetForCurrentRules() {
    // Schema 4 is already explicit. Loading must never repair identities, card text,
    // candidate art, or selected variants by guessing from names/display numbers.
    designContract.validateDataset(dataset);
    return false;
  }

  async function detectProjectSync() {
    if (window.location.protocol === "file:" || !["127.0.0.1", "localhost", "::1"].includes(window.location.hostname)) return false;
    try {
      const response = await fetch("./api/editor-capabilities", { cache: "no-store" });
      const capabilities = response.ok ? await response.json() : null;
      artworkDeleteAvailable = Boolean(capabilities?.artworkDelete);
      projectCardsRevision = capabilities?.cardsRevision || null;
      return Boolean(capabilities?.projectWrite && capabilities?.artworkRename);
    } catch {
      return false;
    }
  }

  async function persist({ artworkRename = null, artworkDeletes = [], operation = { type: "reorder" } } = {}) {
    designContract.validateDataset(dataset);
    const snapshot = structuredClone(dataset);
    if (!projectSyncAvailable) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      setStatus("已保存到本机浏览器", "saved");
      return true;
    }
    setStatus("正在写入项目…");
    const write = async () => {
      if (projectSyncBlocked) throw new Error("先前保存失败，需要重新加载");
      const response = await fetch("./api/cards/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset: snapshot, artworkRename, artworkDeletes, operation, baseRevision: projectCardsRevision }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || `项目保存失败 (${response.status})`);
      projectCardsRevision = result.cardsRevision;
      projectConfirmedDataset = structuredClone(snapshot);
      return result;
    };
    projectSyncQueue = projectSyncQueue.then(write, write);
    try {
      await projectSyncQueue;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      setStatus("已写入项目 JSON", "saved");
      return true;
    } catch (error) {
      console.error(error);
      projectSyncBlocked = true;
      let recoveryMessage;
      try {
        localStorage.setItem(RECOVERY_KEY, JSON.stringify({ dataset: snapshot, operation, baseRevision: projectCardsRevision, error: error.message }));
        recoveryMessage = "更改已保留为未同步草稿，可用“导出 JSON”恢复；请重新加载再编辑";
      } catch {
        downloadJson(snapshot, "unsynced-cards.json");
        recoveryMessage = "本机草稿保存失败，已尝试下载恢复文件；请保留该文件后重新加载";
      }
      if (projectConfirmedDataset) {
        const selectedUid = snapshot.cards.find((card) => card.id === currentId)?.uid;
        dataset = structuredClone(projectConfirmedDataset);
        renderGallery();
        const selected = dataset.cards.find((card) => card.uid === selectedUid);
        if (selected) showCard(selected.id);
        else closeEditor();
      }
      setStatus(`${error.message || "项目保存失败"}。${recoveryMessage}`, "error");
      return false;
    }
  }

  function setStatus(message, state = "") {
    for (const node of [$("#cardSaveStatus"), $("#projectSaveStatus")].filter(Boolean)) {
      node.textContent = message;
      node.dataset.state = state;
    }
  }

  function assetForLayer(layer, card, viewName) {
    const faction = FACTIONS[card.classId] || FACTIONS.Neutral;
    if (layer.type === "frame") {
      return `./assets/card-template/Frames/card_frame_${faction.slug}.png`;
    }
    if (layer.type === "boardFrame") {
      const suffix = faction.slug === "base" ? "" : `_${faction.slug}`;
      return `./assets/card-template/Board/board_piece_frame${suffix}.png`;
    }
    const source = layer.src || "";
    const filename = source.split("/").pop();
    if (!filename || layer.id === "art") return "";
    if (source.includes("/Arrows/")) {
      const direction = layer.id.replace("arrow_", "").toUpperCase();
      if (!card.arrows?.includes(direction)) return "";
      const kind = ["N", "E", "S", "W"].includes(direction) ? "edge" : "corner";
      return `./assets/card-template/Arrows/arrow_${kind}_active.png`;
    }
    if (source.includes("/Frames/")) return `./assets/card-template/Frames/${filename}`;
    if (source.includes("/Icons/")) return `./assets/card-template/Icons/${filename}`;
    return "";
  }

  function textForLayer(id, card) {
    const values = {
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
    };
    return values[id] ?? "";
  }

  function artworkFor(card) {
    const variants = card.id === currentId && pendingArtworkVariants
      ? pendingArtworkVariants
      : (dataset.artworkVariants?.[card.id] || []);
    const selectedId = card.id === currentId && pendingArtworkVariants
      ? pendingSelectedArtworkId
      : dataset.selectedArtworkIds?.[card.id];
    return variants.find((variant) => variant.id === (Array.isArray(selectedId) ? selectedId[0] : selectedId))?.src || variants[0]?.src || "";
  }

  function fittedCardNameSize(text, preferredSize, availableWidth, minimumSize = Math.max(22, preferredSize * 0.42)) {
    if (!textMeasureContext || !text) return preferredSize;
    textMeasureContext.font = `850 ${preferredSize}px Inter, "PingFang SC", "Microsoft YaHei", sans-serif`;
    const measuredWidth = textMeasureContext.measureText(text).width;
    if (measuredWidth <= availableWidth - 12) return preferredSize;
    return Math.max(minimumSize, preferredSize * (availableWidth - 12) / measuredWidth);
  }

  function createCardRender(card, view = "board") {
    const isSpell = card.cardType !== "Minion";
    const viewName = `${view}${isSpell ? "Spell" : "Unit"}`;
    const spec = layout[viewName];
    const canvas = spec.canvas;
    const render = document.createElement("div");
    render.className = `formal-card-render formal-card-render-${view}`;
    render.dataset.rarity = card.rarity || "Common";
    render.style.aspectRatio = `${canvas.width} / ${canvas.height}`;
    render.style.setProperty("--faction-color", (FACTIONS[card.classId] || FACTIONS.Neutral).color);

    const placeholder = document.createElement("div");
    placeholder.className = "formal-card-placeholder";
    placeholder.innerHTML = "<span>ART MISSING</span>";
    render.append(placeholder);

    for (const layerSpec of [...spec.layers].sort((a, b) => (a.z || 0) - (b.z || 0))) {
      if (layerSpec.visible === false) continue;
      let node;
      if (layerSpec.type === "text") {
        node = document.createElement("div");
        node.textContent = textForLayer(layerSpec.id, card);
        node.className = `formal-layer formal-text-layer ${layerSpec.className || ""}`;
        const preferredSize = layerSpec.fontSize || 40;
        const isCardName = layerSpec.id === "card_name" || layerSpec.id === "board_name";
        const isTribeText = layerSpec.id === "tribe_text";
        const fittedSize = isCardName || isTribeText
          ? fittedCardNameSize(node.textContent, preferredSize, Number(layerSpec.w || canvas.width), isTribeText ? 12 : undefined)
          : preferredSize;
        node.style.fontSize = `${fittedSize / canvas.width * 100}cqw`;
      } else {
        const source = layerSpec.id === "art" ? artworkFor(card) : assetForLayer(layerSpec, card, viewName);
        if (!source) continue;
        node = document.createElement("img");
        node.src = source;
        node.alt = "";
        node.draggable = false;
        node.className = `formal-layer formal-image-layer layer-${layerSpec.id}`;
        if (layerSpec.fit === "topSquareCrop") node.style.objectPosition = "center top";
      }
      node.dataset.layer = layerSpec.id;
      const x = Number(layerSpec.x || 0);
      const y = Number(layerSpec.y || 0);
      const w = Number(layerSpec.w || 0);
      const h = Number(layerSpec.h || 0);
      node.style.left = `${x / canvas.width * 100}%`;
      node.style.top = `${y / canvas.height * 100}%`;
      node.style.width = `${w / canvas.width * 100}%`;
      node.style.height = `${h / canvas.height * 100}%`;
      node.style.zIndex = layerSpec.z || 1;
      node.style.opacity = layerSpec.opacity ?? 1;
      if (layerSpec.r) node.style.transform = `rotate(${layerSpec.r}deg)`;
      render.append(node);
    }
    if (view === "board") {
      const designerCost = document.createElement("div");
      designerCost.className = "formal-board-designer-cost";
      designerCost.textContent = String(card.costAmount ?? 0);
      designerCost.title = `费用 ${card.costAmount ?? 0}`;
      designerCost.setAttribute("aria-label", `费用 ${card.costAmount ?? 0}`);
      render.append(designerCost);
    }
    return render;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
    })[character]);
  }

  function filteredCards() {
    const query = ($("#cardSearch")?.value || "").trim().toLowerCase();
    const faction = $("#cardFactionFilter")?.value || "all";
    const type = $("#cardTypeFilter")?.value || "all";
    const sortMode = $("#cardViewSort")?.value || "id";
    return dataset.cards
      .filter((card) => !isDerivative(card.id))
      .filter((card) => Boolean(card.collectable) === collectableView)
      .filter((card) => faction === "all" || card.classId === faction)
      .filter((card) => type === "all" || card.cardType === type)
      .filter((card) => !query || `${card.nameKey} ${card.englishName} ${card.id}`.toLowerCase().includes(query))
      .sort((a, b) => {
        const idDelta = a.id.localeCompare(b.id, "en", { numeric: true });
        if (sortMode === "cost-asc") return Number(a.costAmount || 0) - Number(b.costAmount || 0) || idDelta;
        if (sortMode === "cost-desc") return Number(b.costAmount || 0) - Number(a.costAmount || 0) || idDelta;
        return idDelta;
      });
  }

  function renderGallery() {
    const grid = $("#cardCenterGrid");
    if (!grid || !dataset || !layout) return;
    const cards = filteredCards();
    const sortMode = $("#cardViewSort")?.value || "id";
    const canReorder = sortMode === "id";
    grid.replaceChildren();
    for (const card of cards) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "formal-card-tile";
      item.dataset.cardId = card.id;
      item.draggable = canReorder && !isHero(card);
      item.setAttribute("aria-label", `${card.nameKey} · ${card.id}`);
      item.append(createCardRender(card, "board"));
      if (canReorder && !isHero(card)) {
        const dragHandle = document.createElement("span");
        dragHandle.className = "formal-card-drag-handle";
        dragHandle.textContent = "⠿";
        dragHandle.title = "拖到同势力、同收集状态的卡牌前后以插入并重新编号";
        item.append(dragHandle);
      }
      grid.append(item);
    }
    $("#cardCountLabel").textContent = canReorder ? `${cards.length} 张` : `${cards.length} 张 · 仅视图排序`;
  }

  function addMainCard() {
    if (!confirmBrowserDraftOverwrite()) return;
    const selectedFaction = $("#cardFactionFilter").value;
    const classId = selectedFaction === "all" ? "Neutral" : selectedFaction;
    const temporaryId = `NEW-${Date.now()}`;
    const card = {
      id: temporaryId,
      nameKey: "新卡牌",
      englishName: "",
      cardType: "Minion",
      classId,
      rarity: "Common",
      collectable: collectableView,
      costResource: "Star",
      costAmount: 0,
      attack: 0,
      health: 1,
      movement: 0,
      durability: 0,
      rulesText: "",
      arrows: [],
      tribes: [],
      tags: [],
      artPath: "",
      artworkKey: "",
      artDescription: "",
      artDescriptionNeedsPolish: true,
      artRequest: 1,
    };
    designContract.assignNewIdentity(card);
    dataset.cards.push(card);
    const mapping = renumberRootOrder([...rootsInGroup(classId, collectableView).filter((entry) => entry !== card), card]);
    const newId = mapping[temporaryId];
    persist({ operation: { type: "create", uid: card.uid } });
    renderGallery();
    openEditor(newId);
  }

  function moveMainCardToPosition(draggedId, targetId, insertSide) {
    const dragged = cardById(draggedId);
    const target = cardById(targetId);
    if (!dragged || !target || isDerivative(dragged.id) || isDerivative(target.id) || !sameCardGroup(dragged, target)) return false;
    if (isHero(dragged) || isHero(target)) return false;
    const ordered = rootsInGroup(dragged.classId, dragged.collectable);
    const draggedIndex = ordered.indexOf(dragged);
    if (draggedIndex < 0 || !ordered.includes(target) || dragged === target) return false;
    const before = ordered.map((card) => card.id).join("|");
    ordered.splice(draggedIndex, 1);
    const targetIndex = ordered.indexOf(target);
    ordered.splice(targetIndex + (insertSide === "after" ? 1 : 0), 0, dragged);
    if (before === ordered.map((card) => card.id).join("|")) return false;
    if (!confirmBrowserDraftOverwrite()) return false;
    renumberRootOrder(ordered);
    persist();
    renderGallery();
    return true;
  }

  function fillForm(card) {
    const form = $("#cardEditorForm");
    for (const name of ["attack", "health", "movement"]) form.elements.namedItem(name).value = card[name] ?? 0;
    for (const [key, value] of Object.entries(card)) {
      const field = form.elements.namedItem(key);
      if (!field) continue;
      if (key === "collectable") field.value = String(Boolean(value));
      else if (key === "artDescriptionNeedsPolish") field.checked = Boolean(value);
      else field.value = value ?? "";
    }
    $$("#tribeSelector button").forEach((button) => {
      const selected = card.tribes?.includes(button.dataset.tribe);
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(Boolean(selected)));
    });
    syncCardTypeFields();
    $$("#arrowsCompass button").forEach((button) => button.classList.toggle("active", card.arrows?.includes(button.dataset.dir)));
    $("#cardEditorTitle").textContent = `${card.nameKey} · ${card.id}`;
    const deleteButton = $("#cardEditorDelete");
    deleteButton.style.display = isHero(card) ? "none" : "";
    deleteButton.textContent = isDerivative(card.id) ? "删除衍生卡" : "删除主卡";
    pendingArtworkVariants = structuredClone(dataset.artworkVariants?.[card.id] || []);
    pendingSelectedArtworkId = dataset.selectedArtworkIds?.[card.id] || pendingArtworkVariants[0]?.id || null;
    pendingArtworkKey = card.artworkKey || "";
    renderArtworkVariantList();
  }

  function renderArtworkVariantList() {
    const list = $("#artworkVariantList");
    const variants = pendingArtworkVariants || [];
    list.replaceChildren();
    $("#artworkVariantSummary").textContent = variants.length
      ? `${variants.length} 张 · 已选 ${pendingSelectedArtworkId || "无"}`
      : "暂无插画";
    if (!variants.length) {
      const empty = document.createElement("div");
      empty.className = "artwork-variant-empty";
      empty.textContent = "仍使用占位画面；添加或批量生成的插画会显示在这里。";
      list.append(empty);
      return;
    }
    for (const variant of variants) {
      const item = document.createElement("div");
      item.className = `artwork-variant${(Array.isArray(pendingSelectedArtworkId) ? pendingSelectedArtworkId.includes(variant.id) : variant.id === pendingSelectedArtworkId) ? " is-selected" : ""}`;
      const select = document.createElement("button");
      select.type = "button";
      select.className = "artwork-variant-select";
      select.dataset.variantId = variant.id;
      select.setAttribute("aria-label", `选择插画 ${variant.id}`);
      const image = document.createElement("img");
      image.src = variant.src;
      image.alt = `${cardById(currentId)?.nameKey || currentId} 插画 ${variant.id}`;
      const label = document.createElement("span");
      label.className = "artwork-variant-label";
      label.textContent = variant.id;
      select.append(image, label);
      item.append(select);
      if ((Array.isArray(pendingSelectedArtworkId) ? pendingSelectedArtworkId.includes(variant.id) : variant.id === pendingSelectedArtworkId)) {
        const badge = document.createElement("span");
        badge.className = "artwork-variant-badge";
        badge.textContent = "正式";
        item.append(badge);
      }
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "artwork-variant-delete";
      remove.dataset.deleteVariantId = variant.id;
      remove.setAttribute("aria-label", `删除插画 ${variant.id}`);
      remove.textContent = "×";
      item.append(remove);
      list.append(item);
    }
  }

  function nextArtworkVariantId(artworkKey) {
    const used = new Set((pendingArtworkVariants || []).map((variant) => variant.id));
    let order = 1;
    while (used.has(`${artworkKey}-${String(order).padStart(2, "0")}`)) order += 1;
    return `${artworkKey}-${String(order).padStart(2, "0")}`;
  }

  function renderDraft() {
    renderArtworkVariantList();
    renderHand(readForm());
  }

  function renderHand(card) {
    const host = $("#cardHandPreview");
    host.replaceChildren(createCardRender(card, "hand"));
  }

  function renderDerivativeRail() {
    const rail = $("#derivativeRail");
    const root = cardById(parentId(currentId));
    const related = [root, ...derivativesOf(currentId)].filter(Boolean);
    rail.replaceChildren();
    for (const card of related) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `derivative-card-button${card.id === currentId ? " active" : ""}`;
      button.dataset.cardId = card.id;
      button.append(createCardRender(card, "board"));
      const label = document.createElement("span");
      label.textContent = isDerivative(card.id) ? card.id.split("-").at(-1) : "主卡";
      button.append(label);
      rail.append(button);
    }
  }

  function showCard(id) {
    const card = cardById(id);
    if (!card) return;
    currentId = id;
    fillForm(card);
    renderHand(card);
    renderDerivativeRail();
    setStatus(projectSyncAvailable ? "本地项目模式" : "浏览器本地编辑", "");
  }

  function openEditor(id) {
    $("#cardEditorOverlay").style.display = "flex";
    document.body.style.overflow = "hidden";
    showCard(id);
  }

  function closeEditor() {
    $("#cardEditorOverlay").style.display = "none";
    document.body.style.overflow = "";
    currentId = null;
  }

  function renamePendingArtwork(oldKey, newKey) {
    const selectedBefore = pendingSelectedArtworkId;
    const idMapping = {};
    pendingArtworkVariants = (pendingArtworkVariants || []).map((variant, index) => {
      const order = variant.id.match(/(?:-A|-)(\d{2})$/)?.[1] || String(index + 1).padStart(2, "0");
      const id = `${newKey}-${order}`;
      idMapping[variant.id] = id;
      let src = variant.src;
      if (!src.startsWith("data:")) {
        const extension = src.match(/(\.[a-z0-9]+)(?:[?#].*)?$/i)?.[1] || ".png";
        src = `./assets/card-art/${newKey}/${id}${extension.toLowerCase()}`;
      }
      return { ...variant, id, src };
    });
    pendingSelectedArtworkId = designContract.mapSelection(selectedBefore, idMapping) ?? null;
    pendingArtworkKey = newKey;
    return oldKey && oldKey !== newKey && pendingArtworkVariants.some((variant) => !variant.src.startsWith("data:"))
      ? { oldKey, newKey }
      : null;
  }

  function readForm() {
    const form = $("#cardEditorForm");
    const original = cardById(currentId);
    const number = (name) => Number(form.elements.namedItem(name).value || 0);
    const cardType = form.elements.namedItem("cardType").value;
    const card = {
      ...original,
      nameKey: form.elements.namedItem("nameKey").value.trim(),
      englishName: form.elements.namedItem("englishName").value.trim(),
      cardType,
      rarity: form.elements.namedItem("rarity").value,
      classId: form.elements.namedItem("classId").value,
      collectable: form.elements.namedItem("collectable").value === "true",
      costAmount: number("costAmount"),
      arrows: $$("#arrowsCompass button.active").map((button) => button.dataset.dir),
      rulesText: form.elements.namedItem("rulesText").value.trim(),
      artDescription: form.elements.namedItem("artDescription").value.trim(),
      artDescriptionNeedsPolish: form.elements.namedItem("artDescriptionNeedsPolish").checked,
      artRequest: Math.max(0, Math.trunc(number("artRequest"))),
      artworkKey: pendingArtworkKey,
    };
    if (cardType === "Minion") {
      card.attack = number("attack");
      card.health = number("health");
      card.movement = number("movement");
      card.tribes = $$("#tribeSelector button.active").map((button) => button.dataset.tribe);
    } else {
      delete card.attack;
      delete card.health;
      delete card.movement;
      delete card.tribes;
    }
    card.collectionKind = designContract.collectionFor(card);
    return card;
  }

  async function saveCard() {
    const original = cardById(currentId);
    const originalGroup = { classId: original.classId, collectable: Boolean(original.collectable) };
    const updated = readForm();
    if (!updated.nameKey) {
      setStatus("请填写中文名", "error");
      return;
    }
    const hasArtwork = Boolean(pendingArtworkVariants?.length);
    const oldArtworkKey = original.artworkKey
      || pendingArtworkKey
      || pendingArtworkVariants?.find((variant) => !variant.src.startsWith("data:"))?.src.match(/^\.\/assets\/card-art\/([^/]+)\//)?.[1]
      || "";
    const newArtworkKey = artworkKeyFromEnglishName(updated.englishName);
    let artworkRename = null;
    if (hasArtwork && !newArtworkKey) {
      setStatus("已有插画的卡牌必须保留英文名", "error");
      return;
    }
    if (newArtworkKey && newArtworkKey !== oldArtworkKey) {
      const conflict = artworkKeyConflict(newArtworkKey, currentId);
      if (conflict) {
        setStatus(`英文名与 ${conflict.id}「${conflict.nameKey}」冲突`, "error");
        return;
      }
      const hasPhysicalArtwork = pendingArtworkVariants?.some((variant) => !variant.src.startsWith("data:"));
      if (hasPhysicalArtwork && !projectSyncAvailable) {
        setStatus("请通过本地编辑服务修改已有插画卡牌的英文名", "error");
        return;
      }
      if (hasArtwork) artworkRename = renamePendingArtwork(oldArtworkKey, newArtworkKey);
      else pendingArtworkKey = newArtworkKey;
      updated.artworkKey = newArtworkKey;
    }
    if (isDerivative(updated.id)) {
      const parent = cardById(parentId(updated.id));
      updated.classId = parent?.classId || original.classId;
      updated.collectable = false;
    }
    if (!confirmBrowserDraftOverwrite()) return;
    dataset.cards[dataset.cards.findIndex((card) => card.id === currentId)] = updated;
    dataset.artworkVariants ||= {};
    dataset.selectedArtworkIds ||= {};
    if (pendingArtworkVariants?.length) {
      dataset.artworkVariants[currentId] = structuredClone(pendingArtworkVariants);
      dataset.selectedArtworkIds[currentId] = pendingSelectedArtworkId || pendingArtworkVariants[0].id;
    } else {
      delete dataset.artworkVariants[currentId];
      delete dataset.selectedArtworkIds[currentId];
    }
    if (!isDerivative(updated.id) && (updated.classId !== originalGroup.classId || Boolean(updated.collectable) !== originalGroup.collectable)) {
      for (const derivative of derivativesOf(updated.id)) {
        derivative.classId = updated.classId;
        derivative.collectable = false;
      }
      const temporaryId = `MOVE-${Date.now()}`;
      remapCardIds({ [updated.id]: temporaryId });
      renumberRootOrder(rootsInGroup(originalGroup.classId, originalGroup.collectable));
      const moved = cardById(currentId);
      const destination = rootsInGroup(updated.classId, updated.collectable).filter((card) => card !== moved);
      renumberRootOrder([...destination, moved]);
    }
    const saved = await persist({ artworkRename, operation: { type: "edit", uid: updated.uid } });
    if (!saved) return;
    renderGallery();
    showCard(currentId);
    setStatus("已保存并重新渲染", "saved");
  }

  function addDerivative() {
    if (!confirmBrowserDraftOverwrite()) return;
    const rootId = parentId(currentId);
    const root = cardById(rootId);
    if (!root) return;
    const used = new Set(derivativesOf(rootId).map((card) => Number(card.id.split("-").at(-1))));
    let order = 1;
    while (used.has(order)) order += 1;
    const id = `${rootId}-${String(order).padStart(2, "0")}`;
    const derivative = {
      ...structuredClone(root),
      id,
      nameKey: `${root.nameKey}·新衍生卡`,
      englishName: "",
      collectable: false,
      tags: (root.tags || []).filter((tag) => tag !== "InitialHero"),
      artDescription: "",
      artDescriptionNeedsPolish: true,
      artRequest: 1,
    };
    designContract.assignNewIdentity(derivative, root.uid);
    derivative.artworkKey = "";
    derivative.artPath = "";
    dataset.cards.push(derivative);
    persist({ operation: { type: "create", uid: derivative.uid } });
    showCard(id);
  }

  async function deleteCurrentCard() {
    const card = cardById(currentId);
    if (!card || isHero(card)) return;
    const derivative = isDerivative(card.id);
    const rootId = parentId(card.id);
    const deletedIds = derivative ? [card.id] : [card.id, ...derivativesOf(card.id).map((entry) => entry.id)];
    const deletedCards = dataset.cards.filter((entry) => deletedIds.includes(entry.id));
    const artworkDeletes = [...new Set([
      ...deletedCards.map((entry) => entry.artworkKey),
      ...deletedIds.flatMap((id) => (dataset.artworkVariants?.[id] || [])
        .map((variant) => variant.src.match(/^\.\/assets\/card-art\/([^/]+)\//)?.[1])),
    ].filter(Boolean))];
    if (projectSyncAvailable && artworkDeletes.length && !artworkDeleteAvailable) {
      setStatus("本地服务版本过旧，请重启服务后再删除带卡图的卡牌", "error");
      return;
    }
    const artworkDetail = artworkDeletes.length
      ? projectSyncAvailable
        ? `\n同时会永久删除 ${artworkDeletes.length} 个卡图包：\n${artworkDeletes.join("\n")}`
        : "\n当前为浏览器草稿模式，不会删除仓库中的实体卡图包。"
      : "";
    const detail = derivative
      ? `确定删除衍生卡「${card.nameKey}」(${card.id})？${artworkDetail}`
      : `确定删除主卡「${card.nameKey}」(${card.id})？${deletedIds.length > 1 ? `\n同时会删除 ${deletedIds.length - 1} 张衍生卡。` : ""}${artworkDetail}`;
    if (!window.confirm(detail)) return;
    if (!confirmBrowserDraftOverwrite()) return;
    dataset.cards = dataset.cards.filter((entry) => !deletedIds.includes(entry.id));
    for (const id of deletedIds) {
      delete dataset.artworkVariants[id];
      delete dataset.selectedArtworkIds[id];
    }
    if (!derivative) renumberRootOrder(rootsInGroup(card.classId, card.collectable));
    const saved = await persist({ artworkDeletes: projectSyncAvailable ? artworkDeletes : [], operation: { type: "delete", uid: card.uid } });
    if (!saved) return;
    renderGallery();
    if (derivative) showCard(rootId);
    else closeEditor();
  }

  function downloadJson(value, filename) {
    const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function exportJson() {
    const recovery = localStorage.getItem(RECOVERY_KEY);
    if (recovery && window.confirm("存在上次未同步草稿。确定：导出该草稿；取消：导出当前卡牌。")) {
      downloadJson(JSON.parse(recovery).dataset, "unsynced-cards.json");
    } else downloadJson(dataset, "cards.json");
  }

  function compressArtwork(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 1600;
        const context = canvas.getContext("2d");
        const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
        URL.revokeObjectURL(image.src);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      image.onerror = reject;
      image.src = URL.createObjectURL(file);
    });
  }

  function syncCardTypeFields() {
    const form = $("#cardEditorForm");
    const isSpell = form.elements.namedItem("cardType").value !== "Minion";
    form.classList.toggle("is-spell", isSpell);
    $$(".card-unit-only input, .card-unit-only button", form).forEach((control) => {
      control.disabled = isSpell;
    });
  }

  function populateFactionInputs() {
    const filter = $("#cardFactionFilter");
    const formSelect = $("#formFaction");
    for (const [value, faction] of Object.entries(FACTIONS)) {
      filter.add(new Option(faction.label, value));
      formSelect.add(new Option(faction.label, value));
    }
  }

  function populateTribeInputs() {
    const selector = $("#tribeSelector");
    selector.replaceChildren();
    for (const tribe of TRIBES) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.tribe = tribe;
      button.textContent = tribe;
      button.setAttribute("aria-pressed", "false");
      selector.append(button);
    }
  }

  function bindEvents() {
    $("#collectabilityToggle").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-collectable]");
      if (!button) return;
      collectableView = button.dataset.collectable === "true";
      $$("#collectabilityToggle button").forEach((node) => node.classList.toggle("active", node === button));
      renderGallery();
    });
    ["#cardSearch", "#cardFactionFilter", "#cardTypeFilter", "#cardViewSort"].forEach((selector) => {
      $(selector).addEventListener(selector === "#cardSearch" ? "input" : "change", renderGallery);
    });
    $("#cardCenterGrid").addEventListener("click", (event) => {
      if (suppressCardClick) return;
      const tile = event.target.closest("[data-card-id]");
      if (tile) openEditor(tile.dataset.cardId);
    });
    $("#cardCenterGrid").addEventListener("dragstart", (event) => {
      const tile = event.target.closest("[data-card-id]");
      if (!tile || tile.draggable === false) return;
      draggingCardId = tile.dataset.cardId;
      tile.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggingCardId);
    });
    $("#cardCenterGrid").addEventListener("dragover", (event) => {
      const tile = event.target.closest("[data-card-id]");
      const dragged = cardById(draggingCardId);
      const target = cardById(tile?.dataset.cardId);
      if ($("#cardViewSort").value !== "id" || !tile || !dragged || !target || dragged === target || !sameCardGroup(dragged, target) || isHero(target)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const bounds = tile.getBoundingClientRect();
      draggingInsertSide = event.clientX < bounds.left + bounds.width / 2 ? "before" : "after";
      $$(".formal-card-tile.is-drop-before, .formal-card-tile.is-drop-after").forEach((entry) => entry.classList.remove("is-drop-before", "is-drop-after"));
      tile.classList.add(draggingInsertSide === "before" ? "is-drop-before" : "is-drop-after");
    });
    $("#cardCenterGrid").addEventListener("drop", (event) => {
      const tile = event.target.closest("[data-card-id]");
      event.preventDefault();
      const changed = tile && moveMainCardToPosition(draggingCardId, tile.dataset.cardId, draggingInsertSide);
      suppressCardClick = Boolean(changed);
      setTimeout(() => { suppressCardClick = false; }, 0);
    });
    $("#cardCenterGrid").addEventListener("dragend", () => {
      draggingCardId = null;
      draggingInsertSide = "before";
      $$(".formal-card-tile.is-dragging, .formal-card-tile.is-drop-before, .formal-card-tile.is-drop-after").forEach((entry) => entry.classList.remove("is-dragging", "is-drop-before", "is-drop-after"));
    });
    $("#derivativeRail").addEventListener("click", (event) => {
      const tile = event.target.closest("[data-card-id]");
      if (tile) showCard(tile.dataset.cardId);
    });
    $("#arrowsCompass").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-dir]");
      if (button) button.classList.toggle("active");
    });
    $("#tribeSelector").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-tribe]");
      if (!button) return;
      button.classList.toggle("active");
      button.setAttribute("aria-pressed", String(button.classList.contains("active")));
      setStatus("种族选择待保存");
    });
    $("#cardEditorForm").elements.namedItem("cardType").addEventListener("change", () => {
      syncCardTypeFields();
      renderDraft();
      setStatus("卡牌类型待保存");
    });
    $("#cardEditorSave").addEventListener("click", saveCard);
    $("#cardEditorDelete").addEventListener("click", deleteCurrentCard);
    $("#derivativeAddBtn").addEventListener("click", addDerivative);
    $("#cardEditorClose").addEventListener("click", closeEditor);
    $("#cardEditorCancel").addEventListener("click", closeEditor);
    $("#cardExportJsonBtn").addEventListener("click", exportJson);
    $("#cardCreateBtn").addEventListener("click", addMainCard);
    $("#cardArtUpload").addEventListener("change", async (event) => {
      const files = [...event.target.files];
      if (!files.length) return;
      const draft = readForm();
      const artworkKey = pendingArtworkKey || artworkKeyFromEnglishName(draft.englishName);
      if (!artworkKey) {
        setStatus("请先填写英文名，再添加插画", "error");
        event.target.value = "";
        return;
      }
      const conflict = artworkKeyConflict(artworkKey, currentId);
      if (conflict) {
        setStatus(`英文名与 ${conflict.id}「${conflict.nameKey}」冲突`, "error");
        event.target.value = "";
        return;
      }
      pendingArtworkKey = artworkKey;
      setStatus(`正在处理 ${files.length} 张图像…`);
      try {
        for (const file of files) {
          const src = await compressArtwork(file);
          const id = nextArtworkVariantId(artworkKey);
          pendingArtworkVariants.push({ id, src });
          pendingSelectedArtworkId = id;
        }
        const requestField = $("#cardEditorForm").elements.namedItem("artRequest");
        requestField.value = Math.max(0, Math.trunc(Number(requestField.value) || 0) - files.length);
        renderDraft();
        setStatus("新插画待保存");
      } catch (error) {
        console.error(error);
        setStatus("图像处理失败", "error");
      } finally {
        event.target.value = "";
      }
    });
    $("#artworkVariantList").addEventListener("click", (event) => {
      const remove = event.target.closest("[data-delete-variant-id]");
      if (remove) {
        const id = remove.dataset.deleteVariantId;
        pendingArtworkVariants = pendingArtworkVariants.filter((variant) => variant.id !== id);
        if (Array.isArray(pendingSelectedArtworkId)) pendingSelectedArtworkId = pendingSelectedArtworkId.filter((value) => value !== id);
        else if (pendingSelectedArtworkId === id) pendingSelectedArtworkId = pendingArtworkVariants[0]?.id || null;
        renderDraft();
        setStatus("删除待保存");
        return;
      }
      const select = event.target.closest("[data-variant-id]");
      if (select) {
        pendingSelectedArtworkId = select.dataset.variantId;
        renderDraft();
        setStatus("正式插画选择待保存");
      }
    });
    $("#cardEditorOverlay").addEventListener("click", (event) => {
      if (event.target === event.currentTarget) closeEditor();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && $("#cardEditorOverlay").style.display !== "none") closeEditor();
    });
  }

  async function loadJson(url, fallbackValue) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) return response.json();
    } catch (error) {
      if (!fallbackValue) throw error;
    }
    if (fallbackValue) return structuredClone(fallbackValue);
    throw new Error(`无法加载 ${url}`);
  }

  async function initialize() {
    if (initialized) return;
    initialized = true;
    const fallback = window.__CARD_EDITOR_FALLBACK__ || {};
    const isDirectFile = window.location.protocol === "file:";
    let [loadedLayout, baseDataset] = isDirectFile
      ? [structuredClone(fallback.layout), structuredClone(fallback.cards)]
      : await Promise.all([
          loadJson("./card_layout_ref/layout.json", fallback.layout),
          loadJson("./data/cards.json", fallback.cards),
        ]);
    if (!loadedLayout || !baseDataset) {
      throw new Error("本地卡牌数据未生成，请重新运行卡牌数据构建脚本");
    }
    layout = loadedLayout;
    projectSyncAvailable = await detectProjectSync();
    if (projectSyncAvailable) {
      const response = await fetch("./api/cards/state", { cache: "no-store" });
      if (!response.ok) throw new Error("无法读取卡牌版本，请重启本地编辑服务");
      const state = await response.json();
      baseDataset = state.dataset;
      projectCardsRevision = state.cardsRevision;
      projectConfirmedDataset = structuredClone(state.dataset);
    }
    baseDatasetLabel = projectSyncAvailable ? "项目 JSON" : "仓库 JSON";
    const localDataset = readLocalState(baseDataset);
    const browserDraftDiffers = localDataset && JSON.stringify(localDataset) !== JSON.stringify(baseDataset);
    let importBrowserDraft = false;
    if (!isDirectFile) {
      if (browserDraftDiffers) {
        importBrowserDraft = window.confirm(
          `检测到浏览器本地草稿与${baseDatasetLabel}的内容不同。请选择本次要加载的数据：\n\n`
          + "点击“确定”：加载本地草稿并继续自动保存。\n"
          + `点击“取消”：加载${baseDatasetLabel}；第一次保存前会再次提醒覆盖风险。`,
        );
      }
      dataset = structuredClone(importBrowserDraft ? localDataset : baseDataset);
      browserDraftOverwriteWarningPending = Boolean(browserDraftDiffers && !importBrowserDraft);
    } else if (isDirectFile) {
      dataset = loadLocalState(baseDataset);
    }
    const normalized = normalizeDatasetForCurrentRules(baseDataset);
    populateFactionInputs();
    populateTribeInputs();
    bindEvents();
    renderGallery();
    const shouldPersistInitialization = importBrowserDraft
      || (normalized && (isDirectFile || (projectSyncAvailable && !browserDraftOverwriteWarningPending)));
    if (shouldPersistInitialization) await persist({ operation: { type: "import" } });
    else if (browserDraftOverwriteWarningPending) setStatus(`已加载${baseDatasetLabel}；保存前将提醒覆盖本地草稿`, "saved");
    else if (projectSyncAvailable) setStatus("已连接本地项目", "saved");
    else if (isDirectFile) setStatus("浏览器本地模式", "saved");
    else setStatus("已加载仓库 JSON", "saved");
    if (localStorage.getItem(RECOVERY_KEY)) setStatus("存在未同步恢复草稿，可用“导出 JSON”另存；当前加载的是项目数据", "error");
  }

  window.initFormalCardEditor = () => initialize().catch((error) => {
    console.error(error);
    const grid = $("#cardCenterGrid");
    if (grid) grid.innerHTML = `<p class="card-editor-error">${escapeHtml(error.message)}</p>`;
  });
})();
