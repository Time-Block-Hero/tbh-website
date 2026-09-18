import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { parsePage, renderPages, buildWiki, validateRedirects } from '../build-wiki.mjs';

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

test('section numbering preserves semantic anchors and displayed hierarchy', () => {
  const [result] = renderPages([page('concepts', '## 2.2 卡牌种类\n\n### 2.2.3 资源牌\n\n[资源](#资源牌)')]);
  assert.deepEqual(result.toc, [
    { id: '卡牌种类', text: '2.2 卡牌种类', depth: 2 },
    { id: '资源牌', text: '2.2.3 资源牌', depth: 3 }
  ]);
  assert.match(result.html, /id="资源牌">2\.2\.3 资源牌/);
  assert.match(result.html, /href="#\/concepts@%E8%B5%84%E6%BA%90%E7%89%8C"/);
});

test('local illustrations open at full size without allowing remote or executable images', () => {
  const [result] = renderPages([page('concepts', '![棋盘](../../../assets/wiki/board-space.svg)')]);
  assert.match(result.html, /class="wiki-illustration" href="\.\/assets\/wiki\/board-space.svg" target="_blank" rel="noopener noreferrer"/);
  assert.match(result.html, /alt="棋盘"/);
  for (const href of ['https://example.com/image.svg', 'javascript:bad', '../../../assets/wiki/../secret.svg']) {
    assert.throws(() => renderPages([page('concepts', `![bad](${href})`)]), /unsupported image/);
  }
});

test('Mermaid fences retain escaped readable source and do not change ordinary code blocks', () => {
  const source = 'flowchart LR\n  A["<script>alert(1)</script>"] --> B["虚空"]';
  const [result] = renderPages([page('concepts', '```mermaid\n' + source + '\n```\n\n```js\nconst a = 1;\n```')]);
  assert.match(result.html, /class="wiki-flowchart"/);
  assert.match(result.html, /<details open><summary>Mermaid 源码<\/summary>/);
  assert.match(result.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(result.html, /<script>/);
  assert.match(result.html, /<code class="language-js">const a = 1;/);
  assert.equal(result.toc.length, 0);
});

test('checked-in data matches the Markdown build and contains only unapproved draft pages', async () => {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'tbh-wiki-test-'));
  try {
    await fs.cp(path.join(root, 'docs/rules'), path.join(temp, 'docs/rules'), { recursive: true });
    const output = await buildWiki(temp);
    for (const name of ['mermaid.tiny.js', 'LICENSE']) {
      assert.deepEqual(await fs.readFile(path.join(temp, 'assets/vendor/mermaid', name)), await fs.readFile(path.join(root, 'assets/vendor/mermaid', name)));
    }
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

async function navigationFixture(navigation, sources, check, redirects) {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'tbh-wiki-navigation-'));
  try {
    const docs = path.join(temp, 'docs/rules');
    await fs.mkdir(docs, { recursive: true });
    await fs.writeFile(path.join(docs, 'navigation.json'), JSON.stringify(navigation));
    if (redirects !== undefined) await fs.writeFile(path.join(docs, 'redirects.json'), JSON.stringify(redirects));
    for (const [file, id, body = '## Content'] of sources) {
      await fs.mkdir(path.dirname(path.join(docs, file)), { recursive: true });
      await fs.writeFile(path.join(docs, file), `---\ntitle: ${id}\nid: ${id}\nstatus: draft\n---\n${body}`);
    }
    await check(() => buildWiki(temp));
  } finally { await fs.rm(temp, { recursive: true, force: true }); }
}

test('nested navigation preserves DFS reading order, flat membership and exact parent chains', async () => {
  const navigation = [{ file: 'index.md', pages: [
    { file: 'effects.md', children: [
      { file: 'active.md' },
      { file: 'dictionary.md', children: [{ file: 'dictionary/events.md' }] }
    ] },
    { file: 'settlement.md' }
  ] }];
  const sources = [
    ['index.md', 'common'], ['effects.md', 'card-effects'], ['active.md', 'active'],
    ['dictionary.md', 'dictionary'], ['dictionary/events.md', 'events', '## Event list\n\n[Active](../active.md#content)'],
    ['settlement.md', 'settlement']
  ];
  await navigationFixture(navigation, sources, async build => {
    const result = await build();
    assert.deepEqual(result.pages.map(page => page.id), ['common', 'card-effects', 'active', 'dictionary', 'events', 'settlement']);
    assert.deepEqual(result.sections[0].pages, ['card-effects', 'active', 'dictionary', 'events', 'settlement']);
    assert.deepEqual(result.sections[0].tree, [
      { id: 'card-effects', children: [
        { id: 'active', children: [] },
        { id: 'dictionary', children: [{ id: 'events', children: [] }] }
      ] },
      { id: 'settlement', children: [] }
    ]);
    const pages = new Map(result.pages.map(page => [page.id, page]));
    assert.equal(pages.get('events').parentId, 'dictionary');
    assert.equal(pages.get('dictionary').parentId, 'card-effects');
    assert.equal(pages.get('card-effects').parentId, 'common');
    assert.equal(pages.get('common').parentId, undefined);
    assert.equal(new Set(result.pages.map(page => page.id)).size, result.pages.length);
    assert.deepEqual(result.redirects, {});
    assert.match(pages.get('events').html, /href="#\/active@content"/);
  });
});

