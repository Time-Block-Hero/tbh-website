import test from 'node:test';
import assert from 'node:assert/strict';
import { placementStudyState } from '../../hud-demo-units.js';

test('time moving preserves arrow support but lights no tile',()=>{
  const result=placementStudyState({timeStop:false});
  assert.equal(result.count,3);assert.equal(result.lit,0);
  assert.equal(result.contributions.filter(c=>c.active).length,3);
});
test('overlapping sources add light and consuming single keeps the permanent and restricted sources',()=>{
  assert.equal(placementStudyState().lit,3);
  const spent=placementStudyState({singleRemaining:0});
  assert.equal(spent.lit,2);assert.equal(spent.count,2);
  assert.deepEqual(spent.contributions.filter(c=>c.active).map(c=>c.kind),['permanent','restricted']);
});
test('single-source comparison never relights a consumed arrow when overlap returns',()=>{
  assert.equal(placementStudyState({overlap:false,singleRemaining:0}).lit,1);
  assert.equal(placementStudyState({overlap:true,singleRemaining:0}).lit,2);
  assert.equal(placementStudyState({timeStop:false,singleRemaining:0}).lit,0);
});
