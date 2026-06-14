const categoryAccent = {
  trigger: "badge-domain",
  scope: "badge-event",
  effects: "badge-faction",
  aura: "badge-hero",
};

const categoryImplementation = {
  trigger: "实装时对应 Event Bus 的事件监听器。事件 payload 至少需要包含 source、owner、fromZone、toZone 与时间点。",
  scope: "实装时对应 Scope Resolver，先返回候选 CardID / GridID / PlayerID，再交给选择策略处理。",
  effects: "实装时对应 Effect Executor，每个基础效果应该是一条可记录、可回放的 command。",
  aura: "实装时需要定义生命周期、叠加规则与重新计算时机，避免持续效果残留。",
};

const highlightTerms = [
  "放置于场上",
  "时动阶段",
  "静域阶段",
  "回合开始",
  "回合结束",
  "弃牌堆",
  "额外牌组",
  "玩家",
  "卡牌",
  "随从",
  "目标",
  "效果",
  "触发",
  "范围",
  "资源",
  "虚空",
];

const state = {
  data: null,
  activeCategoryId: "trigger",
  activeEntryId: null,
  search: "",
};

const els = {
  stats: document.querySelector("#effectStats"),
  tabs: document.querySelector("#effectCategoryTabs"),
  list: document.querySelector("#effectEntryList"),
  detail: document.querySelector("#effectDetail"),
  search: document.querySelector("#effectSearch"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function highlightText(value) {
  let html = escapeHtml(value || "原始表格中尚未填写描述。");
  for (const term of highlightTerms.sort((a, b) => b.length - a.length)) {
    const escaped = escapeHtml(term);
    html = html.replaceAll(escaped, `<mark>${escaped}</mark>`);
  }
  return html.replace(/\n/g, "<br>");
}

function getCategories() {
  return state.data?.categories || [];
}

function getActiveCategory() {
  return getCategories().find((category) => category.id === state.activeCategoryId) || getCategories()[0];
}

function getEntries(category = getActiveCategory()) {
  return (category?.sections || []).flatMap((section) =>
    section.entries.map((entry) => ({ ...entry, sectionTitle: section.title }))
  );
}

function getAllEntries() {
  return getCategories().flatMap((category) => getEntries(category));
}

function getActiveEntry() {
  const entries = getEntries();
  return entries.find((entry) => entry.id === state.activeEntryId) || entries[0];
}

function entryMatchesSearch(entry) {
  if (!state.search) return true;
  const q = state.search.toLowerCase();
  return [entry.zh, entry.code, entry.description, entry.params, entry.target, entry.input, entry.output, entry.section]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(q));
}

function renderStats() {
  const categories = getCategories();
  els.stats.innerHTML = categories.map((category) => {
    const count = getEntries(category).length;
    return `<span>${escapeHtml(category.en)} <b>${count}</b></span>`;
  }).join("");
}

function renderTabs() {
  els.tabs.innerHTML = getCategories().map((category) => {
    const count = getEntries(category).length;
    const active = category.id === state.activeCategoryId ? "is-active" : "";
    return `
      <button class="effect-category-tab ${active}" type="button" data-category-id="${escapeHtml(category.id)}">
        <span>${escapeHtml(category.en)}</span>
        <strong>${escapeHtml(category.zh)}</strong>
        <small>${count} entries</small>
      </button>
    `;
  }).join("");
}

function renderList() {
  const category = getActiveCategory();
  const sections = category.sections || [];
  const query = state.search.trim();
  const html = sections.map((section) => {
    const entries = section.entries.filter(entryMatchesSearch);
    if (!entries.length) return "";
    return `
      <div class="effect-entry-section">
        <div class="effect-entry-section-title">${escapeHtml(section.title)}</div>
        ${entries.map((entry) => {
          const active = entry.id === getActiveEntry()?.id ? "is-active" : "";
          return `
            <button class="effect-entry-button ${active}" type="button" data-entry-id="${escapeHtml(entry.id)}">
              <span>
                <strong>${escapeHtml(entry.zh || "未命名")}</strong>
                <small>${escapeHtml(entry.code || "Code 待定")}</small>
              </span>
              <em>${escapeHtml(entry.status)}</em>
            </button>
          `;
        }).join("")}
      </div>
    `;
  }).join("");

  els.list.innerHTML = html || `
    <div class="effect-empty-state">
      <strong>没有找到匹配词条</strong>
      <span>${escapeHtml(query)}</span>
    </div>
  `;
}

function detailField(label, value) {
  if (!value) return "";
  return `
    <div class="effect-field">
      <span>${escapeHtml(label)}</span>
      <strong>${highlightText(value)}</strong>
    </div>
  `;
}

function codeExample(value) {
  return `<code>${escapeHtml(value)}</code>`;
}

function buildFlow(entry) {
  const code = entry.code || `${entry.zh || "Entry"} 待命名`;
  if (entry.category === "trigger") {
    return [code, "Distance{self,2}", "RandomSelect{1}", "Damage{2}"];
  }
  if (entry.category === "scope") {
    return ["OnCast{1}", code, "ALL", "Buff{ATK:+2}"];
  }
  if (entry.category === "aura") {
    return ["OnTMStart{global}", "Global{Me}", code, "Recalculate"];
  }
  const effectCode = entry.examples?.[0] || `${code}{...}`;
  return ["OnPlace", "Global{Enemy}", "PlayerSelect{1}", effectCode];
}

function renderFlow(entry) {
  return `
    <div class="effect-detail-flow">
      ${buildFlow(entry).map((step, index, arr) => `
        <span>${escapeHtml(step)}</span>
        ${index < arr.length - 1 ? "<b>→</b>" : ""}
      `).join("")}
    </div>
  `;
}

function renderExamples(entry) {
  if (!entry.examples?.length) {
    return `<p class="effect-muted">原始表格中还没有示例变体。</p>`;
  }
  return `
    <div class="effect-example-list">
      ${entry.examples.map((example) => `<div>${codeExample(example)}</div>`).join("")}
    </div>
  `;
}

function renderDetail() {
  const entry = getActiveEntry();
  const category = getActiveCategory();
  if (!entry) {
    els.detail.innerHTML = `
      <div class="effect-empty-state">
        <strong>请选择一个词条</strong>
        <span>Trigger · Scope · Effects · Aura</span>
      </div>
    `;
    return;
  }

  const accent = categoryAccent[entry.category] || "badge-domain";
  const targetLabel = entry.category === "scope" ? "输出类型" : "适用目标";
  const targetValue = entry.category === "scope" ? entry.output : entry.target;

  els.detail.innerHTML = `
    <div class="effect-detail-head">
      <div>
        <span class="section-kicker">${escapeHtml(category.en)}</span>
        <h2>${escapeHtml(entry.zh || "未命名")}</h2>
        <p>${escapeHtml(category.summary)}</p>
      </div>
      <span class="card-type-badge ${accent}">${escapeHtml(entry.status)}</span>
    </div>

    <div class="effect-code-title">
      <span>Code Name</span>
      ${codeExample(entry.code || "待命名")}
    </div>

    <div class="effect-description">
      ${highlightText(entry.description)}
    </div>

    <div class="effect-field-grid">
      ${detailField("所属分组", entry.sectionTitle || entry.section)}
      ${detailField(targetLabel, targetValue)}
      ${detailField("Scope 输入", entry.input)}
      ${detailField("可选变量", entry.params)}
    </div>

    <div class="effect-detail-block">
      <span>语法示例</span>
      ${renderExamples(entry)}
    </div>

    <div class="effect-detail-block">
      <span>结算链示意</span>
      ${renderFlow(entry)}
    </div>

    <div class="effect-detail-block">
      <span>实装提示</span>
      <p>${escapeHtml(categoryImplementation[entry.category] || "需要补充实装规则。")}</p>
    </div>
  `;
}

function renderAll() {
  renderStats();
  renderTabs();
  renderList();
  renderDetail();
}

function selectCategory(categoryId) {
  state.activeCategoryId = categoryId;
  state.search = "";
  els.search.value = "";
  state.activeEntryId = getEntries(getActiveCategory())[0]?.id || null;
  renderAll();
}

async function initEffectDictionary() {
  try {
    const res = await fetch("./data/effect-dict.json?v=20260614-effect-dict");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.data = await res.json();
    state.activeEntryId = getEntries(getActiveCategory())[0]?.id || null;
    renderAll();
  } catch (error) {
    els.detail.innerHTML = `
      <div class="effect-empty-state">
        <strong>效果字典加载失败</strong>
        <span>${escapeHtml(error.message)}</span>
      </div>
    `;
  }
}

els.tabs.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-category-id]");
  if (!tab) return;
  selectCategory(tab.dataset.categoryId);
});

els.list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-entry-id]");
  if (!button) return;
  state.activeEntryId = button.dataset.entryId;
  renderList();
  renderDetail();
});

els.search.addEventListener("input", (event) => {
  state.search = event.target.value.trim();
  const firstMatch = getAllEntries().find(entryMatchesSearch);
  if (firstMatch) {
    state.activeCategoryId = firstMatch.category;
    state.activeEntryId = firstMatch.id;
  } else {
    state.activeEntryId = null;
  }
  renderTabs();
  renderList();
  renderDetail();
});

initEffectDictionary();
