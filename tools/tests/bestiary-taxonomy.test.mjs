import test from 'node:test';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const w={};const ctx={window:w};
for(const file of ['bestiary-data.js','bestiary-taxonomy.js','bestiary-card-sources.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
const {races,entries,aliases}=w.TBH_BESTIARY_CATALOG;
const plain=x=>JSON.parse(JSON.stringify(x));
test('six race parents contain 23 uniquely identified branches and no umbrella siblings',()=>{
 assert.deepEqual(plain(races.map(r=>r.zh)),['奇兽','机械','晶灵','兽裔','星云生命','灾厄生命']);
 assert.equal(entries.length,23);assert.equal(new Set(entries.map(e=>e.id)).size,23);
 for(const r of races)assert.ok(entries.some(e=>e.raceId===r.id));
 for(const e of entries)assert.ok(races.some(r=>r.id===e.raceId));
 for(const old of Object.keys(aliases))assert.ok(!entries.some(e=>e.id===old));
 const covered=new Set([...races.map(r=>r.sourceId),...entries.map(e=>e.sourceId)]);
 for(const s of w.TBH_BESTIARY_RECORDS)assert.ok(covered.has(s.id),s.id);
});
test('missing branches have no invented images or anatomical standards',()=>{
 for(const id of ['fox-avatar','elven-avatar','bear-nebula','primordial-sun']){
  const e=entries.find(e=>e.id===id);assert.equal(e.designStatus,'incomplete');assert.equal(e.illustration,null);assert.equal(e.concept,null);assert.equal(e.traits.zh.length,0);assert.ok(e.gaps.zh.length);
 }
});
test('all four calamity branches preserve their distinct source forms and concept sheets',()=>{
 const original=w.TBH_BESTIARY_RECORDS.find(r=>r.id==='hollow-null');
 const split=entries.filter(e=>e.raceId==='calamity');assert.equal(split.length,4);
 for(const e of split){const f=original.knownForms.find(f=>f.zhName===e.sourceFormName);assert.ok(f);assert.equal(e.summary.zh,f.zhDescription);assert.equal(e.summary.en,f.enDescription);assert.equal(e.concept,f.concept);assert.ok(fs.existsSync(path.join(root,e.concept)));}
});
test('card reference snapshot resolves by artwork key to current selected art and exact source brief',()=>{
 const data=JSON.parse(fs.readFileSync(path.join(root,'data/cards.json'),'utf8'));
 for(const e of entries)for(const key of e.sourceArtworkKeys||[]){
  const matches=data.cards.filter(c=>c.artworkKey===key);assert.equal(matches.length,1);const c=matches[0],snapshot=w.TBH_BESTIARY_CARD_SOURCES[key];
  assert.equal(snapshot.name,c.nameKey);assert.equal(snapshot.description,c.artDescription);assert.equal(snapshot.descriptionHash,createHash("sha256").update(c.artDescription).digest("hex"));assert.equal(e.sourceBriefHashes[key],snapshot.descriptionHash,"Branch traits need review after source brief changes");const selected=data.artworkVariants[c.id].find(v=>v.id===data.selectedArtworkIds[c.id]);assert.equal(snapshot.image,selected.src);assert.ok(fs.existsSync(path.join(root,snapshot.image)));
 }
 assert.equal(w.TBH_BESTIARY_CARD_SOURCES['orbital-crystal-spirit'].name,'轨道晶灵');
});
test('legacy bestiary routes accept new branch and race identities',()=>{
 for(const file of ['bestiary.html','bestiary-en.html'])for(const id of ['flying-hollow-null','race:avatar','hollow-null']){
  let url;const html=fs.readFileSync(path.join(root,file),'utf8');const script=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(script,{window:w,URL,URLSearchParams,location:{href:'http://localhost/'+file,search:'?creature='+encodeURIComponent(id),hash:'',replace:v=>url=new URL(v)}});
  assert.equal(url.searchParams.get('creature'),id);assert.equal(url.hash,'#bestiary');
 }
});
