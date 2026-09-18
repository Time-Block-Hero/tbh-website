(() => {
  "use strict";
  const data = window.TBH_WIKI;
  const article = document.getElementById("wiki-article");
  if (!article) return;
  if (!data?.pages?.length || !data.sections?.length) {
    article.textContent = "规则目录暂时无法加载，请刷新后重试。";
    return;
  }
  const byId = new Map(data.pages.map((page) => [page.id, page]));
  const nav = document.getElementById("wiki-navigation");
  const sidebar = document.getElementById("wiki-sidebar");
  const menu = document.getElementById("wiki-menu-toggle");
  const search = document.getElementById("wiki-search");
  const results = document.getElementById("wiki-search-results");
  const pageURL = (id) => `#/${id}`;
  const link = (text, href, className = "") => {
    const element = document.createElement("a");
    element.textContent = text;
    element.href = href;
    if (className) element.className = className;
    return element;
  };
  const closeMenu = () => {
    sidebar.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
  };
  const parents = new Map(data.pages.filter(page => page.parentId).map(page => [page.id, page.parentId]));
  const branches = new Map();
  let branchSerial = 0;
  // Older generated data contains only a flat section list.
  for (const section of data.sections) {
    for (const id of section.pages) if (!parents.has(id)) parents.set(id, section.id);
  }
  function ancestors(id) {
    const chain = [];
    const seen = new Set([id]);
    for (let parent = parents.get(id); parent && !seen.has(parent); parent = parents.get(parent)) {
      seen.add(parent);
      chain.unshift(parent);
    }
    return chain;
  }
  function navigationItem(node, label) {
    const page = byId.get(node.id);
    const item = document.createElement("li");
    const row = document.createElement("div");
    row.className = "wiki-page-row";
    const anchor = link(label || page.title, pageURL(node.id));
    anchor.dataset.page = node.id;
    row.append(anchor);
    item.append(row);
    if (node.children?.length) {
      const children = document.createElement("ul");
      children.className = "wiki-page-children";
      children.id = `wiki-children-${++branchSerial}`;
      children.hidden = true;
      children.append(...node.children.map(child => navigationItem(child)));
      const button = document.createElement("button");
      button.type = "button";
      button.className = "wiki-page-toggle";
      button.setAttribute("aria-controls", children.id);
      const expand = open => {
        children.hidden = !open;
        button.textContent = open ? "−" : "+";
        button.setAttribute("aria-expanded", String(open));
        button.setAttribute("aria-label", `${open ? "收起" : "展开"}${page.title}的子页`);
      };
      expand(false);
      button.addEventListener("click", () => expand(children.hidden));
      branches.set(node.id, expand);
      row.append(button);
      item.append(children);
    }
    return item;
  }
  data.sections.forEach((section, index) => {
    const group = document.createElement("details");
    group.className = "wiki-group";
    group.dataset.section = section.id;
    const heading = document.createElement("summary");
    const number = document.createElement("span");
    number.className = "group-number";
    number.textContent = String(index).padStart(2, "0");
    heading.append(number, document.createTextNode(section.title));
    const list = document.createElement("ul");
    list.append(navigationItem({ id: section.id }, "本组导读"));
    const tree = section.tree || section.pages.map(id => ({ id }));
    list.append(...tree.filter(node => byId.has(node.id)).map(node => navigationItem(node)));
    group.append(heading, list);
    nav.append(group);
  });
  let currentId;
  let diagramSerial = 0;
  let diagramTask = Promise.resolve();
  window.mermaid?.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "dark",
    fontFamily: "Arial, sans-serif",
    flowchart: { htmlLabels: false, useMaxWidth: false },
  });
  async function renderDiagrams(figures) {
    for (const figure of figures) {
      if (!figure.isConnected) continue;
      const details = figure.querySelector("details");
      const view = figure.querySelector(".wiki-flowchart-view");
      try {
        if (!window.mermaid) throw new Error("Mermaid unavailable");
        const { svg } = await window.mermaid.render(
          `wiki-diagram-${++diagramSerial}`,
          figure.querySelector("code").textContent,
        );
        if (!figure.isConnected) continue;
        view.innerHTML = svg;
        view.tabIndex = 0;
        details.open = false;
      } catch {
        if (!figure.isConnected) continue;
        view.textContent = "图示暂时无法渲染，可阅读下方 Mermaid 源码。";
        details.open = true;
      }
    }
  }
  function navigate() {
    const hash = location.hash.startsWith("#/")
      ? location.hash.slice(2)
      : "start";
    const [id, rawAnchor = "", ...extraFragments] = hash.split("@");
    const page = byId.get(id);
    let anchor = "";
    try {
      anchor = decodeURIComponent(rawAnchor);
    } catch {
      /* Invalid fragment cannot execute or break routing. */
    }
    const redirectKey = `${id}${rawAnchor ? `@${anchor}` : ""}`;
    if (!extraFragments.length && Object.hasOwn(data.redirects || {}, redirectKey)) {
      const [targetId, targetAnchor] = data.redirects[redirectKey].split("@");
      // Redirects are validated at build time and always remain within this Wiki.
      location.replace(`${pageURL(targetId)}${targetAnchor ? `@${encodeURIComponent(targetAnchor)}` : ""}`);
      return;
    }
    const changed = currentId !== id;
    currentId = id;
    closeMenu();
    if (!page) {
      document.title = "未找到页面 — TBH 规则 Wiki";
      document.getElementById("wiki-title").textContent = "未找到这个条目";
      article.replaceChildren(
        document.createTextNode("该链接可能已变更。请从左侧目录选择页面，或 "),
        link("返回开始阅读", "#/start"),
      );
      [
        "wiki-breadcrumbs",
        "wiki-toc-links",
        "wiki-pagination",
        "wiki-section-number",
        "wiki-status",
        "wiki-page-id",
      ].forEach((key) => document.getElementById(key).replaceChildren());
      document.getElementById("wiki-draft-banner").hidden = true;
      nav
        .querySelectorAll("[aria-current]")
        .forEach((item) => item.removeAttribute("aria-current"));
      window.scrollTo(0, 0);
      return;
    }
    const sectionIndex = data.sections.findIndex(
      (section) => section.id === id || section.pages.includes(id),
    );
    const section = data.sections[sectionIndex];
    document.title = `${page.title} — TBH 规则 Wiki`;
    document.getElementById("wiki-title").textContent = page.title;
    document.getElementById("wiki-section-number").textContent =
      `SECTION ${String(sectionIndex).padStart(2, "0")} / RULES WIKI`;
    const status = document.getElementById("wiki-status");
    status.textContent =
      { draft: "草稿", approved: "已确认", retired: "已归档" }[page.status] ||
      "待整理";
    status.dataset.status = page.status;
    document.getElementById("wiki-draft-banner").hidden =
      page.status !== "draft";
    document.getElementById("wiki-page-id").textContent = page.id;
    const crumbs = document.getElementById("wiki-breadcrumbs");
    crumbs.replaceChildren(
      link("规则 Wiki", "#/start"),
      document.createTextNode("/"),
      link(section.title, pageURL(section.id)),
    );
    for (const parentId of ancestors(id).filter(parentId => parentId !== section.id)) {
      crumbs.append(document.createTextNode("/"), link(byId.get(parentId).title, pageURL(parentId)));
    }
    if (id !== section.id)
      crumbs.append(document.createTextNode("/"), document.createTextNode(page.title));
    // Only build-time escaped HTML is loaded, never URL or user-supplied HTML.
    if (changed) {
      article.innerHTML = page.html;
      const figures = [...article.querySelectorAll(".wiki-flowchart")];
      // Serialize renders; a navigation detaches stale figures before they can be updated.
      diagramTask = diagramTask.then(() => renderDiagrams(figures));
    }
    nav.querySelectorAll("[data-page]").forEach((item) => {
      if (item.dataset.page === id) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    nav.querySelectorAll("details").forEach((group) => {
      if (group.dataset.section === section.id) group.open = true;
    });
    for (const ancestorId of [...ancestors(id), id]) branches.get(ancestorId)?.(true);
    const toc = document.getElementById("wiki-toc-links");
    toc.replaceChildren(
      ...page.toc.map((heading) => {
        const item = link(
          heading.text,
          `${pageURL(id)}@${encodeURIComponent(heading.id)}`,
        );
        item.dataset.depth = heading.depth;
        return item;
      }),
    );
    const pagination = document.getElementById("wiki-pagination");
    pagination.replaceChildren();
    const pageIndex = data.pages.findIndex((item) => item.id === id);
    [
      ["上一页", data.pages[pageIndex - 1]],
      ["下一页", data.pages[pageIndex + 1]],
    ].forEach(([label, neighbor]) => {
      if (!neighbor) return;
      const item = link(neighbor.title, pageURL(neighbor.id));
      const detail = document.createElement("span");
      detail.textContent = label === "上一页" ? `← ${label}` : `${label} →`;
      item.prepend(detail);
      item.style.gridColumn = label === "上一页" ? "1" : "2";
      item.style.textAlign = label === "上一页" ? "left" : "right";
      pagination.append(item);
    });
    article.querySelectorAll(".is-anchor-target").forEach(target => target.classList.remove("is-anchor-target"));
    const revealAnchor = () => {
      const target = document.getElementById(anchor);
      if (!target || !article.contains(target)) return;
      for (let parent = target.parentElement; parent && parent !== article; parent = parent.parentElement) {
        if (parent.tagName === "DETAILS") parent.open = true;
      }
      target.classList.add("is-anchor-target");
      target.scrollIntoView({ behavior: "instant", block: "start", inline: "nearest" });
    };
    requestAnimationFrame(() => {
      if (anchor) revealAnchor();
      else if (changed) window.scrollTo({ top: 0, behavior: "instant" });
    });
    const targetHash = location.hash;
    if (anchor) diagramTask.then(() => {
      if (location.hash !== targetHash) return;
      revealAnchor();
    });
  }
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.querySelector(".portal-skip").addEventListener("click", (event) => {
    event.preventDefault();
    article.focus();
    article.scrollIntoView();
  });
  menu.addEventListener("click", () => {
    const open = !sidebar.classList.contains("is-open");
    sidebar.classList.toggle("is-open", open);
    menu.setAttribute("aria-expanded", String(open));
    if (open) search.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
      closeMenu();
      menu.focus();
    }
    if (
      event.key === "/" &&
      !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      if (matchMedia("(max-width: 700px)").matches) {
        sidebar.classList.add("is-open");
        menu.setAttribute("aria-expanded", "true");
      }
      search.focus();
    }
  });
  search.addEventListener("input", () => {
    const query = search.value.trim().toLocaleLowerCase();
    results.hidden = !query;
    nav.hidden = Boolean(query);
    results.replaceChildren();
    if (!query) return;
    const matches = new Map();
    for (const page of data.pages) {
      if (page.title.toLocaleLowerCase().includes(query) || page.id.includes(query)) {
        matches.set(pageURL(page.id), page.title);
      }
      for (const heading of page.toc || []) {
        if (heading.text.toLocaleLowerCase().includes(query)) {
          matches.set(
            `${pageURL(page.id)}@${encodeURIComponent(heading.id)}`,
            `${heading.text} — ${page.title}`,
          );
        }
      }
      for (const entry of page.entries || []) {
        if (`${entry.text} ${entry.searchText || ""}`.toLocaleLowerCase().includes(query)) {
          matches.set(
            `${pageURL(page.id)}@${encodeURIComponent(entry.id)}`,
            `${entry.text} — ${page.title}`,
          );
        }
      }
    }
    const summary = document.createElement("p");
    summary.setAttribute("role", "status");
    summary.textContent = matches.size
      ? `${matches.size} 个页面、章节或词条`
      : "没有匹配的页面、章节或词条，请尝试其他关键词。";
    results.append(
      summary,
      ...Array.from(matches, ([href, label]) => link(label, href)),
    );
  });
  results.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      search.value = "";
      search.dispatchEvent(new Event("input"));
      closeMenu();
    }
  });
  document
    .getElementById("wiki-back-top")
    .addEventListener("click", (event) => {
      event.preventDefault();
      history.replaceState(null, "", pageURL(currentId));
      window.scrollTo({
        top: 0,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  window.addEventListener("hashchange", navigate);
  navigate();
})();
