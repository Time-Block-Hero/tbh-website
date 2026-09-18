import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked, Renderer } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const escapeHTML = (text = '') => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function parsePage(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`${filename}: missing frontmatter`);
  const meta = Object.fromEntries(match[1].split(/\r?\n/).map(line => {
    const at = line.indexOf(':');
    if (at < 1) throw new Error(`${filename}: invalid metadata`);
    return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
  }));
  if (!/^[a-z][a-z0-9/-]*$/.test(meta.id) || !meta.title || !['draft', 'approved', 'retired'].includes(meta.status)) throw new Error(`${filename}: invalid id, title or status`);
  return { ...meta, file: filename, markdown: match[2], toc: [] };
}
function headings(markdown) {
  const seen = new Map();
  const marked = new Marked();
  const tokens = [];
  marked.walkTokens(marked.lexer(markdown), token => { if (token.type === 'heading') tokens.push(token); });
  return tokens.map(token => {
    // Reading numbers may change; existing rule links keep their semantic anchors.
    const anchorText = token.text.replace(/^\d+(?:\.\d+)+\s+/, '');
    const base = anchorText.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return { id: `${base}${count ? `-${count + 1}` : ''}`, text: token.text, depth: token.depth };
  });
}
export function renderPages(pages) {
  const files = new Map(pages.map(page => [page.file, page]));
  const ids = new Set();
  for (const page of pages) {
    if (ids.has(page.id)) throw new Error(`Duplicate page id: ${page.id}`);
    ids.add(page.id);
    page.toc = headings(page.markdown);
  }
  for (const page of pages) {
    let headingIndex = 0;
    const renderer = {
      html({ text }) { return escapeHTML(text); },
      code({ text, lang }) {
        if (lang?.trim() !== 'mermaid') return false;
        return `<figure class="wiki-flowchart"><div class="wiki-flowchart-view" aria-label="规则流程图"></div><details open><summary>Mermaid 源码</summary><pre><code class="language-mermaid">${escapeHTML(text)}</code></pre></details></figure>\n`;
      },
      table(token) {
        const html = Renderer.prototype.table.call(this, token);
        return token.header.length >= 4
          ? `<div class="wiki-table-scroll" tabindex="0" role="region" aria-label="规则表格，可横向滚动">${html}</div>\n`
          : html;
      },
      heading({ tokens, depth }) {
        const heading = page.toc[headingIndex++];
        return `<h${depth} id="${escapeHTML(heading.id)}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const label = this.parser.parseInline(tokens);
        let url = href;
        if (/^https?:\/\//i.test(href)) {
          return `<a href="${escapeHTML(href)}" rel="noopener noreferrer"${title ? ` title="${escapeHTML(title)}"` : ''}>${label}</a>`;
        }
        const [filename, encodedAnchor = ''] = href.split('#');
        let anchor;
        try { anchor = decodeURIComponent(encodedAnchor); } catch { throw new Error(`${page.file}: malformed link ${href}`); }
        const target = filename ? files.get(path.posix.normalize(path.posix.join(path.posix.dirname(page.file), filename))) : page;
        if (!target) throw new Error(`${page.file}: invalid or unsafe link ${href}`);
        if (anchor && !target.toc.some(item => item.id === anchor)) throw new Error(`${page.file}: unknown anchor ${href}`);
        url = `#/${target.id}${anchor ? `@${encodeURIComponent(anchor)}` : ''}`;
        return `<a href="${escapeHTML(url)}">${label}</a>`;
      },
      image({ href, text }) {
        // Images are local static assets only; no remote tracking or executable URLs.
        if (!/^\.\.\/\.\.\/\.\.\/assets\/[a-zA-Z0-9/_ .-]+\.(png|jpe?g|webp|gif|svg)$/i.test(href) || href.includes('/../', 9)) throw new Error(`${page.file}: unsupported image ${href}`);
        const asset = escapeHTML(href.replace('../../../', './'));
        return `<a class="wiki-illustration" href="${asset}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(text)}（打开原图）"><img src="${asset}" alt="${escapeHTML(text)}" loading="lazy"></a>`;
      }
    };
    page.html = new Marked({ renderer, gfm: true }).parse(page.markdown);
  }
  return pages;
}
export function validateRedirects(redirects, pages) {
  if (!redirects || typeof redirects !== 'object' || Array.isArray(redirects)) throw new Error('Redirects must be an object');
  const byId = new Map(pages.map(page => [page.id, page]));
  const parseRoute = route => {
    if (typeof route !== 'string' || !/^[a-z][a-z0-9/-]*(?:@[\p{L}\p{N}-]+)?$/u.test(route)) throw new Error(`Invalid redirect route: ${route}`);
    const [id, anchor] = route.split('@');
    return { id, anchor };
  };
  const exists = ({ id, anchor }) => {
    const page = byId.get(id);
    return page && (anchor === undefined || page.toc.some(item => item.id === anchor));
  };
  for (const [source, target] of Object.entries(redirects)) {
    const from = parseRoute(source);
    const to = parseRoute(target);
    if (exists(from)) throw new Error(`Redirect source shadows existing page or anchor: ${source}`);
    // Targets must be real destinations, never other aliases; this also prevents cycles.
    if (!exists(to)) throw new Error(`Unknown redirect target: ${target}`);
  }
  return redirects;
}

