import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {toAuthoringDocument,validateProductionExecution,selectPlaytestDataset,designHash} from '../card-execution.mjs';
import {validateSourceRevision} from '../card-design-source-revision.mjs';
const read=p=>fs.readFileSync(new URL(`../../${p}`,import.meta.url));
const source=JSON.parse(read('data/cards.json'));
const selected=selectPlaytestDataset(source);
const byUid=new Map(selected.cards.map(c=>[c.uid,c]));
// Stable event identities; display IDs may be reordered by the editor.
const eventUids={
  "001": "8ead8093-b6b8-410e-8205-eb63d84e8510",
  "002": "e18883e3-aef2-40f7-8536-a16f327aab2c",
  "003": "18a4ed18-36fe-42cb-8b04-3f605b45cd3d",
  "004": "3e9dea48-ea0a-43ad-b8fd-a40b866fdf57",
  "005": "ceb7e757-9a7a-4ca2-b287-d9a908d24fb6",
  "006": "f43c1179-c606-4876-892f-991f24c881db",
  "007": "f9b996dd-a425-44cd-b9d2-e9507f46fb20",
  "008": "d9c97499-7382-49de-b277-80633c541fbb",
  "009": "a886c5bc-e4f2-4f37-9f8e-6ab7d3163d36",
  "010": "d5611e4b-7f60-40cb-babe-0401a06655fa",
  "011": "e62eecf3-40ec-44c5-b4eb-11b002a4d872",
  "012": "ad3f2441-3a3d-4427-b5cb-0964eb64d21b",
  "013": "62e1b531-f9f8-44b2-87b0-56c705cf2f74",
  "014": "5aa0fa68-0a7f-4baf-881e-47f4584ec034",
  "015": "8e7ccd51-3b89-43a6-80fa-6b279a43b237",
  "016": "e4ebcb4d-46f4-4f71-938e-991d683946d7",
  "017": "f5c462d3-72ef-4681-9a72-153606f7992f",
  "018": "91522169-f0ca-44ab-913a-32ab928fcf1b",
  "019": "2dc5bf17-996e-4b08-b2ce-ee1b293f4f62",
  "020": "d51e55e0-9165-4007-b4ff-ba0f2ef9c219",
  "021": "f8b2caa5-486f-43fb-8edb-eb26793a1244",
  "022": "f68f43ba-287a-4062-8bab-2aac6bc2a777",
  "023": "ae3aea5c-b5c5-4fcf-8af6-3aafbab0eea6",
  "024": "c9c59ee2-4230-40c6-9a59-0f23ed62a698",
  "025": "ad8238ae-fe70-4526-a978-f0907f933d34",
  "026": "193040b4-77e0-410b-b19e-4d06f280784a",
  "027": "68896fec-dc48-4207-9cd2-a1884bfabb6b",
  "028": "8fe52927-b733-43ee-b2e2-2d933b0a41d7",
  "029": "dfb6156a-61d5-4929-83ab-951c0acb1288",
  "030": "47fc19e5-2954-4473-a4e1-b037a171631c",
  "031": "4ed672eb-2423-4d97-b2fc-9f2bede70afc",
  "032": "73a6604d-68d6-4e08-b0a1-4357cf8e3e02",
  "033": "dc1d8667-a035-4699-ab8e-a019d9fd8d79",
  "034": "3ab4140d-6887-459b-8d54-18ea2e45b9e9",
  "035": "a8ee2808-a01b-4e0c-9b93-cd9f7c27ee59",
  "037": "dda7b0e4-5a5f-47b0-b6a0-18ca7f743b21"
};
const nodes=x=>x&&typeof x==='object'?[x,...Object.values(x).flatMap(nodes)]:[];
const values=(id,kind)=>nodes(byUid.get(id).execution).filter(n=>n.call?.name==='EffectValue'&&n.call.metadata.kind===kind).map(n=>n.call.args[0]);
const applies=(id,pkg)=>nodes(byUid.get(id).execution).filter(n=>n.apply?.package===pkg).map(n=>n.apply.args);
const author=()=>toAuthoringDocument(source,{contentId:'test',contentVersion:'overhaul22'});

