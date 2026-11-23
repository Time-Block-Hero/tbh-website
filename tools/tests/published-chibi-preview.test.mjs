import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
class Element {
  constructor(tag = "div") { this.tag = tag; this.children = []; this.listeners = {}; this.attributes = {}; this.style = {}; this.hidden = false; }
  setAttribute(key, value) { this.attributes[key] = value; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  addEventListener(type, handler, options = {}) {
    this.listeners[type] = handler;
    options.signal?.addEventListener("abort", () => delete this.listeners[type], { once: true });
  }
  fire(type) { this.listeners[type]?.(); }
  getContext() { return {}; }
}
function deferred() { let resolve; const promise = new Promise(r => resolve = r); return { promise, resolve }; }
function harness(options = {}) {
  const stages = [], requests = [], frames = new Map(); let next = 0;
  const entry = { uid: "saved-uid", heightInTiles: 1.87, groundOffsetInTiles: { x:.1,y:.2,z:.3 }, layout: { frames:[], clips:Object.fromEntries(["idle","move","hit","attack","effect"].map((name,i) => [name,{frames:i < 2 ? [i*3,i*3+1,i*3+2] : [i+4],fps:3,loop:i < 2}])) } };
  class Stage {
    constructor() { stages.push(this); this.facing = 1; this.frameIndices = [0,0]; this.disposed = false; this.rendered = 0; }
    reset() {}
    async setActor(index, value) { this.entry = value; if (options.actor) await options.actor(); }
    render() { this.rendered++; }
    dispose() { this.disposed = true; }
  }
  const context = { AbortController, location:{protocol:options.protocol || "http:"}, document:Object.assign(new Element("document"),{hidden:false,createElement:tag=>new Element(tag)}), TbhPaperStage:Stage,
    TbhChibiPublished:{entry:(published,uid)=>{assert.equal(published.kind,"published");assert.equal(uid,"saved-uid");return entry;}},
    fetch:async(url,settings)=>{requests.push({url,settings});return options.response ? options.response() : {ok:true,json:async()=>({kind:"published"})};},
    requestAnimationFrame:callback=>{frames.set(++next,callback);return next;}, cancelAnimationFrame:id=>frames.delete(id)
  };
  vm.runInNewContext(fs.readFileSync(path.join(root,"published-chibi-preview.js"),"utf8"),context);
  const host = new Element();
  return { ...context.TbhPublishedChibiPreview, context, host, stages, requests, frames, entry,
    tick(time) { const pending=[...frames.values()];frames.clear();pending.forEach(callback=>callback(time)); } };
}

test("published preview uses persisted UID and exact calibrated asset, then supports action/pause/flip", async () => {
  const h=harness(), view=h.mount(h.host,{uid:"saved-uid",name:"新名字"});await view.ready;
  assert.equal(h.requests[0].url,"./data/chibi-published.json");assert.equal(h.requests[0].settings.cache,"no-store");
  const stage=h.stages[0];assert.equal(stage.entry,h.entry);assert.equal(stage.compare,false);
  const [select,pause,flip,replay]=h.host.children[1].children;
  select.value="attack";select.fire("change");h.tick(0);h.tick(100);
  assert.equal(stage.action,"attack");assert.equal(stage.frameIndices[0],7);
  pause.fire("click");h.tick(200);const elapsed=stage.elapsed;h.tick(300);assert.equal(stage.elapsed,elapsed);
  flip.fire("click");assert.equal(stage.facing,-1);
  replay.fire("click");h.tick(400);assert.equal(pause.textContent,"暂停");
  view.dispose();assert.equal(stage.disposed,true);assert.equal(h.frames.size,0);assert.equal(pause.listeners.click,undefined);
});

test("disposing during manifest fetch prevents stale stage creation and replacement content", async () => {
  const pending=deferred(),h=harness({response:()=>pending.promise});
  const view=h.mount(h.host,{uid:"saved-uid"});view.dispose();h.host.replaceChildren("next card");
  pending.resolve({ok:true,json:async()=>({kind:"published"})});await view.ready;
  assert.equal(h.requests[0].settings.signal.aborted,true);assert.equal(h.stages.length,0);assert.equal(h.frames.size,0);assert.deepEqual(h.host.children,["next card"]);
});

test("disposing during texture load releases stage and never starts a stale animation", async () => {
  const pending=deferred(),h=harness({actor:()=>pending.promise});const view=h.mount(h.host,{uid:"saved-uid"});
  await new Promise(resolve=>setImmediate(resolve));assert.equal(h.stages.length,1);
  view.dispose();h.host.replaceChildren("next card");pending.resolve();await view.ready;
  assert.equal(h.stages[0].disposed,true);assert.equal(h.frames.size,0);assert.deepEqual(h.host.children,["next card"]);
});

test("verification and missing-manifest errors show no author or historic fallback", async () => {
  for(const options of [{actor:()=>Promise.reject(new Error("PNG 哈希不符"))},{response:()=>({ok:false})},{protocol:"file:"}]) {
    const h=harness(options),view=h.mount(h.host,{uid:"saved-uid"});await view.ready;
    assert.match(h.host.children[0].textContent,/预览暂不可用/);assert.equal(h.frames.size,0);
    assert.ok(h.stages.every(stage=>stage.disposed));assert.ok(h.requests.every(r=>r.url==="./data/chibi-published.json"));
    view.dispose();
  }
});

test("hidden documents suspend the animation loop and resume without catch-up", async () => {
  const h=harness(),view=h.mount(h.host,{uid:"saved-uid"});await view.ready;
  h.tick(0);h.tick(100);const stage=h.stages[0],elapsed=stage.elapsed;
  h.context.document.hidden=true;h.context.document.fire("visibilitychange");assert.equal(h.frames.size,0);
  h.context.document.hidden=false;h.context.document.fire("visibilitychange");assert.equal(h.frames.size,1);
  h.tick(10000);assert.equal(stage.elapsed,elapsed);view.dispose();assert.equal(h.context.document.listeners.visibilitychange,undefined);
});

test("frame selection loops only looping clips and clamps non-looping actions", () => {
  const {frameAt}=harness();assert.equal(frameAt({frames:[0,1,2],fps:3,loop:true},1),0);
  assert.equal(frameAt({frames:[6,7],fps:3,loop:false},100),7);
});

function editorHarness() {
  const ids=["chibiWorkbenchLink","chibiPreviewTab","cardPreviewTab","cardHandPreview","cardChibiPreview","cardEditorOverlay"];
  const nodes=Object.fromEntries(ids.map(id=>[`#${id}`,new Element()]));
  const draft={uid:"parent",id:"OLD-001",cardType:"Minion",nameKey:"未保存的改名",rulesText:"未保存的卡文"},mounted=[];
  const context={console,document:{createElement:tag=>new Element(tag),querySelector:selector=>nodes[selector],body:{style:{}}},TbhPublishedChibiPreview:{mount:(host,card)=>{const item={card,disposed:false,dispose(){this.disposed=true;}};mounted.push(item);return item;}}};
  context.window=context;
  const script=fs.readFileSync(path.join(root,"card-editor.js"),"utf8").replace("  window.initFormalCardEditor =","  globalThis.chibiTest = {renderChibi,selectPreview,closeEditor,readDraft(value){readForm=()=>value;}};\n  window.initFormalCardEditor =");
  vm.runInNewContext(script,context);context.chibiTest.readDraft(draft);
  return {...context.chibiTest,nodes,draft,mounted};
}

test("editor tab switch preserves unsaved form, scopes by UID, and disposes on card/tab/close", () => {
  const h=editorHarness();h.renderChibi(h.draft);assert.equal(h.mounted.length,0);
  h.selectPreview("chibi");assert.equal(h.mounted[0].card.uid,"parent");assert.equal(h.nodes["#cardHandPreview"].hidden,true);
  h.renderChibi({...h.draft,id:"RENUMBERED",nameKey:"其他改名"});assert.equal(h.mounted.length,1);
  assert.equal(h.draft.rulesText,"未保存的卡文");assert.equal(h.nodes["#chibiWorkbenchLink"].href,"./chibi.html?unit=parent");
  h.renderChibi({...h.draft,uid:"derivative"});assert.equal(h.mounted[0].disposed,true);assert.equal(h.mounted[1].card.uid,"derivative");
  h.selectPreview("card");assert.equal(h.mounted[1].disposed,true);
  h.selectPreview("chibi");h.closeEditor();assert.equal(h.mounted[2].disposed,true);assert.equal(h.nodes["#cardEditorOverlay"].style.display,"none");
});

test("spell switch removes Chibi availability and resets to card preview", () => {
  const h=editorHarness();h.selectPreview("chibi");h.renderChibi({...h.draft,cardType:"Spell"});
  assert.equal(h.mounted[0].disposed,true);assert.equal(h.nodes["#chibiPreviewTab"].hidden,true);assert.equal(h.nodes["#chibiWorkbenchLink"].hidden,true);assert.equal(h.nodes["#cardHandPreview"].hidden,false);
  h.renderChibi(h.draft);assert.equal(h.mounted.length,1);assert.equal(h.nodes["#chibiPreviewTab"].hidden,false);
});
