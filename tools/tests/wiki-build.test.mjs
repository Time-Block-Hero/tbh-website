import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { parsePage, renderPages, buildWiki } from '../build-wiki.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const page = (id, markdown) => parsePage(`---\ntitle: ${id}\nid: ${id}\nstatus: draft\n---\n${markdown}`, `${id}.md`);

test('Markdown renders structure and cross-page/anchor links with stable routes', () => {
  const pages = renderPages([page('start', '## Overview\n\n**Ready**\n\n- [Target](effects.md#目标)\n\n| A | B |\n| - | - |\n| 1 | 2 |'), page('effects', '## 目标\n\n未完成。')]);
  assert.match(pages[0].html, /<strong>Ready<\/strong>/);
  assert.match(pages[0].html, /<table>/);
  assert.match(pages[0].html, /href="#\/effects@%E7%9B%AE%E6%A0%87"/);
  assert.deepEqual(pages[1].toc, [{ id: '目标', text: '目标', depth: 2 }]);
});

test('raw HTML is escaped and script URL links fail closed', () => {
  const [result] = renderPages([page('start', '<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\nText <b onclick="bad()">inline</b>.')]);
  assert.doesNotMatch(result.html, /<script|<img|<b\s/);
  assert.match(result.html, /&lt;script&gt;/);
  for (const href of ['javascript:alert%281%29', 'data:text/html,hello', '//evil.example']) {
    assert.throws(() => renderPages([page('start', `[unsafe](${href})`)]), /invalid or unsafe link/);
  }
});

test('missing pages, missing anchors, invalid metadata and duplicate ids are rejected', () => {
  assert.throws(() => renderPages([page('start', '[bad](missing.md)')]), /invalid or unsafe link/);
  assert.throws(() => renderPages([page('start', '[bad](#missing)')]), /unknown anchor/);
  assert.throws(() => renderPages([page('start', ''), page('start', '')]), /Duplicate page id/);
  assert.throws(() => parsePage('no metadata', 'test.md'), /missing frontmatter/);
  assert.throws(() => page('../unsafe', ''), /invalid id/);
});

test('duplicate headings get unique predictable anchors', () => {
  const [result] = renderPages([page('start', '## 重复\n\n## 重复\n\n[第二段](#重复-2)')]);
  assert.deepEqual(result.toc.map(item => item.id), ['重复', '重复-2']);
  assert.match(result.html, /id="重复-2"/);
});

test('checked-in data matches the Markdown build and contains only unapproved draft pages', async () => {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'tbh-wiki-test-'));
  try {
    await fs.cp(path.join(root, 'docs/rules'), path.join(temp, 'docs/rules'), { recursive: true });
    const output = await buildWiki(temp);
    const generated = await fs.readFile(path.join(temp, 'wiki-data.js'), 'utf8');
    assert.equal(generated, await fs.readFile(path.join(root, 'wiki-data.js'), 'utf8'));
    assert.equal(output.sections.length, 5);
    assert.ok(output.pages.length > output.sections.length);
    assert.ok(output.pages.every(page => page.status === 'draft' && page.html.trim().length > 0));
    const context = { window: {} };
    vm.runInNewContext(generated, context);
    assert.equal(context.window.TBH_WIKI.pages.length, output.pages.length);
  } finally { await fs.rm(temp, { recursive: true, force: true }); }
});
