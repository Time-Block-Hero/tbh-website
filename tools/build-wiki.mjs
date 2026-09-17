import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';

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
export async function buildWiki(directory = root) {
  const sourceRoot = path.join(directory, 'docs/rules');
  const navigation = JSON.parse(await fs.readFile(path.join(sourceRoot, 'navigation.json'), 'utf8'));
  const paths = navigation.flatMap(section => [section.file, ...(section.pages || []).map(item => item.file)]);
  const pages = await Promise.all(paths.map(async filename => {
    if (!/^[a-z0-9/-]+\.md$/.test(filename)) throw new Error(`Invalid source path ${filename}`);
    return parsePage(await fs.readFile(path.join(sourceRoot, filename), 'utf8'), filename);
  }));
  renderPages(pages);
  const byFile = new Map(pages.map(page => [page.file, page]));
  const sections = navigation.map(section => ({ id: byFile.get(section.file).id, title: byFile.get(section.file).title, pages: (section.pages || []).map(item => byFile.get(item.file).id) }));
  const output = { sections, pages: pages.map(({ markdown, ...page }) => page) };
  await fs.writeFile(path.join(directory, 'wiki-data.js'), `// Generated by tools/build-wiki.mjs. Edit docs/rules instead.\nwindow.TBH_WIKI = ${JSON.stringify(output, null, 2).replace(/</g, '\\u003c')};\n`);
  return output;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await buildWiki();
  console.log(`Built ${result.pages.length} Wiki pages in ${result.sections.length} sections.`);
}