test('approved identity inventory and bound selection admit exactly 52 originals, 51 upgrades and 36 events',()=>{
 assert.equal(source.cards.length,242);
 const bridgeBytes=read('data/card-identity-migration.json');
 validateSourceRevision(read('data/card-design-source-revision.json'),bridgeBytes,JSON.parse(bridgeBytes),source);
 assert.equal(selected.cards.length,139);
 assert.deepEqual(selected.cards.map(c=>c.uid).sort(),JSON.parse(read('tools/tests/fixtures/issue167-playtest139-uids.json')));
 assert.deepEqual(selected.cards.filter(c=>c.cardType==='Event').map(c=>c.uid).sort(),Object.values(eventUids).sort());
 const originals=new Map(source.cards.map(c=>[c.uid,c]));
 for(const c of source.cards){
  const ready=(originals.get(c.upgradeOfUid)||c).playtestReady;
  assert.equal(byUid.has(c.uid),ready,c.uid);
 }
 assert.equal(selected.cards.filter(c=>c.upgradeOfUid).length,51);
 assert.equal(selected.cards.filter(c=>c.cardType==='Event').length,36);
 assert.equal(selected.cards.filter(c=>!c.upgradeOfUid&&c.cardType!=='Event').length,52);
 assert.equal(selected.cards.filter(c=>c.collectable&&c.classId==='Neutral').length,42);
 assert.equal(selected.cards.filter(c=>c.collectionKind==='Hero').length,4);
});

