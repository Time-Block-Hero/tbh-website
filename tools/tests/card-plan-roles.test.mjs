import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { plansWithSemanticRoles } from '../card-plan-roles.mjs';
import { toAuthoringDocument } from '../card-execution.mjs';
const fixture = () => ({ properties: {}, abilities: [{ bodyPlanRef: 'active', preparationPlanRef: 'prepare', costPlanRef: 'cost' }],
  continuousEffects: [{ contributions: [{ triggeredEffect: { bodyPlanRef: 'triggered' } }] }],
  plans: ['active', 'prepare', 'cost', 'triggered', 'deferred'].map(planId => ({ planId, planVersion: 1,
    annotations: { rawRulesText: 'unchanged', inputs: ['target'] },
    steps: planId === 'triggered' ? [{ apply: { package: 'ScheduleBody', args: { bodyPlanRef: 'deferred' } } }] : [] })) });

test('typed owners define body/preparation/cost/scheduled roles without changing executable steps or source', () => {
  const execution = fixture(), before = structuredClone(execution);
  const plans = plansWithSemanticRoles(execution);
  assert.deepEqual(execution, before);
  assert.deepEqual(plans.map(p => p.annotations.semanticRole),
    ['ActivatedAbilityBody', 'ActivationPreparation', 'CostPlan', 'TriggeredEffectBody', 'TriggeredEffectBody']);
  for (let i = 0; i < plans.length; i++) {
    assert.deepEqual(plans[i].steps, before.plans[i].steps);
    assert.deepEqual(plans[i].annotations.inputs, ['target']);
    assert.equal(plans[i].annotations.rawRulesText, 'unchanged');
  }
});

test('missing owners, missing references and conflicting roles fail instead of assigning a generic role', () => {
  let e = fixture(); e.plans.push({ planId: 'orphan', steps: [] });
  assert.throws(() => plansWithSemanticRoles(e), /no typed owner: orphan/);
  e = fixture(); e.abilities[0].bodyPlanRef = 'absent';
  assert.throws(() => plansWithSemanticRoles(e), /missing plan: absent/);
  e = fixture(); e.abilities[0].bodyPlanRef = 'triggered';
  assert.throws(() => plansWithSemanticRoles(e), /Conflicting plan roles/);
  e = fixture(); e.plans[0].annotations.semanticRole = 'TriggeredEffectBody';
  assert.throws(() => plansWithSemanticRoles(e), /Declared plan role conflicts/);
});

test('all 157 current plans export explicit roles including synthesis, event and triggered preparation', () => {
  const source = JSON.parse(fs.readFileSync(new URL('../../data/cards.json', import.meta.url)));
  const before = JSON.stringify(source);
  const doc = toAuthoringDocument(source, { contentId: 'test', contentVersion: 'role-test' });
  const plans = doc.cardBundles.flatMap(bundle => bundle.plans);
  assert.equal(plans.length, 157);
  assert.ok(plans.every(plan => ['ActivatedAbilityBody', 'ActivationPreparation', 'CostPlan', 'TriggeredEffectBody'].includes(plan.annotations.semanticRole)));
  assert.equal(plans.find(p => p.planId === '27518a43-d84a-4853-a6aa-b6c310e5726f:synthesized:body').annotations.semanticRole, 'TriggeredEffectBody');
  assert.equal(plans.find(p => p.planId === '97538b9d-68f1-4a74-861c-3b6a517890ba:round-end:body').annotations.semanticRole, 'TriggeredEffectBody');
  assert.equal(JSON.stringify(source), before);
});
