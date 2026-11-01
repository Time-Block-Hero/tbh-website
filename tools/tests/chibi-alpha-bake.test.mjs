import test from "node:test";
import vm from "node:vm";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import { bakeAtlas, readRgbaPng, pngChunk, PROCESSING_VERSION } from "../chibi-alpha-bake.mjs";
import { compileBundle, hash } from "../export-chibi-workbench.mjs";
import { publishBundle, checkPublished } from "../publish-chibi-workbench.mjs";
import P from "../../chibi-published-client.js";
import C from "../../chibi-workbench-contract.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const base = JSON.parse(fs.readFileSync(path.join(root, "data/chibi-review.json"))).baseline;
function png(width = 4, height = 3) {
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) raw.set([x * 20, y * 40, 93, 255], y * (width * 4 + 1) + 1 + x * 4);
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), pngChunk("IHDR", header), pngChunk("sRGB", Buffer.from([0])), pngChunk("IDAT", deflateSync(raw)), pngChunk("IEND", Buffer.alloc(0))]);
}
test("alpha bake uses bottom-left frame coordinates, preserves RGB and metadata, and leaves other pixels exact", () => {
  const source = png(), layout = { sourceWidth: 4, sourceHeight: 3, frames: [{ rect: {x:1,y:0,width:2,height:3}, excludedRects: [{x:0,y:1,width:1,height:2}] }] };
  const result = bakeAtlas(source, layout), before = readRgbaPng(source), after = readRgbaPng(result.bytes);
  assert.deepEqual(result.processing, {version:PROCESSING_VERSION,alphaClearedPixels:2,exclusionRectCount:1,repairs:[{frameIndex:0,rect:{x:0,y:1,width:1,height:2}}]});
  for(let y=0;y<3;y++) for(let x=0;x<4;x++) for(let c=0;c<4;c++) {
    const i=(y*4+x)*4+c; assert.equal(after.pixels[i],x===1&&y<2&&c===3?0:before.pixels[i]);
  }
  assert.deepEqual(after.chunks.filter(c=>c.type!=="IDAT"),before.chunks.filter(c=>c.type!=="IDAT"));
  assert.equal(result.layout.frames[0].excludedRects,undefined);
  assert.equal(layout.frames[0].excludedRects.length,1);
  assert.deepEqual(bakeAtlas(source,layout).bytes,result.bytes);
});
test("unmasked atlases retain every source byte and empty exclusions are removed from layout", () => {
  const source = png(), result=bakeAtlas(source,{frames:[{excludedRects:[]}]});
  assert.equal(result.bytes,source);assert.equal(result.processing.alphaClearedPixels,0);assert.equal(result.processing.exclusionRectCount,0);assert.deepEqual(result.layout.frames,[{}]);
});
test("overlapping frame reuse and fractional or out-of-frame repair rectangles fail closed", () => {
  const source=png(), frame={rect:{x:0,y:0,width:4,height:3},excludedRects:[{x:1,y:1,width:1,height:1}]};
  assert.throws(()=>bakeAtlas(source,{sourceWidth:4,sourceHeight:3,frames:[frame,{rect:{x:1,y:1,width:1,height:1}}]}),/共享像素/);
  for(const cut of [{x:.5,y:1,width:1,height:1},{x:3,y:1,width:2,height:1},{x:1,y:-1,width:1,height:1}]) assert.throws(()=>bakeAtlas(source,{frames:[{...frame,excludedRects:[cut]}]}),/整数像素/);
});
test("decoder refuses corruption, truncated or oversized PNG instead of publishing uncertain pixels", () => {
  const source=png(), corrupt=Buffer.from(source);corrupt[42]^=1;
  assert.throws(()=>readRgbaPng(corrupt),/CRC/);assert.throws(()=>readRgbaPng(source.subarray(0,source.length-2)),/截断|结构/);
  const large=png(5000,1), header=Buffer.from(large.subarray(16,29));header.writeUInt32BE(5000,4);
  const bomb=Buffer.concat([large.subarray(0,8),pngChunk("IHDR",header),large.subarray(33)]);
  assert.throws(()=>readRgbaPng(bomb),/4096/);
});
test("golden source stays immutable and only the confirmed detached effect fragment is alpha-cleared", () => {
  const bytes=fs.readFileSync(path.join(root,base.atlasSrc)),result=bakeAtlas(bytes,base.layout),before=readRgbaPng(bytes),after=readRgbaPng(result.bytes);
  let changed=0;const f=base.layout.frames[8],cut=f.excludedRects[0];
  for(let i=0;i<before.pixels.length;i++) if(before.pixels[i]!==after.pixels[i]) {
    assert.equal(i%4,3);assert.equal(after.pixels[i],0);const p=Math.floor(i/4),x=p%before.width,y=before.height-1-Math.floor(p/before.width);
    assert.ok(x>=f.rect.x+cut.x&&x<f.rect.x+cut.x+cut.width&&y>=f.rect.y+cut.y&&y<f.rect.y+cut.y+cut.height);changed++;
  }
  assert.ok(changed>0);assert.equal(changed,result.processing.alphaClearedPixels);assert.equal(hash(fs.readFileSync(path.join(root,base.atlasSrc))),base.atlasSha256);
});
test("published snapshot uses exact game units and immutable derived URLs, verifies pixels and refuses stale configuration", t => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"tbh-chibi-publish-"));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  fs.mkdirSync(path.join(dir,"data"));fs.mkdirSync(path.join(dir,"assets/chibi-review/golden"),{recursive:true});
  const image=fs.readFileSync(path.join(root,base.atlasSrc));fs.writeFileSync(path.join(dir,base.atlasSrc),image);
  const config=JSON.parse(fs.readFileSync(path.join(root,"data/chibi-workbench.json"))),dataset={...config,entries:config.entries.filter(e=>e.uid===base.uid)};
  fs.writeFileSync(path.join(dir,"data/cards.json"),JSON.stringify({cards:[{uid:base.uid,id:"SA-000",nameKey:"洛岚",cardType:"Minion"}]}));
  fs.writeFileSync(path.join(dir,"data/chibi-review.json"),JSON.stringify({schemaVersion:1,baseline:base,entries:[]}));fs.writeFileSync(path.join(dir,"data/chibi-workbench.json"),JSON.stringify(dataset));
  const bundle=compileBundle(dir),published=publishBundle(dir,bundle);assert.equal(published.schemaVersion,2);assert.deepEqual(published.units,bundle.manifest.units);
  assert.equal(published.units[0].sourceAtlasSha256,base.atlasSha256);assert.notEqual(published.units[0].atlasSha256,base.atlasSha256);
  assert.deepEqual(checkPublished(dir,bundle),published);assert.equal(P.entry(published,base.uid).verifyAtlasSha256,true);
  const before=fs.readFileSync(path.join(dir,"data/chibi-published.json"));
  const bad=structuredClone(bundle);bad.images[0].bytes=Buffer.alloc(1);assert.throws(()=>publishBundle(dir,bad),/哈希/);assert.deepEqual(fs.readFileSync(path.join(dir,"data/chibi-published.json")),before);
  dataset.entries[0].scale+=.1;fs.writeFileSync(path.join(dir,"data/chibi-workbench.json"),JSON.stringify(dataset));assert.throws(()=>checkPublished(dir),/重新发布/);
  assert.equal(hash(fs.readFileSync(path.join(dir,base.atlasSrc))),base.atlasSha256);
});
test("static browser download wraps the exact published unit and atlas in a valid tar", async () => {
  const atlas=new Uint8Array([1,2,3,4]),blob=P.tar([{name:"manifest.json",bytes:new TextEncoder().encode('{"schemaVersion":2}')},{name:"atlases/example.png",bytes:atlas}]),bytes=Buffer.from(await blob.arrayBuffer());
  assert.equal(bytes.toString("ascii",0,13),"manifest.json");assert.equal(bytes.toString("ascii",1024,1043),"atlases/example.png");assert.deepEqual(bytes.subarray(1536,1540),Buffer.from(atlas));assert.equal(bytes.length%512,0);
});

