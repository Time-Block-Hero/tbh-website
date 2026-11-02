import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { validateProductionExecution } from '../card-execution.mjs';

const dataset = JSON.parse(fs.readFileSync(new URL('../../data/cards.json', import.meta.url)));
const card = id => dataset.cards.find(c => c.id === id);
const objects = value => value && typeof value === 'object'
  ? [value, ...Object.values(value).flatMap(objects)] : [];
const packages = (id, kind) => objects(card(id).execution.plans).filter(x => x.apply?.package === kind).map(x => x.apply.args);
const triggers = id => objects(card(id).execution.continuousEffects).filter(x => x.trigger).map(x => x.trigger);
const sourceAmount = (id, kind) => packages(id, kind).map(x => x.amount?.call?.args?.[0]);
const repeatIds = ['AI-002', 'AI-003', 'AI-007', 'AI-009', 'AI-015', 'AI-021'];

test('production preserves 147 identities and no electricity remains in live card execution', () => {
  assert.equal(dataset.cards.length, 147);
  validateProductionExecution(dataset);
  for (const c of dataset.cards) {
    assert.doesNotMatch(c.rulesText, /电力|电能/, c.id);
    assert.doesNotMatch(JSON.stringify(c.execution), /electricity|电力|电能/i, c.id);
    for (const binding of c.execution.properties.textValueBindings ?? []) {
      assert.ok(c.rulesText.includes(binding.anchor), `${c.id}: ${binding.anchor}`);
      assert.ok(binding.anchor.includes(binding.token), `${c.id}: ${binding.token}`);
    }
  }
});

test('six repeat constructors separate first entry from extra completion rewards', () => {
  assert.deepEqual(dataset.cards.filter(c => c.execution.properties.constructionRepeat).map(c => c.id), repeatIds);
  for (const id of repeatIds) {
    assert.equal(triggers(id).filter(t => t.eventKind === 'ConstructionRepeated').length, 1, id);
    assert.equal(triggers(id).filter(t => t.eventKind === 'ConstructionCompleted').length, 0, id);
    assert.match(card(id).rulesText, /每次额外建造完毕/);
  }
  for (const c of dataset.cards.filter(c => c.execution.properties.constructionTarget != null)) {
    assert.equal(c.execution.properties.constructionMinimumTarget, 1, c.id);
  }
});

test('mine starts at two per round and repeated construction increases future output rather than granting resource immediately', () => {
  assert.deepEqual(sourceAmount('AI-002', 'GainResource'), [2]);
  const c = card('AI-002');
  const reward = c.execution.plans.find(p => p.planId.endsWith(':construction-reward:body'));
  assert.equal(reward.steps.length, 1);
  assert.deepEqual(reward.steps[0].apply, { package: 'AddModifier', args: {
    target: 'Source', channel: 'Value', rule: 'EffectProvidedValue', operation: 'Add', value: 1, lifetime: 'Permanent',
  } });
  assert.equal(triggers('AI-002').filter(t => t.eventKind === 'CardPlaced').length, 0);
});

test('shield starts at four, keeps quick entry and time-stop armor, and grows only its later output', () => {
  assert.deepEqual(sourceAmount('AI-021', 'ModifyUnitAttribute'), [4, 4]);
  assert.deepEqual(packages('AI-021', 'AddModifier'), [{ target: 'Source', channel: 'Value', rule: 'EffectProvidedValue', operation: 'Add', value: 1, lifetime: 'Permanent' }]);
  const ts = objects(card('AI-021').execution.continuousEffects).filter(x => x.trigger);
  assert.equal(ts.find(x => x.trigger.eventKind === 'CardPlaced').executionTiming, 'Quick');
  assert.equal(ts.find(x => x.trigger.eventKind === 'PhaseStarted').executionTiming, 'Quick');
});

test('academy has target eight and permanent player reductions from entry and additional construction', () => {
  assert.equal(card('AI-009').execution.properties.constructionTarget, 8);
  assert.equal(card('AI-009').execution.properties.progressEffects, undefined);
  assert.deepEqual(triggers('AI-009').map(t => t.eventKind), ['CardPlaced', 'ConstructionRepeated']);
  const reductions = packages('AI-009', 'AddModifier');
  assert.equal(reductions.length, 2);
  for (const r of reductions) assert.deepEqual(r, { channel: 'RuleParameter', rule: 'ConstructionTarget', operation: 'Subtract', value: 1, lifetime: 'Permanent' });
});

test('tower starts at range three and construction three, while factories add only lit arrow layers', () => {
  assert.equal(card('AI-015').execution.properties.attackRange, 3);
  assert.equal(card('AI-015').execution.properties.constructionTarget, 3);
  assert.deepEqual(packages('AI-015', 'AddModifier').map(x => [x.channel, x.rule, x.value]), [['Stat', 'Attack', 1], ['Stat', 'AttackRange', 1]]);
  assert.equal(card('AI-007').execution.properties.constructionTarget, 2);
  for (const id of ['AI-003', 'AI-007']) {
    assert.deepEqual(packages(id, 'AddModifier'), [{ target: 'Source', channel: 'ArrowLayer', rule: 'LitDirections', operation: 'Add', value: 1, lifetime: 'Permanent' }]);
  }
});

