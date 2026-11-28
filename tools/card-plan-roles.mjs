// Derive export metadata only from explicit typed owners, never from a plan ID suffix.
export function plansWithSemanticRoles(execution) {
  const roles = new Map();
  const plans = structuredClone(execution.plans);
  const known = new Set(plans.map(plan => plan.planId));
  function own(id, role) {
    if (!id) return;
    if (!known.has(id)) throw new Error(`Plan owner references missing plan: ${id}`);
    if (roles.has(id) && roles.get(id) !== role) throw new Error(`Conflicting plan roles for ${id}`);
    roles.set(id, role);
  }
  function activation(owner, bodyRole) {
    own(owner.bodyPlanRef, bodyRole);
    own(owner.preparationPlanRef, 'ActivationPreparation');
    own(owner.costPlanRef, 'CostPlan');
  }
  for (const ability of execution.abilities) activation(ability, 'ActivatedAbilityBody');
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (value.triggeredEffect) activation(value.triggeredEffect, 'TriggeredEffectBody');
    own(value.completionBodyPlanRef, 'TriggeredEffectBody');
    own(value.placementPreparationPlanRef, 'ActivationPreparation');
    own(value.placementCostPlanRef, 'CostPlan');
    const apply = value.apply;
    if (['ScheduleBody', 'GrantTriggeredEffect'].includes(apply?.package))
      own(apply.args?.bodyPlanRef, 'TriggeredEffectBody');
    if (apply?.package === 'GrantActivatedAbility')
      own(apply.args?.bodyPlanRef, 'ActivatedAbilityBody');
    for (const item of Object.values(value)) visit(item);
  }
  visit(execution.properties);
  visit(execution.continuousEffects);
  visit(plans);
  for (const plan of plans) {
    const role = roles.get(plan.planId);
    if (!role) throw new Error(`Plan has no typed owner: ${plan.planId}`);
    const annotations = plan.annotations ?? {};
    if (annotations.semanticRole && annotations.semanticRole !== role)
      throw new Error(`Declared plan role conflicts with typed owner: ${plan.planId}`);
    plan.annotations = { ...annotations, semanticRole: role };
  }
  return plans;
}