test('November approved inventory rejects undeclared additions, deletions and an edited approval record',()=>{
 const bridgeBytes=read('data/card-identity-migration.json'),bridge=JSON.parse(bridgeBytes);
 const revision=read('data/card-design-source-revision.json');
 const verify=(dataset,record=revision)=>validateSourceRevision(record,bridgeBytes,bridge,dataset);
 const missing=structuredClone(source);missing.cards.pop();
 assert.throws(()=>verify(missing),/expected UID missing/);
 const addition=structuredClone(source);addition.cards.push({...addition.cards[0],uid:'00000000-0000-4000-8000-000000000001'});
 assert.throws(()=>verify(addition),/outside approved source revision/);
 const record=JSON.parse(revision);record.expectedUids.pop();
 assert.throws(()=>verify(missing,JSON.stringify(record)),/differs from the approved identity/);
 const reordered=structuredClone(source);reordered.cards.reverse();
 for(let i=0;i<reordered.cards.length;i++)reordered.cards[i].id=`TEST-${i}`;
 assert.doesNotThrow(()=>verify(reordered));
});
test('all selected effects retain reviewed hashes and production execution validation',()=>{
 validateProductionExecution(source);
 for(const c of selected.cards)assert.equal(c.execution.reviewedDesignHash,designHash(c),c.uid);
});
test('schema22 upgrade links, hero exclusions, disruption exclusion and costless events are structural',()=>{
 const doc=author();assert.equal(doc.schemaVersion,22);
 const cards=doc.cardBundles.map(b=>b.card),byUid=new Map(cards.map(c=>[c.uid,c]));
 for(const c of cards){
  if(c.upgradeOfUid){assert.equal(byUid.get(c.upgradeOfUid).tripleUpgradeUid,c.uid);assert.equal(c.canTriple,false);}
  if(c.collectionKind==='Hero'||c.cardType==='Event'||c.cardType==='Resource')assert.equal(c.canTriple,false);
  if(c.cardType==='Event'){assert.equal(c.costAmount,0);assert.equal(c.collectable,false);}
 }
 assert.equal(cards.filter(c=>c.collectionKind==='Hero').length,8);
 assert.equal(cards.filter(c=>c.collectionKind==='Hero'&&!c.upgradeOfUid).length,4);
 for(const id of ['85fa412a-ca02-420f-8d4a-1f5f6b4cc56c','032a44b1-bc3c-474a-b326-c6e4681e6f55'])assert.equal(cards.find(c=>c.uid===id).selfCellSupport,1);
 const fire=cards.find(c=>c.uid==='11c4a471-c45c-4055-b1a7-a335f6833976');assert.equal(fire.canTriple,false);assert.equal(fire.tripleUpgradeUid,null);
 const dog=cards.find(c=>c.uid==='c1032302-69f7-45be-8b84-43e574c8aad5');assert.deepEqual(dog.arrows,['E']);assert.deepEqual(dog.arrowRules,[]);
 assert.deepEqual(cards.filter(c=>c.eventUnique).map(c=>c.uid).sort(),['d9c97499-7382-49de-b277-80633c541fbb','193040b4-77e0-410b-b19e-4d06f280784a'].sort());
});
test('reviewed balance changes alter actual Plan amounts and quotas, not only review hashes',()=>{
 for(const [id,kind,n]of[['df060f7e-59a2-4f3b-8a60-572fbed47dec','Damage',3],['fe9569d6-b84c-4fe5-bcd4-03054d21ded5','Attribute',1],['15ce0bd0-83ad-413b-9cc1-829390efaef4','Heal',3],['619301f9-72b0-4f86-a36c-e55046d138f5','Armor',5],['df4f769d-486c-4233-a0ca-f1827c7521c4','Heal',3],['2fe2a799-7add-4d00-bc41-b3c61792e7c4','Heal',6],['bb527e34-62c6-4fa5-abaf-83be062a01c1','Damage',8],['793190df-3f0c-47d3-ba3d-d918f11badd8','Star',12]]){
  const found=values(id,kind);assert.ok(found.length,id);assert.ok(found.every(v=>v===n),id);
 }
 for(const [id,n]of[['3b4ba62f-c700-4411-8c51-a901df1cb57c',1],['fca9f475-1780-48a6-842e-78f7c8b0efaf',2]])assert.ok(nodes(byUid.get(id).execution).filter(n=>n.select?.saveAs==='grids').every(node=>node.select.policy.max===n));
 assert.equal(byUid.get('0f892f9f-1ef4-4c5b-9a9a-1eeba1b34454').execution.continuousEffects[0].activeCondition.maximum,1);
 assert.equal(byUid.get('37516551-30e2-46d9-9e16-74d4e48c9fcf').execution.continuousEffects[0].activeCondition.maximum,2);
 assert.equal(applies('97538b9d-68f1-4a74-861c-3b6a517890ba','ScheduleBody')[0].timing,'EndOfCurrentRound');
 assert.equal(applies('f8933c68-37ce-4ae5-b3a2-de47524fc5ce','ScheduleBody').length,0);
 assert.deepEqual(applies('16cfac2a-e12e-4909-b8e6-e1668e279964','ModifyUnitAttribute').map(a=>[a.operation,a.amount]),[['Set',0]]);
 assert.equal(byUid.get('150b28b4-62e2-4e84-9008-ffbd5dce8318').execution.abilities[0].usage.maxActivations,2);
 for(const id of ['fe9569d6-b84c-4fe5-bcd4-03054d21ded5','225d6de7-b416-479c-9268-e36699168649'])assert.deepEqual(applies(id,'ModifierBatch')[0].items.map(i=>i.stat),['Attack','Move','Health']);
});
test('cargo grants refresh instead of slots, scanner produces correct form, fruit restores allowance',()=>{
 for(const [id,n]of[['774620fa-d879-4c02-8c43-bde70f4c2bb3',1],['0bd5e5be-fb41-48b4-80a0-f839e50afcad',2]]){
  assert.deepEqual(applies(id,'ShopService'),[{operation:'GrantRefresh',amount:n}]);
  assert.ok(!nodes(byUid.get(id).execution).some(n=>n.type==='ShopSlot'));
  assert.equal(byUid.get(id).execution.continuousEffects[0].activeCondition.phase,'Shop');
 }
 assert.equal(applies('a3963260-514a-4ea9-a5a9-65fb307d6b2f','CreateCard')[0].cardId,byUid.get('2a9ae6c4-8a4a-4862-9cca-0f5113b27d18').uid);
 for(const [id,n]of[['a463123c-664c-427e-b079-c60d79dd60c9',2],['6dcfd207-d3f1-443e-a460-6b35e00fc161',3]]){
  const movement=applies(id,'ModifyUnitAttribute').find(a=>a.attribute==='RemainingMovement');assert.equal(movement.amount.call.args[0],n);
  assert.equal(applies(id,'AddModifier').length,0);
 }
});
test('event plans preserve discount scopes, FIFO filters, permanent growth and once-arrow configuration',()=>{
 for(const [id,op]of[['005','DiscountCurrent'],['006','DiscountCurrent'],['007','DiscountRound'],['021','FreeNextRefresh']])assert.equal(applies(eventUids[id],'ShopService')[0].operation,op);
 assert.equal(applies('2dc5bf17-996e-4b08-b2ce-ee1b293f4f62','ShopService')[0].costLessThan,3);
 assert.equal(applies('d51e55e0-9165-4007-b4ff-ba0f2ef9c219','ShopService')[0].costGreaterThan,5);
 const arrow=applies('f68f43ba-287a-4062-8bab-2aac6bc2a777','AddModifier')[0];assert.equal(arrow.arrowKind,'Consumable');assert.equal(arrow.lifetime.type,'CardPermanent');
 assert.equal(applies('c9c59ee2-4230-40c6-9a59-0f23ed62a698','AddModifier').length,2);
 assert.equal(applies('ad8238ae-fe70-4526-a978-f0907f933d34','AddModifier')[0].rule,'RequiredPlacementArrowCount');
 assert.deepEqual(applies('ad3f2441-3a3d-4427-b5cb-0964eb64d21b','GrowCardBase'),[{target:'$card',attack:4,health:4,movement:4}]);
 assert.equal(applies('4ed672eb-2423-4d97-b2fc-9f2bede70afc','CreateCard')[0].durability,3);
 for(const c of selected.cards.filter(c=>c.cardType==='Event'))assert.equal(c.execution.continuousEffects[0]?.contributions[0]?.triggeredEffect?.trigger?.eventKind,'EventResolved',`${c.uid} ${c.nameKey}`);
});
test('synthesis forms reference ordinary products and have independently owned effect identities',()=>{
 for(const [id,target]of[['b9b6fad0-1e89-4537-8ad6-dfa656bd3ae7','788f870d-9238-41c3-9e98-b2d2fb05cab2'],['c3a59ae1-2a52-4b59-86fb-75c278045dcc','ff1bbeff-7e7b-4715-99ff-a9f8814359f1']]){
  const form=applies(id,'FormShift')[0];assert.equal(form.toCard,byUid.get(target).uid);assert.equal(form.permanence,'Permanent');
 }
 assert.deepEqual(byUid.get('27518a43-d84a-4853-a6aa-b6c310e5726f').execution.properties.upgradeToCardIds,[byUid.get('c6b00125-47ad-438e-b1b5-721fce7ccf49').uid,byUid.get('a212685b-0c59-46bb-85bb-bf7e43d2b3c2').uid]);
 const ids=selected.cards.flatMap(c=>c.execution.plans.map(p=>p.planId));assert.equal(ids.length,new Set(ids).size);
});