test('construction providers and support can target unlocked repeat units', () => {
  for (const [id, size, amount] of [['AI-001', 3, 1], ['AI-013', 5, 3]]) {
    assert.deepEqual(triggers(id).map(t => t.eventKind), ['CardPlaced', 'PhaseStarted']);
    const selections = objects(card(id).execution.plans).filter(x => x.query === 'Rectangular');
    assert.equal(selections.length, 2);
    for (const s of selections) {
      assert.deepEqual([s.width, s.height], [size, size]);
      assert.ok(s.filters.some(f => f.field === 'isConstructible' && f.value === true));
      assert.ok(s.filters.some(f => f.field === 'isSelf' && f.value === false));
    }
    assert.deepEqual(sourceAmount(id, 'ModifyUnitAttribute'), [amount, amount]);
  }
  for (const id of ['AI-005', 'AI-007', 'AI-014']) {
    assert.ok(objects(card(id).execution).some(x => x.field === 'isConstructible'), id);
    assert.ok(!objects(card(id).execution).some(x => x.field === 'isUnderConstruction'), id);
  }
});

test('native armor is not an entry grant and Nyx permanent loss is not a removable modifier', () => {
  assert.equal(card('AI-018').execution.properties.initialArmor, 5);
  assert.deepEqual(card('AI-018').execution.plans, []);
  assert.deepEqual(card('SA-018').execution.abilities[0].usage, { window: 'Turn', maxActivations: 2 });
  const growth = packages('SA-018', 'GrowCardBase');
  assert.equal(growth.length, 1);
  assert.equal(growth[0].health, -1);
  assert.equal(growth[0].attack.call.args[0], 1);
  assert.equal(growth[0].movement.call.args[0], 1);
  assert.deepEqual(packages('SA-018', 'ModifierBatch'), []);
  assert.deepEqual(packages('SA-018', 'SetRemainingDurability'), []);
});

test('Augustus permits construction activation but exposes its self cost only while no friendly pilot exists', () => {
  const c = card('AI-020-02');
  assert.equal(c.execution.abilities[0].allowWhileUnderConstruction, true);
  const p = c.execution.plans.find(p => p.planId.endsWith(':prepare'));
  assert.deepEqual(p.steps[0].let, { saveAs: 'selfCard', value: null });
  assert.deepEqual(p.steps[1].select.scope.filters, [{ field: 'cardId', op: 'Equals', value: card('AI-020').uid }]);
  assert.deepEqual(p.steps[2].if.condition, { equals: [{ count: { var: 'pilots' } }, 0] });
  assert.equal(p.steps[2].if.then[0].select.saveAs, 'selfCard');
  assert.deepEqual(packages('AI-020-02', 'CreateCard').map(x => [x.cardId, x.destinationZone]), [[card('AI-020').uid, 'Hand']]);
});

test('overload chooses a real owned building and locks its new battlefield entry for next-round destruction', () => {
  const c = card('AI-010'); const prepare = c.execution.plans.find(p => p.planId.endsWith(':prepare'));
  assert.deepEqual(prepare.steps[0].select.scope.zones, ['DrawPile', 'DiscardPile']);
  assert.deepEqual(prepare.steps[0].select.scope.filters, [{ field: 'cardType', op: 'Equals', value: 'Minion' }, { field: 'tribes', op: 'Contains', value: '建筑' }]);
  assert.equal(prepare.steps[1].select.scope.relation, 'Friendly');
  assert.equal(packages('AI-010', 'TransferCard')[0].destinationZone, 'Battlefield');
  assert.ok(objects(c.execution.plans).some(x => x.field === 'cardInstanceId' && x.value.var === 'selectedCard'));
  assert.deepEqual(packages('AI-010', 'ScheduleBody'), [{ timing: 'EndOfNextRound', bodyPlanRef: c.uid + ':delayed-destruction:body' }]);
  assert.deepEqual(packages('AI-010', 'Destroy'), [{ target: '$placedEntity' }]);
  assert.deepEqual(packages('AI-010', 'GrantTriggeredEffect'), []);
});

test('other changed cards retain their confirmed targeting, keyword and numeric semantics', () => {
  assert.equal(card('FNG-024').execution.properties.attackRange, 2);
  assert.deepEqual(card('FNG-029').execution.keywordTags, ['DivineShield']);
  assert.deepEqual(card('FNG-030').execution.keywordTags, ['Windfury']);
  assert.ok(objects(card('FNG-030').execution).some(x => x.rule === 'RushMove'));
  assert.ok(objects(card('FNG-019').execution).some(x => x.saveAs === 'destinations' && x.policy.max === 3));
  assert.deepEqual(sourceAmount('FNG-025', 'Damage'), [1]);
  assert.deepEqual(sourceAmount('AI-011', 'ModifyUnitAttribute'), [2]);
  assert.ok(objects(card('SA-016').execution).some(x => x.query === 'ControllerRelativeGrids' && JSON.stringify(x.directions) === '["NE"]'));
  const rain = card('SC-002').execution.plans[0].steps[0].if;
  assert.equal(rain.then[0].select.scope.query, 'EnemyEntities');
  assert.equal(rain.else[0].select.scope.query, 'BattlefieldEntities');
  assert.equal(rain.then.filter(s => s.apply?.package === 'DamageBatch').length, 1);
  assert.equal(rain.else.filter(s => s.apply?.package === 'DamageBatch').length, 1);
  assert.deepEqual(packages('SC-013', 'DamageBatch')[0].targets, ['$friendly', '$enemy']);
});
