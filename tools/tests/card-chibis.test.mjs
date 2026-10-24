import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { syncCardChibis, validateChibiLayout, rosterPath } from "../sync-card-chibis.mjs";
import { buildEditorFallback } from "../card-editor-fallback.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const uid = "11111111-1111-4111-8111-111111111111", missingUid = "22222222-2222-4222-8222-222222222222";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "tbh-chibi-"));
  t.after(() => fs.rmSync(directory, { recursive:true, force:true }));
  const presentation = path.join(directory, "presentation"), website = path.join(directory, "website");
  fs.mkdirSync(path.join(presentation, "Runtime/VisualAssets/Chibi/Textures", uid), { recursive:true });
  fs.mkdirSync(path.join(website, "data"), { recursive:true }); fs.mkdirSync(path.join(website, "card_layout_ref"));
  const cards = { cards:[{ uid, id:"OLD-001", nameKey:"角色", cardType:"Minion" }] };
  fs.writeFileSync(path.join(website, "data/cards.json"), JSON.stringify(cards)); fs.writeFileSync(path.join(website, "card_layout_ref/layout.json"), "{}");
  const atlas = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4d8AAAAASUVORK5CYII=", "base64");
  const layout = { schemaVersion:1, sourceWidth:1, sourceHeight:1, columns:3, rows:4, frames:Array.from({ length:12 }, () => ({ rect:{ x:0,y:0,width:1,height:1 }, pivot:{ x:.5,y:0 } })), clips:Object.fromEntries(["idle","move","hit","attack","effect","rare"].map((n) => [n, { frames:[0,1,2], fps:8, loop:n === "idle" }])) };
  const layoutBytes = Buffer.from(JSON.stringify(layout));
  const entry = { uid, atlasPath:`Runtime/VisualAssets/Chibi/Textures/${uid}/atlas.png`, layoutPath:`Runtime/VisualAssets/Chibi/Textures/${uid}/layout.json`, atlasSha256:hash(atlas), layoutSha256:hash(layoutBytes), frameCount:12, status:"provisional" };
  fs.writeFileSync(path.join(presentation, entry.atlasPath), atlas); fs.writeFileSync(path.join(presentation, entry.layoutPath), layoutBytes);
  const writeRoster = (entries) => fs.writeFileSync(path.join(presentation, rosterPath), JSON.stringify({ schemaVersion:1,entries })); writeRoster([entry]);
  const git = (...args) => execFileSync("git", ["-C", presentation, ...args], { encoding:"utf8", stdio:["ignore","pipe","pipe"] }).trim(); git("init");
  const save = () => { git("add", "."); git("-c","user.name=Test","-c","user.email=test@example.invalid","commit","-qm","fixture"); return git("rev-parse","HEAD"); };
  return { presentation,root:website,commit:save(),save,writeRoster,entry,layout,cards };
}

test("Chibi sync reads pinned Presentation content, mirrors atlas/layout and retains offline manifest", (t) => {
  const f = fixture(t), before = fs.readFileSync(path.join(f.root, "data/cards.json"));
  assert.equal(syncCardChibis(f).count, 1);
  const manifest = JSON.parse(fs.readFileSync(path.join(f.root, "data/card-chibis.json")));
  assert.equal(manifest.source.commit, f.commit); assert.equal(manifest.coverage.available, 1);
  f.writeRoster([]); fs.writeFileSync(path.join(f.presentation, f.entry.atlasPath), "dirty working file");
  assert.equal(syncCardChibis({ ...f,check:true }).count, 1); // Reads selected Git blob, not uncommitted work.
  assert.ok(fs.readFileSync(path.join(f.root,"data/cards.json")).equals(before));
  const context = { window:{} }; vm.runInNewContext(buildEditorFallback(f.root, {}, {}), context);
  assert.equal(context.window.__CARD_EDITOR_FALLBACK__.chibis.entries[0].uid, uid);
  fs.appendFileSync(path.join(f.root,manifest.entries[0].atlasSrc), "tampered");
  assert.throws(() => syncCardChibis({ ...f,check:true }), /镜像不一致/);
});

test("Chibi sync rejects missing/duplicate/unknown identities and path/hash corruption before publication", (t) => {
  const f = fixture(t);
  for (const [entries, expected] of [[[],/缺少 1/],[[f.entry,f.entry],/重复/],[[{ ...f.entry,uid:missingUid }],/未知/],[[{ ...f.entry,atlasPath:"../../secret" }],/路径/],[[{ ...f.entry,atlasSha256:"0".repeat(64) }],/SHA-256/]]) {
    f.writeRoster(entries); f.commit = f.save(); assert.throws(() => syncCardChibis(f), expected);
    assert.equal(fs.existsSync(path.join(f.root,"data/card-chibis.json")),false);
  }
  f.writeRoster([]); f.commit=f.save(); assert.equal(syncCardChibis({ ...f,allowMissing:true }).missing.length,1);
});