test('resource upgrades remain linked and effect-generated without player synthesis eligibility',()=>{
 const cards=author().cardBundles.map(b=>b.card);
 const resources=cards.filter(c=>c.cardType==='Resource'&&!c.upgradeOfUid);
 assert.equal(resources.length,5);
 for(const c of resources){
  assert.equal(c.canTriple,false,c.nameKey);
  const upgrade=cards.find(x=>x.uid===c.tripleUpgradeUid);
  assert.equal(upgrade.upgradeOfUid,c.uid);assert.equal(upgrade.cardType,'Resource');
 }
 const scanner=applies('a3963260-514a-4ea9-a5a9-65fb307d6b2f','CreateCard')[0];
 assert.equal(scanner.cardId,byUid.get('2a9ae6c4-8a4a-4862-9cca-0f5113b27d18').uid);
 assert.ok(cards.find(c=>c.uid==='0166c132-1962-4fc7-9aa6-353ecdba8eab').canTriple,'ordinary minions retain synthesis');
});
test('permanent single-card event effects exclude heroes while hero upgrade remains explicit',()=>{
 const ids=['009','010','011','012','013','014','015','022','023','024','025'];
 const events=selected.cards.filter(c=>c.cardType==='Event'&&c.rulesText.includes('永久'));
 assert.deepEqual(events.map(c=>c.uid).sort(),[...ids.map(id=>eventUids[id]),'dda7b0e4-5a5f-47b0-b6a0-18ca7f743b21'].sort());
 for(const card of events){
  assert.ok(card.rulesText.includes('非英雄'),card.nameKey);
  const scopes=nodes(card.execution).filter(n=>n.select?.scope?.query==='OwnedZones').map(n=>n.select.scope);
  assert.equal(scopes.length,1,card.nameKey);
  assert.ok(scopes[0].filters.some(f=>f.field==='isHero'&&f.op==='Equals'&&f.value===false),card.nameKey);
 }
 assert.equal(byUid.get('d9c97499-7382-49de-b277-80633c541fbb').rulesText,'[唯一] 升级你的英雄。');
 assert.equal(applies('d9c97499-7382-49de-b277-80633c541fbb','UpgradeHero').length,1);
});


