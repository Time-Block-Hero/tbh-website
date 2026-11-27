import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import contract from '../../card-design-contract.js';
import {toAuthoringDocument,validateProductionExecution,designHash} from '../card-execution.mjs';
import {validateSourceRevision} from '../card-design-source-revision.mjs';
const read=p=>fs.readFileSync(new URL(`../../${p}`,import.meta.url));
const source=JSON.parse(read('data/cards.json'));
const selected=validateProductionExecution(source);
const byId=new Map(selected.cards.map(c=>[c.id,c]));
const nodes=x=>x&&typeof x==='object'?[x,...Object.values(x).flatMap(nodes)]:[];
const values=(id,kind)=>nodes(byId.get(id).execution).filter(n=>n.call?.name==='EffectValue'&&n.call.metadata.kind===kind).map(n=>n.call.args[0]);
const applies=(id,pkg)=>nodes(byId.get(id).execution).filter(n=>n.apply?.package===pkg).map(n=>n.apply.args);
const author=()=>toAuthoringDocument(source,{contentId:'test',contentVersion:'overhaul22'});

test('approved identity inventory and bound selection admit exactly 52 originals, 51 upgrades and 31 events',()=>{
 assert.equal(source.cards.length,232);
 const bridgeBytes=read('data/card-identity-migration.json');
 validateSourceRevision(read('data/card-design-source-revision.json'),bridgeBytes,JSON.parse(bridgeBytes),source);
 assert.equal(selected.cards.length,134);
 assert.equal(selected.cards.filter(c=>c.upgradeOfUid).length,51);
 assert.equal(selected.cards.filter(c=>c.cardType==='Event').length,31);
 assert.equal(selected.cards.filter(c=>!c.upgradeOfUid&&c.cardType!=='Event').length,52);
 assert.equal(selected.cards.filter(c=>c.collectable&&c.classId==='Neutral').length,42);
 assert.equal(selected.cards.filter(c=>c.collectionKind==='Hero').length,4);
 for(const c of selected.cards)assert.equal(c.execution.reviewedDesignHash,designHash(c),c.id);
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
 for(const id of ['FNG-UN-002','FNG-UN-002-UP'])assert.equal(cards.find(c=>c.displayId===id).selfCellSupport,1);
 const fire=cards.find(c=>c.displayId==='FNG-012');assert.equal(fire.canTriple,false);assert.equal(fire.tripleUpgradeUid,null);
 const dog=cards.find(c=>c.displayId==='FNG-002-UP');assert.deepEqual(dog.arrows,[]);assert.ok(dog.arrowRules.every(r=>r.layers===2&&r.kind==='Permanent'));
 assert.deepEqual(cards.filter(c=>c.eventUnique).map(c=>c.displayId).sort(),['FNG-EV-008','FNG-EV-026']);
});
test('reviewed balance changes alter actual Plan amounts and quotas, not only review hashes',()=>{
 for(const [id,kind,n]of[['FNG-027','Damage',3],['FNG-028','Attribute',1],['FNG-031','Heal',3],['FNG-032','Armor',5],['FNG-040','Heal',3],['FNG-031-UP','Heal',6],['FNG-034-UP','Damage',8],['FNG-006-UP','Star',12]]){
  const found=values(id,kind);assert.ok(found.length,id);assert.ok(found.every(v=>v===n),id);
 }
 for(const [id,n]of[['FNG-013',1],['FNG-013-UP',2]])assert.ok(nodes(byId.get(id).execution).filter(n=>n.select?.saveAs==='grids').every(node=>node.select.policy.max===n));
 assert.equal(byId.get('FNG-014').execution.continuousEffects[0].activeCondition.maximum,1);
 assert.equal(byId.get('FNG-014-UP').execution.continuousEffects[0].activeCondition.maximum,2);
 assert.equal(applies('FNG-015','ScheduleBody')[0].timing,'EndOfCurrentRound');
 assert.equal(applies('FNG-015-UP','ScheduleBody').length,0);
 assert.deepEqual(applies('FNG-032-UP','ModifyUnitAttribute').map(a=>[a.operation,a.amount]),[['Set',0]]);
 assert.equal(byId.get('FNG-041-UP').execution.abilities[0].usage.maxActivations,2);
 for(const id of ['FNG-028','FNG-028-UP'])assert.deepEqual(applies(id,'ModifierBatch')[0].items.map(i=>i.stat),['Attack','Move','Health']);
});
test('cargo grants refresh instead of slots, scanner produces correct form, fruit restores allowance',()=>{
 for(const [id,n]of[['FNG-021',1],['FNG-021-UP',2]]){
  assert.deepEqual(applies(id,'ShopService'),[{operation:'GrantRefresh',amount:n}]);
  assert.ok(!nodes(byId.get(id).execution).some(n=>n.type==='ShopSlot'));
  assert.equal(byId.get(id).execution.continuousEffects[0].activeCondition.phase,'Shop');
 }
 assert.equal(applies('FNG-019-UP','CreateCard')[0].cardId,byId.get('FNG-UN-001-UP').uid);
 for(const [id,n]of[['FNG-UN-003',2],['FNG-UN-003-UP',3]]){
  const movement=applies(id,'ModifyUnitAttribute').find(a=>a.attribute==='RemainingMovement');assert.equal(movement.amount.call.args[0],n);
  assert.equal(applies(id,'AddModifier').length,0);
 }
});
test('event plans preserve discount scopes, FIFO filters, permanent growth and once-arrow configuration',()=>{
 for(const [id,op]of[['005','DiscountCurrent'],['006','DiscountCurrent'],['007','DiscountRound'],['021','FreeNextRefresh']])assert.equal(applies(`FNG-EV-${id}`,'ShopService')[0].operation,op);
 assert.equal(applies('FNG-EV-019','ShopService')[0].costLessThan,3);
 assert.equal(applies('FNG-EV-020','ShopService')[0].costGreaterThan,5);
 const arrow=applies('FNG-EV-022','AddModifier')[0];assert.equal(arrow.arrowKind,'Consumable');assert.equal(arrow.lifetime.type,'CardPermanent');
 assert.equal(applies('FNG-EV-024','AddModifier').length,2);
 assert.equal(applies('FNG-EV-025','AddModifier')[0].rule,'RequiredPlacementArrowCount');
 assert.deepEqual(applies('FNG-EV-012','GrowCardBase'),[{target:'$card',attack:4,health:4,movement:4}]);
 assert.equal(applies('FNG-EV-031','CreateCard')[0].durability,3);
 for(const c of selected.cards.filter(c=>c.cardType==='Event'))assert.equal(c.execution.continuousEffects[0].contributions[0].triggeredEffect.trigger.eventKind,'EventResolved',c.id);
});
test('synthesis forms reference ordinary products and have independently owned effect identities',()=>{
 for(const [id,target]of[['FNG-004-UP','FNG-005'],['FNG-005-UP','FNG-006']]){
  const form=applies(id,'FormShift')[0];assert.equal(form.toCard,byId.get(target).uid);assert.equal(form.permanence,'Permanent');
 }
 assert.deepEqual(byId.get('FNG-001-UP').execution.properties.upgradeToCardIds,[byId.get('FNG-042').uid,byId.get('FNG-043').uid]);
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
 const scanner=applies('FNG-019-UP','CreateCard')[0];
 assert.equal(scanner.cardId,byId.get('FNG-UN-001-UP').uid);
 assert.ok(cards.find(c=>c.displayId==='FNG-002').canTriple,'ordinary minions retain synthesis');
});
test('eleven existing permanent single-card event buffs exclude heroes while hero upgrade remains explicit',()=>{
 const ids=['009','010','011','012','013','014','015','022','023','024','025'];
 const events=selected.cards.filter(c=>c.cardType==='Event'&&c.rulesText.includes('永久'));
 assert.deepEqual(events.map(c=>c.id).sort(),ids.map(id=>`FNG-EV-${id}`).sort());
 for(const card of events){
  assert.ok(card.rulesText.includes('非英雄'),card.nameKey);
  const scopes=nodes(card.execution).filter(n=>n.select?.scope?.query==='OwnedZones').map(n=>n.select.scope);
  assert.equal(scopes.length,1,card.nameKey);
  assert.ok(scopes[0].filters.some(f=>f.field==='isHero'&&f.op==='Equals'&&f.value===false),card.nameKey);
 }
 assert.equal(byId.get('FNG-EV-008').rulesText,'[唯一] 升级你的英雄。');
 assert.equal(applies('FNG-EV-008','UpgradeHero').length,1);
});