test("layout contract rejects invalid dimensions, pivots, frame coordinates and missing rare clip", () => {
  const base={sourceWidth:300,sourceHeight:400,columns:3,rows:4,frames:Array.from({length:12},()=>({rect:{x:0,y:0,width:100,height:100},pivot:{x:.5,y:0}})),clips:Object.fromEntries(["idle","move","hit","attack","effect","rare"].map(n=>[n,{frames:[0],fps:8,loop:true}]))};
  validateChibiLayout(base,300,400);
  const invalids=[{...base,sourceWidth:301},{...base,frames:base.frames.slice(1)},{...base,clips:{...base.clips,rare:null}}];
  const outOfBounds=structuredClone(base);outOfBounds.frames[0].rect.x=290;invalids.push(outOfBounds);
  const invalidPivot=structuredClone(base);invalidPivot.frames[0].pivot.y=-.1;invalids.push(invalidPivot);
  const badClip=structuredClone(base);badClip.clips.rare.frames=[12];invalids.push(badClip);
  for(const invalid of invalids)assert.throws(()=>validateChibiLayout(invalid,300,400));
});

test("preview uses Unity bottom-left source coordinates and bounded non-loop clips", () => {
  const context={};vm.runInNewContext(fs.readFileSync(path.join(root,"chibi-preview.js"),"utf8"),context);
  const preview=context.TbhChibiPreview;
  const rect=preview.sourceRect({sourceHeight:400,frames:[{rect:{x:20,y:250,width:80,height:90}}]},0);
  assert.equal(rect.y,60);assert.equal(rect.x,20);
  assert.equal(preview.frameAt({frames:[0,1,2,1],fps:8,loop:true},.5),0);
  assert.equal(preview.frameAt({frames:[9,10,11],fps:8,loop:false},20),11);
});

function editorHarness() {
  const node=()=>({hidden:false,attributes:{},dataset:{},setAttribute(k,v){this.attributes[k]=v;}});
  const hand=node(),chibi=node(),tabs=["card","chibi"].map(name=>Object.assign(node(),{dataset:{previewTab:name}})),form={value:"尚未保存的卡文"};
  const context={console,document:{createElement:()=>({getContext:()=>({})}),querySelector:s=>({"#cardHandPreview":hand,"#cardChibiPreview":chibi,"#cardEditorForm":form})[s],querySelectorAll:()=>tabs},TbhChibiPreview:{mount(host,entry,name){host.entry=entry;host.name=name;},message(host,text){host.message=text;}}};context.window=context;
  const script=fs.readFileSync(path.join(root,"card-editor.js"),"utf8").replace("  window.initFormalCardEditor =","  globalThis.chibiTest = {renderChibi,selectPreviewTab,load:v=>chibis=v};\n  window.initFormalCardEditor =");
  vm.runInNewContext(script,context);return{...context.chibiTest,hand,chibi,tabs,form};
}

test("editor Chibi lookup uses UID and tab switching preserves unsaved form",()=>{
  const h=editorHarness();h.load({entries:[{uid,atlasSrc:`./assets/card-chibis/${uid}/atlas.png`}]});
  h.renderChibi({uid,id:"CHANGED-999",nameKey:"重命名",cardType:"Minion"});assert.equal(h.chibi.entry.uid,uid);
  h.selectPreviewTab("chibi");assert.equal(h.hand.hidden,true);assert.equal(h.tabs[1].attributes["aria-selected"],"true");
  h.selectPreviewTab("card");assert.equal(h.form.value,"尚未保存的卡文");
  h.renderChibi({uid,cardType:"Spell"});assert.match(h.chibi.message,/此类型不使用/);
  h.renderChibi({uid:missingUid,cardType:"Minion"});assert.equal(h.chibi.entry,undefined);
});

test("direct-file editor initialization uses Chibi fallback without fetching",async()=>{
  const manifest={entries:[{uid}]},dataset=JSON.parse(fs.readFileSync(path.join(root,"data/cards.json")));
  const context={console,structuredClone,document:{createElement:()=>({getContext:()=>({})})},localStorage:{getItem:()=>null},fetch:()=>{throw new Error("must not fetch");},location:{protocol:"file:"},__CARD_EDITOR_FALLBACK__:{cards:dataset,layout:{},chibis:manifest}};context.window=context;
  const script=fs.readFileSync(path.join(root,"card-editor.js"),"utf8").replace("  window.initFormalCardEditor =",`populateFactionInputs=()=>{};populateTribeInputs=()=>{};bindEvents=()=>{};renderGallery=()=>{};normalizeDatasetForCurrentRules=()=>false;loadLocalState=v=>v;readLocalState=()=>null;setStatus=()=>{};globalThis.offlineTest={initialize,getChibis:()=>chibis};\n  window.initFormalCardEditor =`);
  vm.runInNewContext(script,context);await context.offlineTest.initialize();assert.deepEqual(context.offlineTest.getChibis(),manifest);
});
