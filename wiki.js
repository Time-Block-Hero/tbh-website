(() => {
  'use strict';
  const data = window.TBH_WIKI;
  const article = document.getElementById('wiki-article');
  if (!article) return;
  if (!data?.pages?.length || !data.sections?.length) {
    article.textContent = '规则目录暂时无法加载，请刷新后重试。';
    return;
  }
  const byId = new Map(data.pages.map(page => [page.id, page]));
  const nav = document.getElementById('wiki-navigation');
  const sidebar = document.getElementById('wiki-sidebar');
  const menu = document.getElementById('wiki-menu-toggle');
  const search = document.getElementById('wiki-search');
  const results = document.getElementById('wiki-search-results');
  const pageURL = id => `#/${id}`;
  const link = (text, href, className = '') => {
    const element = document.createElement('a');
    element.textContent = text;
    element.href = href;
    if (className) element.className = className;
    return element;
  };
  const closeMenu = () => {
    sidebar.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
  };
  data.sections.forEach((section, index) => {
    const group = document.createElement('details');
    group.className = 'wiki-group';
    group.dataset.section = section.id;
    const heading = document.createElement('summary');
    const number = document.createElement('span');
    number.className = 'group-number';
    number.textContent = String(index).padStart(2, '0');
    heading.append(number, document.createTextNode(section.title));
    const list = document.createElement('ul');
    [section.id, ...section.pages].forEach(id => {
      const page = byId.get(id);
      if (!page) return;
      const item = document.createElement('li');
      const anchor = link(id === section.id ? '章节概览' : page.title, pageURL(id));
      anchor.dataset.page = id;
      item.append(anchor);
      list.append(item);
    });
    group.append(heading, list);
    nav.append(group);
  });
  let currentId;
  function navigate() {
    const hash = location.hash.startsWith('#/') ? location.hash.slice(2) : 'start';
    const [id, rawAnchor = ''] = hash.split('@');
    const page = byId.get(id);
    let anchor = '';
    try { anchor = decodeURIComponent(rawAnchor); } catch { /* Invalid fragment cannot execute or break routing. */ }
    const changed = currentId !== id;
    currentId = id;
    closeMenu();
    if (!page) {
      document.title = '未找到页面 — TBH 规则 Wiki';
      document.getElementById('wiki-title').textContent = '未找到这个条目';
      article.replaceChildren(document.createTextNode('该链接可能已变更。请从左侧目录选择页面，或 '), link('返回开始阅读', '#/start'));
      ['wiki-breadcrumbs', 'wiki-toc-links', 'wiki-pagination', 'wiki-section-number', 'wiki-status', 'wiki-page-id'].forEach(key => document.getElementById(key).replaceChildren());
      document.getElementById('wiki-draft-banner').hidden = true;
      nav.querySelectorAll('[aria-current]').forEach(item => item.removeAttribute('aria-current'));
      window.scrollTo(0, 0);
      return;
    }
    const sectionIndex = data.sections.findIndex(section => section.id === id || section.pages.includes(id));
    const section = data.sections[sectionIndex];
    document.title = `${page.title} — TBH 规则 Wiki`;
    document.getElementById('wiki-title').textContent = page.title;
    document.getElementById('wiki-section-number').textContent = `CHAPTER ${String(sectionIndex).padStart(2, '0')} / RULES WIKI`;
    const status = document.getElementById('wiki-status');
    status.textContent = { draft: '待整理', approved: '已确认', retired: '已归档' }[page.status] || '待整理';
    status.dataset.status = page.status;
    document.getElementById('wiki-draft-banner').hidden = page.status !== 'draft';
    document.getElementById('wiki-page-id').textContent = page.id;
    const crumbs = document.getElementById('wiki-breadcrumbs');
    crumbs.replaceChildren(link('规则 Wiki', '#/start'), document.createTextNode('/'), link(section.title, pageURL(section.id)));
    if (id !== section.id) crumbs.append(document.createTextNode('/'), document.createTextNode(page.title));
    // Only build-time escaped HTML is loaded, never URL or user-supplied HTML.
    if (changed) article.innerHTML = page.html;
    nav.querySelectorAll('[data-page]').forEach(item => {
      if (item.dataset.page === id) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    nav.querySelectorAll('details').forEach(group => { if (group.dataset.section === section.id) group.open = true; });
    const toc = document.getElementById('wiki-toc-links');
    toc.replaceChildren(...page.toc.map(heading => {
      const item = link(heading.text, `${pageURL(id)}@${encodeURIComponent(heading.id)}`);
      item.dataset.depth = heading.depth;
      return item;
    }));
    const pagination = document.getElementById('wiki-pagination');
    pagination.replaceChildren();
    const pageIndex = data.pages.findIndex(item => item.id === id);
    [['上一页', data.pages[pageIndex - 1]], ['下一页', data.pages[pageIndex + 1]]].forEach(([label, neighbor]) => {
      if (!neighbor) return;
      const item = link(neighbor.title, pageURL(neighbor.id));
      const detail = document.createElement('span');
      detail.textContent = label === '上一页' ? `← ${label}` : `${label} →`;
      item.prepend(detail);
      item.style.gridColumn = label === '上一页' ? '1' : '2';
      item.style.textAlign = label === '上一页' ? 'left' : 'right';
      pagination.append(item);
    });
    requestAnimationFrame(() => {
      if (anchor) {
        const target = document.getElementById(anchor);
        if (target && article.contains(target)) target.scrollIntoView();
      } else if (changed) window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    article.focus();
    article.scrollIntoView();
  });
  menu.addEventListener('click', () => {
    const open = !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    if (open) search.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && sidebar.classList.contains('is-open')) { closeMenu(); menu.focus(); }
    if (event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      if (matchMedia('(max-width: 720px)').matches) { sidebar.classList.add('is-open'); menu.setAttribute('aria-expanded', 'true'); }
      search.focus();
    }
  });
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    results.hidden = !query;
    nav.hidden = Boolean(query);
    results.replaceChildren();
    if (!query) return;
    const matches = data.pages.filter(page => page.title.toLocaleLowerCase().includes(query) || page.id.includes(query));
    const summary = document.createElement('p');
    summary.setAttribute('role', 'status');
    summary.textContent = matches.length ? `${matches.length} 个条目` : '没有匹配的标题，请尝试其他关键词。';
    results.append(summary, ...matches.map(page => link(page.title, pageURL(page.id))));
  });
  results.addEventListener('click', event => {
    if (event.target.closest('a')) { search.value = ''; search.dispatchEvent(new Event('input')); closeMenu(); }
  });
  document.getElementById('wiki-back-top').addEventListener('click', event => {
    event.preventDefault();
    history.replaceState(null, '', pageURL(currentId));
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  window.addEventListener('hashchange', navigate);
  navigate();
})();
