/* Read-only, in-page creature archive. Canonical records live in bestiary-data.js. */
(() => {
  "use strict";
  const root = document.getElementById("creatureArchive");
  if (!root) return;
  const bestiaryRecords = window.TBH_BESTIARY_RECORDS;
  const isEnglish = document.body.dataset.language === "en";
  if (!Array.isArray(bestiaryRecords) || !bestiaryRecords.length) {
    root.textContent = isEnglish ? "The creature archive could not be loaded." : "生物档案暂时无法加载。";
    return;
  }
const copy = {
  all: isEnglish ? "All records" : "全部档案",
  wildlife: isEnglish ? "Natural wildlife" : "自然奇兽",
  synthetic: isEnglish ? "Synthetic lineages" : "人工机体谱系",
  sapient: isEnglish ? "Sapient umbrellas" : "智慧总类",
  cosmic: isEnglish ? "Cosmic projections" : "宇宙投影",
  anomaly: isEnglish ? "Causal anomalies" : "因果异常",
  confirmed: isEnglish ? "Confirmed species" : "已确认物种",
  standardized: isEnglish ? "Standardized chassis lineage" : "标准机体谱系",
  provisional: isEnglish ? "Candidate selection pending" : "候选方案待选",
  umbrella: isEnglish ? "Umbrella taxonomy" : "总类待拆分",
  boundary: isEnglish ? "Boundary record" : "边界档案",
  recordCount: (count) => isEnglish ? `${count} records found` : `检索到 ${count} 份档案`,
  noRecords: isEnglish ? "No matching records." : "没有符合条件的档案。",
  classification: isEnglish ? "Classification" : "档案分类",
  habitat: isEnglish ? "Known habitat" : "已知栖息地",
  diet: isEnglish ? "Energy / diet" : "能量与食性",
  activity: isEnglish ? "Activity" : "活动模式",
  ecology: isEnglish ? "Ecology and behavior" : "生态与生活习性",
  relations: isEnglish ? "Relationship with civilization" : "与文明的关系",
  traits: isEnglish ? "Recognition traits" : "识别特征",
  knownForms: isEnglish ? "Known manifestations and forms" : "已知形态与显化",
  knownFormsNote: isEnglish
    ? "These are operational records, not a claim that the umbrella class shares one anatomy or evolutionary lineage."
    : "以下为可操作的观测档案，不代表该总类共享统一解剖或自然演化谱系。",
  fieldProtocol: isEnglish ? "Encounter protocol" : "现场处置协议",
  fieldProtocolNote: isEnglish
    ? "Provisional guidance for surviving observation teams; event-specific orders take precedence."
    : "供观测与处置人员使用的暂行原则；具体事件命令具有更高优先级。",
  artArchive: isEnglish ? "Visual archive" : "视觉档案",
  artArchiveNote: isEnglish
    ? "Illustrations record behavior in context; concept sheets lock anatomy, material, scale, and life-stage continuity."
    : "插画记录环境中的真实行为；概念图用于锁定解剖、材质、尺度与年龄连续性。",
  illustration: isEnglish ? "Ecology illustration" : "生态叙事插画",
  concept: isEnglish ? "Species concept sheet" : "物种概念图",
  portrait: isEnglish ? "Portrait archive" : "竖幅档案",
  sheet: isEnglish ? "Artbook sheet" : "设定板",
  pendingTitle: isEnglish ? "Concept generation deferred" : "概念图暂缓生成",
  pendingDefault: isEnglish
    ? "This record covers multiple body plans. Define a concrete subtype before creating a canonical concept sheet."
    : "该档案涵盖多种形体，需要先确定具体子类，再制作具有约束力的概念图。",
  knownSpecimens: isEnglish ? "Known specimens and prior artwork" : "已知个体与既有插画",
  viewImage: isEnglish ? "Open full image" : "查看原图"
};
  const filters = ["all", "wildlife", "synthetic", "sapient", "cosmic", "anomaly"];
  function text(record, zhKey, enKey) { return record[isEnglish ? enKey : zhKey] || ""; }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])); }
  function searchableText(value) {
    if (Array.isArray(value)) return value.map(searchableText).join(" ");
    if (value && typeof value === "object") return Object.values(value).map(searchableText).join(" ");
    return typeof value === "string" ? value.toLocaleLowerCase() : "";
  }
  const searchIndex = new Map(bestiaryRecords.map(record => [record.id, searchableText(record)]));
  root.classList.add("creature-archive");
  root.innerHTML = `<div class="creature-toolbar"><div><span class="creature-kicker">COSMIC BESTIARY</span><p id="creatureResultCount" aria-live="polite"></p></div><label class="creature-search"><span>${isEnglish ? "Search the archive" : "检索生物档案"}</span><input id="creatureSearch" type="search" placeholder="${isEnglish ? "Name, habitat or trait…" : "名称、栖息地或特征…"}" autocomplete="off"></label></div><div id="creatureFilters" class="creature-filters" role="group" aria-label="${isEnglish ? "Creature classification" : "生物分类"}"></div><div class="creature-columns"><nav id="creatureList" class="creature-index" aria-label="${isEnglish ? "Creature records" : "生物档案索引"}"></nav><article id="creatureDetail" class="creature-detail" aria-live="polite" tabindex="-1"></article></div>`;
  const listEl = root.querySelector("#creatureList");
  const detailEl = root.querySelector("#creatureDetail");
  const filterEl = root.querySelector("#creatureFilters");
  const searchEl = root.querySelector("#creatureSearch");
  const countEl = root.querySelector("#creatureResultCount");
  let activeFilter = "all";
  const initialId = new URLSearchParams(location.search).get("creature");
  let activeRecord = bestiaryRecords.find(record => record.id === initialId) || bestiaryRecords[0];
  const lightbox = document.createElement("dialog");
  lightbox.className = "creature-lightbox";
  lightbox.setAttribute("aria-label", isEnglish ? "Full image preview" : "原图预览");
  lightbox.innerHTML = `<div class="creature-lightbox-bar"><p></p><a target="_blank" rel="noopener noreferrer">${isEnglish ? "Open original ↗" : "打开原图 ↗"}</a><button type="button" aria-label="${isEnglish ? "Close image preview" : "关闭图片预览"}">×</button></div><img alt="">`;
  document.body.append(lightbox);
  let lightboxTrigger = null;
  let previousOverflow = "";
  function visibleRecords() {
    const query = searchEl.value.trim().toLocaleLowerCase();
    return bestiaryRecords.filter(record => (activeFilter === "all" || record.group === activeFilter) && (!query || searchIndex.get(record.id).includes(query)));
  }
  function statusLabel(record) { return copy[record.status] || record.status; }
  function renderFilters() {
    filterEl.innerHTML = filters.map(filter => `<button type="button" data-filter="${filter}" aria-pressed="${activeFilter === filter}">${escapeHtml(copy[filter])}</button>`).join("");
  }
  function renderList() {
    const records = visibleRecords();
    countEl.textContent = copy.recordCount(records.length);
    if (!records.some(record => record.id === activeRecord.id) && records.length) activeRecord = records[0];
    if (!records.length) {
      listEl.innerHTML = `<p class="creature-empty">${escapeHtml(copy.noRecords)}</p>`;
      detailEl.innerHTML = `<p class="creature-empty">${isEnglish ? "Try a different keyword or classification." : "尝试其他关键词或分类。"}</p>`;
      return;
    }
    listEl.innerHTML = records.map(record => `<button type="button" class="creature-index-item" data-record="${escapeHtml(record.id)}" aria-pressed="${record.id === activeRecord.id}"><img src="${escapeHtml(record.illustration)}" alt="" loading="lazy"><span><small>${String(bestiaryRecords.indexOf(record) + 1).padStart(2,"0")} / ${escapeHtml(copy[record.group])}</small><strong>${escapeHtml(text(record,"zhName","enName"))}</strong><em>${escapeHtml(text(record,"zhSubtitle","enSubtitle"))}</em></span></button>`).join("");
    renderDetail();
  }
