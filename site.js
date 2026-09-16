/* Setting dossiers project current card designs; no gameplay or card writes live here. */
(async function () {
  "use strict";
  if (location.hash === "#card-editor") {
    location.replace("./card-editor.html");
    return;
  }
  if (location.hash.startsWith("#dev-")) {
    location.replace("./wiki.html");
    return;
  }
  const en = document.body.dataset.language === "en";
  const t = (zh, english) => (en ? english : zh);
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const imagePath = (value) =>
    typeof value === "string" &&
    /^(\.\/)?assets\/[a-zA-Z0-9_./ -]+\.(png|jpe?g|webp|svg)$/i.test(value) &&
    !value.includes("..")
      ? value
      : "";
  const data = structuredClone(window.__SETTING_DATA__);
  let currentReadFailed = false;
  if (location.protocol !== "file:") {
    try {
      const response = await fetch("./data/cards.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Card source: ${response.status}`);
      const cards = await response.json();
      for (const entry of data.characters) {
        if (!entry.sourceArtworkKeys.length) continue;
        const sources = entry.sourceArtworkKeys.map((key) => {
          const matches = cards.cards.filter((card) => card.artworkKey === key);
          if (matches.length !== 1) return null;
          const card = matches[0];
          if (
            entry.identityNameIncludes &&
            !card.nameKey.includes(entry.identityNameIncludes)
          )
            return null;
          const selectedId = cards.selectedArtworkIds?.[card.id];
          const art = (cards.artworkVariants?.[card.id] || []).find(
            (item) => item.id === selectedId,
          );
          if (selectedId && !art) return null;
          return {
            cardId: card.id,
            artworkKey: key,
            name: card.nameKey,
            englishName: card.englishName,
            classId: card.classId,
            artDescription: card.artDescription || "",
            rulesText: card.rulesText || "",
            cover: art?.src || null,
          };
        });
        if (
          sources.some((source) => !source) ||
          new Set(sources.map((source) => source?.classId)).size !== 1
        ) {
          Object.assign(entry, {
            sources: [],
            cover: null,
            artDescription: "",
            rulesText: "",
            appearanceSummary: null,
            needsReview: true,
          });
        } else {
          if (
            sources.some(
              (source, i) =>
                source.name !== entry.sources[i]?.name ||
                source.artDescription !== entry.sources[i]?.artDescription,
            )
          )
            entry.appearanceSummary = null;
          Object.assign(entry, sources[0], { sources });
          entry.faction =
            data.factions.find((faction) => faction.classId === entry.classId)
              ?.id || "neutral";
        }
      }
    } catch (error) {
      currentReadFailed = true;
      console.warn(
        "Current designs unavailable; displaying the generated snapshot.",
        error,
      );
    }
  }
  const englishDirections = {
    astra:
      "Dark red military industry, geometric armor and monumental machinery.",
    machine:
      "White and blue synthetic bodies, modular robotics and precise engineered forms.",
    solar:
      "White and orange vestments, solar reactors and radiant sacred industry.",
    skyraider:
      "Forest green, oxblood red, rebuilt machinery and practical frontier equipment.",
  };
  document.querySelector("#factionGrid").innerHTML = data.factions
    .map(
      (faction) =>
        `<article class="faction-card"><div class="faction-image"><img src="${escape(imagePath(faction.image))}" alt="${escape(t(faction.name, faction.englishName))}" loading="lazy"><div class="faction-heading"><span>${escape(faction.englishName.toUpperCase())}</span><h3>${escape(t(faction.name, faction.englishName))}</h3></div></div><div class="faction-body"><p>${escape(en ? englishDirections[faction.id] : faction.description)}</p><small>${t("视觉概念草案 · 职业设定未完成", "VISUAL CONCEPT · LORE INCOMPLETE")}</small></div></article>`,
    )
    .join("");
  const factionSelect = document.querySelector("#characterFaction");
  for (const faction of data.factions)
    factionSelect.add(
      new Option(t(faction.name, faction.englishName), faction.id),
    );
  factionSelect.add(
    new Option(t("中立 / 未归属", "Neutral / Unassigned"), "neutral"),
  );
  const search = document.querySelector("#characterSearch");
  const roster = document.querySelector("#characterRoster");
  const feature = document.querySelector("#characterFeature");
  const params = new URLSearchParams(location.search);
  let selected =
    data.characters.find((entry) => entry.id === params.get("character")) ||
    data.characters.find((entry) => entry.id === "vera") ||
    data.characters[0];
  let formIndex = 0;
  const displayName = (entry) =>
    en ? entry.englishName || entry.name : entry.name;

  function renderFeature() {
    if (!selected) return;
    const source = selected.sources[formIndex] || selected;
    const cover = imagePath(source.cover);
    const faction = data.factions.find((item) => item.id === selected.faction);
    const description =
      selected.appearanceSummary?.[en ? "en" : "zh"] ||
      t(
        "人物外形资料待整理；可展开查看当前卡牌的美术制作描述。",
        "Appearance summary is unfinished; expand the current card art brief below.",
      );
    feature.innerHTML = `<div class="character-portrait"><span class="portrait-index">${escape(selected.id.toUpperCase())} / ${String(data.characters.indexOf(selected) + 1).padStart(2, "0")}</span>${cover ? `<img src="${escape(cover)}" alt="${escape(displayName(source))}">` : `<div class="portrait-empty"><strong>—</strong><span>${t("人物原画未完成", "ARTWORK INCOMPLETE")}</span></div>`}<span class="portrait-credit">${cover ? t("当前卡牌选用插画", "CURRENT SELECTED CARD ART") : t("预留原画位置", "RESERVED ARTWORK SLOT")}</span></div><div class="character-copy"><p class="eyebrow">${escape(faction ? t(faction.name, faction.englishName) : t("中立 / 未归属", "NEUTRAL / UNASSIGNED"))} / ${t("人物档案", "CHARACTER DOSSIER")}</p><h3>${escape(displayName(source))}</h3><p class="character-english">${escape(en ? source.name : source.englishName || "")}</p><div class="character-appearance">${escape(description)}</div>${selected.sources.length ? `<details><summary>${t("查看卡牌设计来源", "View original card design")}</summary><p>${escape(source.cardId)} · ${escape(source.artworkKey)}<br>${escape(source.rulesText)}</p><p><strong>${t("美术制作描述", "Original artwork brief")}</strong><br>${escape(source.artDescription)}</p><p>${t("人物描述来源：当前卡牌的画面描述。尚不等同于完整人物传记。", "Description source: the current card artwork brief. A full biography is unfinished.")}</p></details>` : ""}${selected.sources.length > 1 ? `<div class="character-form-links" aria-label="${t("卡牌形态", "Card forms")}">${selected.sources.map((item, i) => `<button type="button" data-form="${i}" aria-pressed="${i === formIndex}">${escape(displayName(item))}</button>`).join("")}</div>` : ""}<p class="story-status">${selected.needsReview ? t("卡牌身份引用需要重新核对；暂不展示旧版描述与插画。", "Card identity mapping needs review; previous descriptions and artwork are withheld.") : t("人物传记未完成。", "Biography incomplete.")}${currentReadFailed ? t(" 当前展示已生成的设计快照。", " Displaying the generated design snapshot.") : ""}</p><div class="asset-slots"><div><span>${t("人物设定板", "CONCEPT SHEET")}</span><strong>${t("未完成", "Incomplete")}</strong></div><div><span>${t("补充插画", "ILLUSTRATIONS")}</span><strong>${t("预留位置", "Reserved")}</strong></div><div><span>${t("小人 / 战斗模型", "CHIBI / MODEL")}</span><strong>${t("未完成", "Incomplete")}</strong></div></div></div>`;
    feature.querySelectorAll("[data-form]").forEach((button) =>
      button.addEventListener("click", () => {
        formIndex = Number(button.dataset.form);
        renderFeature();
        feature
          .querySelector(`[data-form="${formIndex}"]`)
          .focus({ preventScroll: true });
      }),
    );
  }
  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    const entries = data.characters.filter(
      (entry) =>
        (factionSelect.value === "all" ||
          entry.faction === factionSelect.value) &&
        [
          entry.name,
          entry.englishName,
          ...entry.sources.flatMap((source) => [
            source.name,
            source.englishName,
          ]),
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(query),
    );
    if (!entries.includes(selected)) {
      selected = entries[0];
      formIndex = 0;
    }
    document.querySelector("#characterCount").textContent =
      `${String(entries.length).padStart(2, "0")} ${t("个人物档案", "DOSSIERS")}`;
    document.querySelector("#characterEmpty").hidden = entries.length > 0;
    feature.hidden = entries.length === 0;
    roster.innerHTML = entries
      .map(
        (entry) =>
          `<button class="roster-item" type="button" data-character="${escape(entry.id)}" aria-pressed="${entry === selected}">${imagePath(entry.cover) ? `<img src="${escape(imagePath(entry.cover))}" alt="" loading="lazy">` : `<span class="roster-placeholder" aria-hidden="true">${escape(entry.name.slice(0, 1))}</span>`}<span>${escape(displayName(entry))}</span></button>`,
      )
      .join("");
    roster.querySelectorAll("[data-character]").forEach((button) =>
      button.addEventListener("click", () => {
        selected = entries.find(
          (entry) => entry.id === button.dataset.character,
        );
        formIndex = 0;
        roster
          .querySelectorAll("button")
          .forEach((item) =>
            item.setAttribute("aria-pressed", String(item === button)),
          );
        const url = new URL(location.href);
        url.searchParams.set("character", selected.id);
        history.replaceState(null, "", url);
        renderFeature();
      }),
    );
    renderFeature();
  }
  search.addEventListener("input", render);
  factionSelect.addEventListener("change", render);
  render();
})();