test('November balance: dog and satellite have consumable base arrows and single-layer persistent upgrade arrows',()=>{
 for(const [baseUid,upgradeUid,direction] of [
  ['0166c132-1962-4fc7-9aa6-353ecdba8eab','c1032302-69f7-45be-8b84-43e574c8aad5','E'], // 萌萌机械狗
  ['080140fa-2ebe-45ad-b64f-05f10904ac64','d61bdf24-ee18-455a-8b75-f06f737e0d63','N'], // 迷你卫星
 ]){
  const base=byUid.get(baseUid),upgrade=byUid.get(upgradeUid);
  assert.equal(base.execution.arrowMode,'OneTime',baseUid);
  assert.deepEqual(base.arrows,[direction],baseUid);
  assert.deepEqual(base.execution.properties.arrowRules,[{direction,kind:'Consumable',layers:1}],baseUid);
  assert.equal(upgrade.execution.arrowMode,'Permanent',upgradeUid);
  assert.deepEqual(upgrade.arrows,[direction],upgradeUid);
  assert.deepEqual(upgrade.execution.properties.arrowRules,[],upgradeUid);
 }
 for(const uid of ['0166c132-1962-4fc7-9aa6-353ecdba8eab','c1032302-69f7-45be-8b84-43e574c8aad5'])assert.equal(byUid.get(uid).costAmount,1,uid);
 assert.equal(byUid.get('d61bdf24-ee18-455a-8b75-f06f737e0d63').health,3);
 assert.equal(byUid.get('2946ca82-3e15-40d8-93f8-55acfad43645').movement,10); // 泰坦强袭
});
test('November miner rewards obtain star-stone cards in discard instead of immediate energy',()=>{
 for(const [uid,quantity,attack,health] of [
  ['cdacfc95-dbd2-41c6-bacb-ba32a3df7992',1,1,2],
  ['5dfe5487-c255-435f-a243-75b937f1892b',2,2,4],
 ]){
  const card=byUid.get(uid);
  assert.deepEqual([card.costAmount,card.attack,card.movement,card.health],[3,attack,2,health],uid);
  assert.equal(card.execution.continuousEffects[0].activeCondition.phase,'RoundEnd');
  assert.deepEqual(applies(uid,'CreateCard'),[{cardId:'c285d915-f68b-4827-9c39-c4911895e360',destinationZone:'DiscardPile',quantity}]);
  assert.equal(applies(uid,'GainResource').length,0);
 }
});


test('confirmed pool events, direct upgrade and fruit pickup restrictions export executable definitions',()=>{
 for(const [uid,minCost,maxCost,count] of [
  ['73a6604d-68d6-4e08-b0a1-4357cf8e3e02',0,2,1],['dc1d8667-a035-4699-ab8e-a019d9fd8d79',3,5,1],
  ['3ab4140d-6887-459b-8d54-18ea2e45b9e9',6,8,1],['a8ee2808-a01b-4e0c-9b93-cd9f7c27ee59',7,10,2]]){
   assert.deepEqual(applies(uid,'GainRandomCardFromPool'),[{minCost,maxCost,count}]);
 }
 for(const [uid,minTier,maxTier] of [['d3134867-6906-454c-b930-2dcfeda22aa4',1,2],['c21e1ae3-9056-4cfd-aff2-930801e59923',2,3]]){
  assert.deepEqual(applies(uid,'PrepareEventDiscovery'),[{minTier,maxTier}]);assert.equal(applies(uid,'ResolveEvent').length,0);assert.equal(byUid.get(uid).execution.plans[0].steps.length,1);
 }
 assert.deepEqual(applies('dda7b0e4-5a5f-47b0-b6a0-18ca7f743b21','UpgradeCard'),[{target:'$card'}]);
 const resources=author().cardBundles.map(b=>b.card).filter(c=>c.pickupRequiresNonHero);
 assert.deepEqual(resources.map(c=>c.uid).sort(),['e5082c65-fe7d-41db-b934-5ba6a0990a6b','739172b2-66e4-46ef-af13-50283e67dfea'].sort());
});
