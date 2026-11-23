import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import test from "node:test";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const uid = "11111111-1111-4111-8111-111111111111";

test("direct-file editor initialization retains card fallback without fetching old Chibi",async()=>{
  const manifest={entries:[{uid}]},dataset=JSON.parse(fs.readFileSync(path.join(root,"data/cards.json")));
  const context={console,structuredClone,URLSearchParams,document:{createElement:()=>({getContext:()=>({})})},localStorage:{getItem:()=>null},fetch:()=>{throw new Error("must not fetch");},location:{protocol:"file:",search:`?unit=${dataset.cards[0].uid}`},__CARD_EDITOR_FALLBACK__:{cards:dataset,layout:{},chibis:manifest}};context.window=context;
  const script=fs.readFileSync(path.join(root,"card-editor.js"),"utf8").replace("  window.initFormalCardEditor =",`openEditor=id=>globalThis.openedCardId=id;populateFactionInputs=()=>{};populateTribeInputs=()=>{};bindEvents=()=>{};renderGallery=()=>{};normalizeDatasetForCurrentRules=()=>false;loadLocalState=v=>v;readLocalState=()=>null;setStatus=()=>{};globalThis.offlineTest={initialize,getDataset:()=>dataset};\n  window.initFormalCardEditor =`);
  vm.runInNewContext(script,context);await context.offlineTest.initialize();assert.equal(context.offlineTest.getDataset().cards.length,dataset.cards.length);assert.equal(context.openedCardId,dataset.cards[0].id);
});