test("published preview never reuses an unverified author texture with the same URL and hash", async () => {
  let verifiedReads=0;class FakeImage { addEventListener(){} set src(value){queueMicrotask(()=>this.onload());} }
  const context={Image:FakeImage,URL:{createObjectURL:()=>"blob:test",revokeObjectURL(){}},Blob,TbhChibiPublished:{imageBytes:async()=>{verifiedReads++;return new ArrayBuffer(4);}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,"chibi-review-renderer.js"),"utf8"),context);
  const gl={createTexture:()=>({}),bindTexture(){},pixelStorei(){},texImage2D(){},texParameteri(){},deleteTexture(){}};
  const stage={actors:[],textures:new Map(),gl,disposed:false},entry={atlasSrc:"./assets/chibi-review/example/atlas.png",atlasSha256:"a".repeat(64),layout:{}};
  await context.TbhPaperStage.prototype.setActor.call(stage,0,entry);
  await context.TbhPaperStage.prototype.setActor.call(stage,0,{...entry,verifyAtlasSha256:true});
  assert.equal(verifiedReads,1);assert.equal(stage.textures.size,2);
  await context.TbhPaperStage.prototype.setActor.call(stage,0,{...entry,verifyAtlasSha256:true});assert.equal(verifiedReads,1);
});

test("changing only an author repair rectangle makes the old published pixels stale", () => {
  const config=JSON.parse(fs.readFileSync(path.join(root,"data/chibi-workbench.json"))),entry=config.entries.find(e=>e.uid===base.uid),resolved=C.resolve(base,entry,config.defaults),baked=bakeAtlas(fs.readFileSync(path.join(root,base.atlasSrc)),resolved.layout);
  const unit={...resolved,layout:baked.layout,sourceAtlasSha256:base.atlasSha256,processing:baked.processing};
  assert.equal(P.current(unit,base,resolved,C.stableStringify),true);
  const changed=structuredClone(resolved);changed.layout.frames[8].excludedRects[0].width-=1;
  assert.equal(P.current(unit,base,changed,C.stableStringify),false);
});