test('nested navigation rejects duplicate files, invalid child collections and missing nested sources', async () => {
  const sources = [['index.md', 'common'], ['effects.md', 'card-effects']];
  await navigationFixture([{ file: 'index.md', pages: [{ file: 'effects.md', children: [{ file: 'effects.md' }] }] }], sources,
    build => assert.rejects(build, /Duplicate navigation source: effects.md/));
  await navigationFixture([{ file: 'index.md', pages: [{ file: 'effects.md', children: {} }] }], sources,
    build => assert.rejects(build, /navigation children must be an array/));
  await navigationFixture([{ file: 'index.md', pages: [{ file: 'effects.md', children: [{ file: 'missing.md' }] }] }], sources,
    build => assert.rejects(build, /ENOENT.*missing.md/));
  await navigationFixture([{ file: 'index.md', pages: [{ file: '/effects.md' }] }], sources,
    build => assert.rejects(build, /Invalid source path/));
  await navigationFixture([{ file: 'index.md', pages: [{ file: 'effects.md', pages: [] }] }], sources,
    build => assert.rejects(build, /use children for navigation children/));
});


test('legacy page and decoded heading redirects resolve to real destinations', () => {
  const pages = renderPages([page('card-effects', '## Current'), page('dictionary/usage', '## 统计主体')]);
  const redirects = { 'card-effects@旧锚点': 'dictionary/usage@统计主体', 'old-page': 'card-effects' };
  assert.deepEqual(validateRedirects(redirects, pages), redirects);
  assert.deepEqual(validateRedirects({}, pages), {});
});

test('redirects reject shadowing, missing targets, alias chains, cycles and unsafe URLs', () => {
  const pages = renderPages([page('card-effects', '## Current'), page('dictionary/usage', '## 统计主体')]);
  for (const source of ['card-effects', 'card-effects@current']) {
    assert.throws(() => validateRedirects({ [source]: 'dictionary/usage' }, pages), /shadows existing/);
  }
  for (const target of ['missing', 'dictionary/usage@缺失']) {
    assert.throws(() => validateRedirects({ old: target }, pages), /Unknown redirect target/);
  }
  assert.throws(() => validateRedirects({ old: 'other', other: 'old' }, pages), /Unknown redirect target/);
  assert.throws(() => validateRedirects({ old: 'other', other: 'card-effects' }, pages), /Unknown redirect target/);
  for (const route of ['javascript:alert(1)', 'https://example.com', '//example.com', '../old', 'old@%E4%B8%AD', 'old@', 'old@a@b', 'old@<img>']) {
    assert.throws(() => validateRedirects({ [route]: 'card-effects' }, pages), /Invalid redirect route/);
    assert.throws(() => validateRedirects({ old: route }, pages), /Invalid redirect route/);
  }
  for (const invalid of [null, [], 'old']) assert.throws(() => validateRedirects(invalid, pages), /must be an object/);
});


test('build reads optional redirect mappings and validates destinations after heading generation', async () => {
  const mapping = { 'old@旧标题': 'common@content' };
  await navigationFixture([{ file: 'index.md', pages: [] }], [['index.md', 'common']], async build => {
    const output = await build();
    assert.deepEqual(output.redirects, mapping);
  }, mapping);
  await navigationFixture([{ file: 'index.md', pages: [] }], [['index.md', 'common']],
    build => assert.rejects(build, /Unknown redirect target/), { old: 'common@不存在' });
});

test('wide design tables get keyboard-accessible scroll containers without bypassing safe rendering', () => {
  const [result] = renderPages([page('start', '| A | B | C | D |\n| - | - | - | - |\n| **required** | [entry](#entry) | <img src=x> | value |\n\n## Entry')]);
  assert.match(result.html, /class="wiki-table-scroll" tabindex="0" role="region"/);
  assert.match(result.html, /<strong>required<\/strong>/);
  assert.match(result.html, /href="#\/start@entry"/);
  assert.match(result.html, /&lt;img src=x&gt;/);
  assert.doesNotMatch(result.html, /<img/);
  const [narrow] = renderPages([page('start', '| A | B |\n| - | - |\n| 1 | 2 |')]);
  assert.doesNotMatch(narrow.html, /wiki-table-scroll/);
});
