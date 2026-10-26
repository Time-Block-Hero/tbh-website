import test from 'node:test';
import assert from 'node:assert/strict';
import {createSession,begin,commit,cancel,refreshShop,resetSession} from '../../hud-demo-state.js';
const cards=Array.from({length:32},(_,i)=>({id:`card-${i}`,cost:3,name:`Card ${i}`}));
test('draw leaves source unchanged until visual flight commits, once only',()=>{
 const s=createSession(cards),tx=begin(s,'draw');
 assert.equal(s.deck.length,9);assert.equal(s.hand.length,6);
 assert.equal(begin(s,'draw'),null);
 assert.equal(commit(s,tx),true);assert.equal(commit(s,tx),false);
 assert.equal(s.deck.length,8);assert.equal(s.hand.length,7);
});
test('cancelled discard keeps the original card and permits another action',()=>{
 const s=createSession(cards),card=s.hand[2],tx=begin(s,'discard',card.instance);
 cancel(s,tx);assert.equal(commit(s,tx),false);assert.equal(s.hand[2],card);assert.equal(s.discard.length,0);
 assert.ok(begin(s,'discard',card.instance));
});
test('purchase is atomic and enters discard rather than hand',()=>{
 const s=createSession(cards),card=s.shop[1],tx=begin(s,'buy',card.instance);
 assert.equal(s.energy,18);assert.equal(s.shop[1],card);
 assert.equal(commit(s,tx),true);assert.equal(s.energy,15);assert.equal(s.shop[1],null);
 assert.deepEqual(s.discard,[card]);assert.equal(s.hand.length,6);
});
test('insufficient funds do not reserve or move a shop card',()=>{
 const s=createSession(cards);s.energy=2;
 assert.equal(begin(s,'buy',s.shop[0].instance),null);assert.equal(s.pending,null);assert.equal(s.shop.filter(Boolean).length,6);
});
test('reset invalidates in-flight callbacks even if sequence numbers repeat',()=>{
 const s=createSession(cards),tx=begin(s,'draw');resetSession(s,cards);
 const next=begin(s,'draw');assert.equal(tx.token,next.token);
 assert.equal(commit(s,tx),false);assert.equal(s.hand.length,6);assert.equal(commit(s,next),true);
});
test('refresh preserves sold slots, changes unbought offers and conserves inventory',()=>{
 const s=createSession(cards),bought=s.shop[0],tx=begin(s,'buy',bought.instance);commit(s,tx);
 const previous=s.shop[1];assert.equal(refreshShop(s),true);
 assert.equal(s.shop[0],null);assert.notEqual(s.shop[1],previous);assert.equal(s.energy,14);
 const all=[...s.hand,...s.deck,...s.discard,...s.field,...s.shop,...s.stock].filter(Boolean);
 assert.equal(all.length,32);assert.equal(new Set(all.map(c=>c.instance)).size,32);
});
test('refresh cannot race an in-flight purchase or spend below zero',()=>{
 const s=createSession(cards),tx=begin(s,'buy',s.shop[0].instance);
 assert.equal(refreshShop(s),false);cancel(s,tx);s.energy=0;assert.equal(refreshShop(s),false);
});
test('play and discard use separate presentation destinations',()=>{
 const s=createSession(cards),played=s.hand[0],discarded=s.hand[1];
 commit(s,begin(s,'play',played.instance));commit(s,begin(s,'discard',discarded.instance));
 assert.deepEqual(s.field,[played]);assert.deepEqual(s.discard,[discarded]);assert.equal(s.hand.length,4);
});
test('hand limit prevents drawing without consuming deck',()=>{
 const s=createSession(cards);for(let i=0;i<4;i++)commit(s,begin(s,'draw'));
 assert.equal(s.hand.length,10);const count=s.deck.length;assert.equal(begin(s,'draw'),null);assert.equal(s.deck.length,count);
});