export async function buildWiki(directory = root) {
  // Check in the pinned, self-contained runtime so static/offline previews need no CDN.
  const vendor = path.join(directory, 'assets/vendor/mermaid');
  await fs.mkdir(vendor, { recursive: true });
  for (const [source, target] of [['dist/mermaid.tiny.js', 'mermaid.tiny.js'], ['LICENSE', 'LICENSE']]) {
    await fs.copyFile(path.join(root, 'node_modules/@mermaid-js/tiny', source), path.join(vendor, target));
  }
  const sourceRoot = path.join(directory, 'docs/rules');
  const navigation = JSON.parse(await fs.readFile(path.join(sourceRoot, 'navigation.json'), 'utf8'));
  if (!Array.isArray(navigation)) throw new Error('Navigation must be an array');
  const entries = [];
  const seenFiles = new Set();
  function visit(node, parentFile = null, isSection = false) {
    const filename = node?.file;
    if (typeof filename !== 'string' || !/^[a-z0-9/-]+\.md$/.test(filename) || filename.startsWith('/')) throw new Error(`Invalid source path ${filename}`);
    if (seenFiles.has(filename)) throw new Error(`Duplicate navigation source: ${filename}`);
    seenFiles.add(filename);
    entries.push({ file: filename, parentFile });
    const children = (isSection ? node.pages : node.children) ?? [];
    if (!Array.isArray(children)) throw new Error(`${filename}: navigation children must be an array`);
    const unexpected = isSection ? node.children : node.pages;
    if (unexpected !== undefined) throw new Error(`${filename}: use ${isSection ? 'pages' : 'children'} for navigation children`);
    return { file: filename, children: children.map(child => visit(child, filename)) };
  }
  const trees = navigation.map(section => visit(section, null, true));
  const pages = await Promise.all(entries.map(async ({ file }) => parsePage(await fs.readFile(path.join(sourceRoot, file), 'utf8'), file)));
  renderPages(pages);
  const byFile = new Map(pages.map(page => [page.file, page]));
  for (const { file, parentFile } of entries) {
    if (parentFile) byFile.get(file).parentId = byFile.get(parentFile).id;
  }
  const toIds = node => ({ id: byFile.get(node.file).id, children: node.children.map(toIds) });
  const descendants = node => node.children.flatMap(child => [child.id, ...descendants(child)]);
  const sections = trees.map(tree => {
    const node = toIds(tree);
    return { id: node.id, title: byFile.get(tree.file).title, pages: descendants(node), tree: node.children };
  });
  let redirects = {};
  try {
    redirects = JSON.parse(await fs.readFile(path.join(sourceRoot, 'redirects.json'), 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  validateRedirects(redirects, pages);
  const output = { sections, pages: pages.map(({ markdown, ...page }) => page), redirects };
  await fs.writeFile(path.join(directory, 'wiki-data.js'), `// Generated by tools/build-wiki.mjs. Edit docs/rules instead.\nwindow.TBH_WIKI = ${JSON.stringify(output, null, 2).replace(/</g, '\\u003c')};\n`);
  return output;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await buildWiki();
  console.log(`Built ${result.pages.length} Wiki pages in ${result.sections.length} sections.`);
}