function imageButton(src, label, kind, extraClass = "") {
  return `
    <button class="bestiary-art-button ${extraClass}" data-lightbox-src="${escapeHtml(src)}" data-lightbox-label="${escapeHtml(label)}" type="button" aria-label="${escapeHtml(`${copy.viewImage}: ${label}`)}">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(label)}" loading="lazy" />
      <span class="bestiary-art-caption"><span>${escapeHtml(label)}</span><small>${escapeHtml(kind)}</small></span>
    </button>`;
}

function renderDetail() {
  const record = activeRecord;
  const name = text(record, "zhName", "enName");
  const secondaryName = isEnglish ? record.zhName : record.enName;
  const traits = isEnglish ? record.enTraits : record.zhTraits;
  const tags = isEnglish ? record.tagsEn : record.tagsZh;
  const specimens = record.specimens || [];
  const knownForms = record.knownForms || [];
  const knownFormsNote = text(record, "zhKnownFormsNote", "enKnownFormsNote") || copy.knownFormsNote;
  const protocol = isEnglish ? (record.protocolEn || []) : (record.protocolZh || []);
  const conceptNote = text(record, "zhConceptNote", "enConceptNote") || copy.pendingDefault;
  
  detailEl.innerHTML = `
    <div class="bestiary-detail-hero">
      <img src="${escapeHtml(record.illustration)}" alt="${escapeHtml(`${name} ${copy.illustration}`)}" />
      <div class="bestiary-detail-title">
        <div class="bestiary-detail-meta">
          <span>${escapeHtml(statusLabel(record))}</span>
          <span>${escapeHtml(text(record, "zhClass", "enClass"))}</span>
        </div>
        <p class="bestiary-index-label">COSMIC LIFE / ${String(bestiaryRecords.indexOf(record) + 1).padStart(2, "0")}</p><h3>${escapeHtml(name)}</h3><p class="bestiary-subtitle">${escapeHtml(text(record, "zhSubtitle", "enSubtitle"))}</p>
        <div class="english-name">${escapeHtml(secondaryName)}</div>
        <p class="summary">${escapeHtml(text(record, "zhSummary", "enSummary"))}</p>
      </div>
    </div>
    <div class="bestiary-body">
      <div class="bestiary-facts">
        ${[
          [copy.classification, text(record, "zhClass", "enClass")],
          [copy.habitat, text(record, "zhHabitat", "enHabitat")],
          [copy.diet, text(record, "zhDiet", "enDiet")],
          [copy.activity, text(record, "zhActivity", "enActivity")]
        ].map(([label, value]) => `<div class="bestiary-fact"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
      </div>
      <div class="bestiary-copy-grid">
        <section class="bestiary-copy-section">
          <span>FIELD NOTE 01</span>
          <h4>${escapeHtml(copy.ecology)}</h4>
          <p>${escapeHtml(text(record, "zhEcology", "enEcology"))}</p>
        </section>
        <section class="bestiary-copy-section">
          <span>FIELD NOTE 02</span>
          <h4>${escapeHtml(copy.relations)}</h4>
          <p>${escapeHtml(text(record, "zhRelations", "enRelations"))}</p>
        </section>
      </div>
      <section class="bestiary-copy-section">
        <span>MORPHOLOGY</span>
        <h4>${escapeHtml(copy.traits)}</h4>
        <ul class="bestiary-traits">${traits.map((trait) => `<li>${escapeHtml(trait)}</li>`).join("")}</ul>
      </section>
      ${knownForms.length ? `
        <section class="bestiary-form-section">
          <div class="bestiary-art-header">
            <div><span>KNOWN FORMS</span><h4>${escapeHtml(copy.knownForms)}</h4></div>
            <p>${escapeHtml(knownFormsNote)}</p>
          </div>
          <div class="bestiary-form-grid">
            ${knownForms.map((form, index) => `
              <article class="bestiary-form-card">
                ${form.concept ? `
                  <button class="bestiary-form-concept" data-lightbox-src="${escapeHtml(form.concept)}" data-lightbox-label="${escapeHtml(`${text(form, "zhName", "enName")} · ${copy.concept}`)}" type="button" aria-label="${escapeHtml(`${copy.viewImage}: ${text(form, "zhName", "enName")} · ${copy.concept}`)}">
                    <img src="${escapeHtml(form.concept)}" alt="${escapeHtml(`${text(form, "zhName", "enName")} · ${copy.concept}`)}" loading="lazy" />
                    <span>${escapeHtml(copy.concept)}</span>
                  </button>` : ""}
                <div class="bestiary-form-copy">
                  <div class="bestiary-form-index">${String(index + 1).padStart(2, "0")}</div>
                  <small>${escapeHtml(text(form, "zhType", "enType"))}</small>
                  <h5>${escapeHtml(text(form, "zhName", "enName"))}</h5>
                  <p>${escapeHtml(text(form, "zhDescription", "enDescription"))}</p>
                </div>
              </article>`).join("")}
          </div>
        </section>` : ""}
      ${protocol.length ? `
        <section class="bestiary-protocol">
          <div class="bestiary-protocol-heading">
            <span>FIELD PROTOCOL</span>
            <h4>${escapeHtml(copy.fieldProtocol)}</h4>
            <p>${escapeHtml(copy.fieldProtocolNote)}</p>
          </div>
          <ol>${protocol.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
        </section>` : ""}
      <section class="bestiary-art-section">
        <div class="bestiary-art-header">
          <div><span>VISUAL RECORD</span><h4>${escapeHtml(copy.artArchive)}</h4></div>
          <p>${escapeHtml(copy.artArchiveNote)}</p>
        </div>
        <div class="bestiary-art-pair">
          ${imageButton(record.illustration, `${name} · ${copy.illustration}`, copy.portrait)}
          ${record.concept
            ? imageButton(record.concept, `${name} · ${copy.concept}`, copy.sheet, "is-concept")
            : `<div class="bestiary-concept-pending"><div><strong>${escapeHtml(copy.pendingTitle)}</strong><p>${escapeHtml(conceptNote)}</p></div></div>`}
        </div>
      </section>
      ${specimens.length ? `
        <section class="bestiary-art-section">
          <div class="bestiary-art-header"><div><span>SPECIMEN ARCHIVE</span><h4>${escapeHtml(copy.knownSpecimens)}</h4></div></div>
          <div class="bestiary-specimens">
            ${specimens.map((specimen) => {
              const label = isEnglish ? specimen.en : specimen.zh;
              if (specimen.src === "./assets/card-art/rampaging-puru-beast/rampaging-puru-beast-01.png") {
                // Existing missing file at the migration baseline; retain the canonical reference without requesting a known 404.
                return `<div class="bestiary-specimen"><span class="creature-missing-image">${isEnglish ? "Image unavailable · awaiting replacement" : "插画文件缺失 · 待补全"}</span><span>${escapeHtml(label)}</span></div>`;
              }
              return `<button class="bestiary-specimen" data-lightbox-src="${escapeHtml(specimen.src)}" data-lightbox-label="${escapeHtml(label)}" type="button"><img src="${escapeHtml(specimen.src)}" alt="${escapeHtml(label)}" loading="lazy" /><span>${escapeHtml(label)}</span></button>`;
            }).join("")}
          </div>
        </section>` : ""}
      <section class="bestiary-chibi"><span>CHIBI / BATTLE ASSET</span><h4>${isEnglish ? "Chibi / battle model" : "小人 / 战斗模型"}</h4><p>${isEnglish ? "Reserved asset slot · Incomplete" : "预留资产位置 · 未完成"}</p></section><div class="bestiary-tag-row">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    </div>`;
}
  function selectRecord(id) {
    const record = bestiaryRecords.find(item => item.id === id);
    if (!record) return;
    activeRecord = record;
    listEl.querySelectorAll("[data-record]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.record === id)));
    renderDetail();
    const url = new URL(location.href);
    url.searchParams.set("creature", id);
    url.hash = "bestiary";
    history.replaceState(null, "", url);
  }
  function openLightbox(button) {
    lightboxTrigger = button;
    const src = button.dataset.lightboxSrc;
    const label = button.dataset.lightboxLabel || "";
    const image = lightbox.querySelector("img");
    image.src = src;
    image.alt = label;
    lightbox.querySelector("p").textContent = label;
    lightbox.querySelector("a").href = src;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lightbox.showModal();
    lightbox.querySelector("button").focus();
  }
  lightbox.addEventListener("close", () => {
    lightbox.querySelector("img").removeAttribute("src");
    document.body.style.overflow = previousOverflow;
    lightboxTrigger?.focus({ preventScroll: true });
  });
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox || event.target.closest("button")) lightbox.close();
  });
  filterEl.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    renderFilters();
    renderList();
    filterEl.querySelector(`[data-filter="${activeFilter}"]`).focus({ preventScroll: true });
  });
  searchEl.addEventListener("input", renderList);
  listEl.addEventListener("click", event => {
    const button = event.target.closest("[data-record]");
    if (button) selectRecord(button.dataset.record);
  });
  detailEl.addEventListener("click", event => {
    const button = event.target.closest("[data-lightbox-src]");
    if (button) openLightbox(button);
  });
  window.addEventListener("popstate", () => {
    const id = new URLSearchParams(location.search).get("creature");
    const record = bestiaryRecords.find(item => item.id === id);
    if (record) { activeRecord = record; activeFilter = "all"; searchEl.value = ""; renderFilters(); renderList(); }
  });
  root.addEventListener("error", event => {
    if (!(event.target instanceof HTMLImageElement)) return;
    const image = event.target;
    const placeholder = document.createElement("span");
    placeholder.className = "creature-missing-image";
    placeholder.textContent = isEnglish ? "Image unavailable · awaiting replacement" : "插画文件缺失 · 待补全";
    const button = image.closest("[data-lightbox-src]");
    if (button) { button.disabled = true; button.removeAttribute("data-lightbox-src"); }
    image.replaceWith(placeholder);
  }, true);
  renderFilters();
  renderList();
})();
