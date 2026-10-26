import {createSession, begin, commit, cancel, refreshShop, resetSession} from './hud-demo-state.js';
import {mountUnitStudy, mountHistoryRail} from './hud-demo-units.js';

const $ = (s, root = document) => root.querySelector(s);
const el = (tag, className, text) => { const n = document.createElement(tag); n.className = className; if (text !== undefined) n.textContent = text; return n; };
const theatre = $('#theatre');
const hand = $('#hand');
const overlay = $('#overlay');
const modal = $('#modal');
const flightLayer = $('#flight-layer');
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
let session, cards = [], history, study, motion = 'flow', activeAnimation, drag, toastTimer, previousFocus, modalKind;
let animations = new Set();
const factions = {Neutral:'中立',SkyborneAlliance:'猎空',SolarChurch:'烈阳',AstraImperium:'帝国',MachineHeaven:'天庭'};
const selection = ['SA-015','SC-002','FNG-002','SA-001','SC-016','FNG-034','SA-003','SC-011','FNG-017','MCC-007','AI-006','SC-017','SA-019','MCC-012','FNG-026','AI-018','SC-003','SA-020','MCC-009','AI-020','FNG-029','SC-018','MCC-020','SA-018','AI-019','FNG-024','SC-021','SA-007','MCC-005','AI-017','SC-012','SA-017'];

function duration(ms) { return prefersReduced.matches ? 1 : Math.round(ms * (motion === 'weight' ? 1.3 : 1)); }
function animate(node, frames, options = {}) {
  const a = node.animate(frames, {duration: duration(400), easing: 'cubic-bezier(.18,.78,.24,1)', ...options});
  animations.add(a); a.finished.catch(() => {}).finally(() => animations.delete(a)); return a;
}
function notify(message) {
  clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('show');
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2500);
}
function artFor(card, data) {
  const variants = data.artworkVariants?.[card.id] || [];
  const selected = data.selectedArtworkIds?.[card.id];
  return variants.find(v => v.id === (Array.isArray(selected) ? selected[0] : selected))?.src || variants[0]?.src || '';
}
function createCard(card, interactive = false) {
  const node = el(interactive ? 'button' : 'div', 'game-card');
  if (interactive) node.type = 'button';
  node.dataset.instance = card.instance; node.setAttribute('aria-label', `${card.name}，${card.cost} 星能，${card.text}`);
  const img = el('img','card-art'); img.src = card.art; img.alt = ''; img.draggable = false;
  node.append(img, el('div','card-shade'), el('span','card-cost',card.cost),el('span','card-faction',card.faction));
  const info = el('div','card-info');
  info.append(el('span','card-type',card.type === 'Minion' ? '随从' : '法术'),el('h3','',card.name),el('p','',card.text || '可靠的战场伙伴。'));
  if (card.type === 'Minion') {
    const stats = el('div','card-stats');
    for (const [symbol,value] of [['⚔',card.attack],['♡',card.health]]) {
      const stat = el('span','',`${symbol} `); stat.append(el('b','',value)); stats.append(stat);
    }
    info.append(stats);
  }
  node.append(info); return node;
}
function renderHand() {
  const old = new Map([...hand.children].map(n => [n.dataset.instance,n]));
  const count = session.hand.length;
  const step = Math.min(window.innerWidth < 1100 ? 77 : 95, (window.innerWidth - 410) / Math.max(count, 1));
  session.hand.forEach((card,i) => {
    let node = old.get(card.instance);
    if (!node) { node = createCard(card,true); node.classList.add('hand-card'); bindHandCard(node,card); hand.append(node); }
    old.delete(card.instance);
    const position = i - (count - 1) / 2;
    node.style.setProperty('--x', `${position * step}px`);
    node.style.setProperty('--y', `${Math.abs(position) ** 1.6 * 5}px`);
    node.style.setProperty('--rotation', `${position * 4.4}deg`);
    node.style.setProperty('--z',i + 1);
    node.disabled = Boolean(session.pending); node.classList.remove('is-source');
  });
  old.forEach(n => n.remove());
  $('#hand-hint').textContent = count ? '拖到场中打出 · 右键弃牌 · 双击出牌' : '手牌空了，抽一张继续试试。';
  updateCounts();
}
function updateCounts() {
  $('#deck-count').textContent = session.deck.length;
  $('#discard-count').textContent = session.discard.length;
  $('#energy-value').textContent = session.energy;
  $('#draw-card').disabled = Boolean(session.pending) || !session.deck.length || session.hand.length >= 10;
  if (modalKind === 'shop' && !overlay.hidden) $('.shop-balance',modal)?.replaceChildren(document.createTextNode(session.energy));
}
function setBusy() {
  updateCounts();for (const n of hand.children)n.disabled=Boolean(session.pending);
  if(session.pending)for(const n of modal.querySelectorAll('.buy-button,.refresh-button'))n.disabled=true;
}
function rectAt(x,y,width,height) { return {left:x-width/2,top:y-height/2,width,height}; }
function handDestination() { const r = hand.getBoundingClientRect(); return rectAt(r.left, window.innerHeight - 160,154,218); }
function targetFor(kind) {
  if (kind === 'draw') return handDestination();
  if (kind === 'play') return rectAt(window.innerWidth / 2,Math.min(window.innerHeight * .47,420),154,218);
  return $('.pile-back',$('#discard-pile')).getBoundingClientRect();
}
function sourceFor(tx) {
  if (tx.kind === 'draw') return $('.pile-back',$('#deck-pile'));
  return document.querySelector(`[data-instance="${tx.id}"]`);
}
function flightFrames(from,to,kind) {
  const dx = to.left + to.width/2 - from.left - from.width/2;
  const dy = to.top + to.height/2 - from.top - from.height/2;
  const scale = to.width / from.width;
  if (prefersReduced.matches) return [{opacity:1,transform:'none'},{opacity:1,transform:`translate(${dx}px,${dy}px) scale(${scale})`}];
  const sign = kind === 'draw' ? 1 : -1;
  return [
    {transform:`translate(0,0) rotate(${sign * -7}deg) scale(1)`,offset:0},
    {transform:`translate(${dx * .48}px,${dy * .32 - 65}px) rotate(${sign * 7}deg) scale(${kind === 'draw' ? 1.8 : 1.06})`,offset:.48},
    {transform:`translate(${dx}px,${dy}px) rotate(0) scale(${scale})`,offset:1},
  ];
}
async function transact(kind,id, suppliedSource) {
  const tx = begin(session,kind,id);
  if (!tx) { notify(kind === 'draw' ? '牌库为空或手牌已满；可重置样片。' : '请等待当前卡牌落定。'); return; }
  setBusy();
  const source = suppliedSource || sourceFor(tx);
  const from = source.getBoundingClientRect();
  const to = targetFor(kind);
  const ghost = createCard(tx.card); ghost.classList.add('flying-card');
  Object.assign(ghost.style,{left:`${from.left}px`,top:`${from.top}px`,width:`${from.width}px`,height:`${from.height}px`});
  flightLayer.append(ghost);
  if (kind !== 'draw') source.classList.add('is-source');
  const a = animate(ghost,flightFrames(from,to,kind),{duration:duration(kind === 'draw' ? 620 : 560),fill:'forwards',easing:'cubic-bezier(.28,.66,.25,1)'});
  activeAnimation = {a,ghost,tx,source,from};
  try {
    await a.finished;
    if (!commit(session,tx)) return;
    const action = kind === 'draw' ? '抽牌' : kind === 'buy' ? '购买' : kind === 'play' ? '打出' : '弃牌';
    history?.add({id:`${session.epoch}-${tx.token}`,name:tx.card.name,art:tx.card.art,kind:action,detail:kind === 'buy' ? `支付 ${tx.card.cost} 星能，进入弃牌堆。` : `${tx.card.name} · ${action}流转演示`});
    if (kind === 'play') {
      showPlayReceipt(tx.card);
      await animate(ghost,[{opacity:1,filter:'brightness(1)'},{opacity:0,filter:'brightness(1.5)'}],{duration:duration(220),fill:'forwards'}).finished.catch(()=>{});
    } else {
      const pile = kind === 'draw' ? $('#deck-pile') : $('#discard-pile');
      pile.classList.add('arrived'); setTimeout(() => pile.classList.remove('arrived'),duration(650));
    }
  } catch { cancel(session,tx); }
  finally {
    if (activeAnimation?.tx === tx) activeAnimation = null;
    ghost.remove(); source.classList.remove('is-source');
    renderHand(); if (modalKind === 'shop' && !overlay.hidden) {renderShopContent();modal.focus();}
  }
}
function showPlayReceipt(card) {
  const receipt = $('#play-receipt'); receipt.replaceChildren(el('strong','',card.name),el('small','',card.type === 'Minion' ? '部署 · 入场演示' : '法术 · 发动演示'));
  animate($('#play-flash'),[{opacity:0,transform:'scale(.7)'},{opacity:1,offset:.3},{opacity:0,transform:'scale(1.2)'}],{duration:duration(850)});
  animate(receipt,[{opacity:0,transform:'translate(-50%,-35%)'},{opacity:1,transform:'translate(-50%,-50%)',offset:.25},{opacity:1,offset:.65},{opacity:0,transform:'translate(-50%,-60%)'}],{duration:duration(1400)});
}
function bindHandCard(node,card) {
  node.addEventListener('dblclick',()=>{ if (!session.pending) transact('play',card.instance); });
  node.addEventListener('contextmenu',e=>{e.preventDefault(); if (!session.pending) transact('discard',card.instance);});
  node.addEventListener('keydown',e=>{
    if (e.key === 'Enter') { e.preventDefault(); transact('play',card.instance); }
    if (e.key === 'Delete' || e.key === 'Backspace') {e.preventDefault();transact('discard',card.instance);}
  });
  node.addEventListener('pointerenter',()=>spreadNeighbors(card.instance));
  node.addEventListener('pointerleave',()=>spreadNeighbors(null));
  node.addEventListener('focus',()=>spreadNeighbors(card.instance));
  node.addEventListener('blur',()=>spreadNeighbors(null));
  node.addEventListener('pointerdown',e=>{
    if (e.button !== 0 || session.pending || !overlay.hidden) return;
    drag={id:card.instance,node,card,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,started:false,pointerId:e.pointerId};
    node.setPointerCapture(e.pointerId);
  });
  node.addEventListener('pointermove',e=>{
    if (!drag || drag.id!==card.instance) return;
    drag.x=e.clientX;drag.y=e.clientY;
    if (!drag.started && Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>8) {
      drag.started=true;drag.rect=node.getBoundingClientRect();
      drag.ghost=createCard(card);drag.ghost.classList.add('flying-card');
      Object.assign(drag.ghost.style,{width:'170px',height:'240px',left:`${e.clientX-85}px`,top:`${e.clientY-170}px`});
      flightLayer.append(drag.ghost);node.classList.add('is-source');theatre.classList.add('drag-active');
    }
    if (drag.ghost) Object.assign(drag.ghost.style,{left:`${e.clientX-85}px`,top:`${e.clientY-170}px`,transform:`rotate(${Math.max(-5,Math.min(5,(e.clientX-drag.startX)*.025))}deg)`});
  });
  node.addEventListener('pointerup',e=>{
    if (!drag || drag.id!==card.instance) return;
    const d=drag;drag=null;theatre.classList.remove('drag-active');
    if (!d.started) return;
    const discardRect=$('#discard-pile').getBoundingClientRect();
    const inDiscard=e.clientX>discardRect.left-30&&e.clientY>discardRect.top-30;
    const inPlay=e.clientY<window.innerHeight-290&&e.clientY>130&&e.clientX>100&&e.clientX<window.innerWidth-100;
    if (inDiscard||inPlay) {const promise=transact(inDiscard?'discard':'play',card.instance,d.ghost);d.ghost.remove();promise.finally(()=>node.classList.remove('is-source'));}
    else returnDrag(d);
  });
  node.addEventListener('pointercancel',cancelDrag);
}
function spreadNeighbors(id) {
  const index=session.hand.findIndex(c=>c.instance===id);
  [...hand.children].forEach((n,i)=> { n.style.marginLeft = index<0||i===index ? '0px' : `${i<index?-18:18}px`; });
}
async function returnDrag(d) {
  if (!d?.ghost) return;
  const from=d.ghost.getBoundingClientRect(),to=d.rect;
  await animate(d.ghost,[{transform:'none'},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width})`}],{duration:duration(230),fill:'forwards'}).finished.catch(()=>{});
  d.ghost.remove();d.node.classList.remove('is-source');
}
function cancelDrag() {const d=drag;drag=null;theatre.classList.remove('drag-active');if(d)returnDrag(d);}
async function cancelFlight() {
  const active=activeAnimation;if(!active)return;
  if(active.cancelling)return;
  active.cancelling=true;active.a.pause();
  const now=active.ghost.getBoundingClientRect();
  const home=active.from;
  Object.assign(active.ghost.style,{left:`${now.left}px`,top:`${now.top}px`,width:`${now.width}px`,height:`${now.height}px`,transform:'none'});
  // Release the animated transform before returning the visible card to its origin.
  active.a.effect.setKeyframes([{transform:'none'}]);
  await animate(active.ghost,[{transform:'none'},{transform:`translate(${home.left-now.left}px,${home.top-now.top}px) scale(${home.width/now.width})`}],{duration:duration(230),fill:'forwards'}).finished.catch(()=>{});
  cancel(session,active.tx);active.a.cancel();
  notify('已取消，卡牌回到原来的区域。');
}
function modalHeader(title,eyebrow,description) {
  const head=el('div','modal-header'),copy=el('div','');
  copy.append(el('span','eyebrow',eyebrow));const h=el('h2','',title);h.id='modal-title';copy.append(h,el('p','',description));
  const close=el('button','close-button','×');close.setAttribute('aria-label','关闭');close.addEventListener('click',closeModal);
  head.append(copy,close);return head;
}
function openModal(kind) {
  if(session.pending){notify('卡牌落定后即可打开。');return;}
  cancelDrag();previousFocus=document.activeElement;modalKind=kind;
  overlay.hidden=false;modal.classList.remove('is-closing');
  if(kind==='shop')renderShopContent();else if(kind==='help')renderHelp();else renderCollection(kind);
  animate($('.overlay-backdrop'),[{opacity:0},{opacity:1}],{duration:duration(230)});
  animate(modal,[{opacity:0,transform:'translateY(24px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:duration(410)});
  if(kind==='shop') [...modal.querySelectorAll('.shop-slot')].forEach((n,i)=>animate(n,[{opacity:0,translate:'0 15px'},{opacity:1,translate:'0 0'}],{duration:duration(450),delay:prefersReduced.matches?0:60+i*45}));
  modal.focus();
}
async function closeModal() {
  if(overlay.hidden||modal.classList.contains('is-closing'))return;
  if(session.pending){await cancelFlight();}
  modal.classList.add('is-closing');
  animate($('.overlay-backdrop'),[{opacity:1},{opacity:0}],{duration:duration(200)});
  await animate(modal,[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(14px) scale(.985)'}],{duration:duration(200)}).finished.catch(()=>{});
  overlay.hidden=true;modalKind=null;modal.classList.remove('is-closing');previousFocus?.focus();
}
function renderShopContent() {
  modal.replaceChildren(modalHeader('星港商会','THE INTERSTELLAR EXCHANGE','补给，为下一次出发。挑选一张卡牌，让它加入你的旅途。'));
  const tools=el('div','shop-tools'),balance=el('span','','可用星能 ');balance.append(el('strong','shop-balance',session.energy),document.createTextNode('✦'));
  const refresh=el('button','refresh-button','↻  更换未购商品 · 1 ✦');refresh.disabled=Boolean(session.pending)||session.energy<1;
  refresh.addEventListener('click',async()=>{
    if(!refreshShop(session))return;
    renderShopContent();
    [...modal.querySelectorAll('.shop-slot')].forEach((n,i)=>animate(n,[{opacity:0,transform:'translateY(14px) rotateY(-5deg)'},{opacity:1,transform:'translateY(0) rotateY(0)'}],{duration:duration(380),delay:prefersReduced.matches?0:i*40}));
    updateCounts();$('.refresh-button',modal)?.focus();notify('未购商品已更新；已购买的位置保持空置。');
  });tools.append(balance,refresh);modal.append(tools);
  const grid=el('div','shop-grid');
  session.shop.forEach((card,index)=>{
    const slot=el('div','shop-slot');
    if(card){
      slot.append(createCard(card));const button=el('button','buy-button');button.append(el('span','',card.cost>session.energy?'星能不足':'购买'),el('b','',`${card.cost} ✦`));
      button.disabled=Boolean(session.pending)||card.cost>session.energy;
      button.setAttribute('aria-label',`购买 ${card.name}，${card.cost} 星能，送入弃牌堆`);
      button.addEventListener('click',()=>transact('buy',card.instance,$('.game-card',slot)));slot.append(button);
    } else {const sold=el('div','sold-slot');sold.append(el('span','','✓'),el('div','','已送达弃牌堆'));slot.append(sold,el('span','pile-subtitle',`泊位 ${String(index+1).padStart(2,'0')} · 已购`));}
    grid.append(slot);
  });
  modal.append(grid);
  const footer=el('div','shop-footer'),note=el('span','','购买成功后 → ');note.append(el('b','','弃牌堆'),document.createTextNode('  ·  商品不会立刻补回'));
  const view=el('button','','检视弃牌堆 →');view.addEventListener('click',()=>{modalKind='discard';renderCollection('discard');});footer.append(note,view);modal.append(footer);
}
function renderCollection(kind) {
  const isDeck=kind==='deck';const group=isDeck?session.deck:session.discard;
  modal.replaceChildren(modalHeader(isDeck?'牌库':'弃牌堆',isDeck?'DRAW PILE':'DISCARD PILE',`${group.length} 张卡牌 · 本页用于检视；关闭后继续操作手牌。`));
  if(!group.length){modal.append(el('div','empty-collection','这里还没有卡牌。试试弃牌，或在商会买下一张。'));return;}
  const grid=el('div','collection-grid');for(const card of group)grid.append(createCard(card));modal.append(grid);
}
function renderHelp() {
  modal.replaceChildren(modalHeader('把手放在牌上','A SMALL PLAYABLE STUDY','所有交互均使用演示数据，不改变对局、卡牌设计或存档。'));
  const body=el('div','help-body'),dl=el('dl','');
  const rows=[['悬停 / Tab','手牌抬升放大，邻牌让位；单位和左侧记录展开详情。'],['拖放 / 双击','拖到场中或双击打出；松在其他位置会归位。Enter 也可打出聚焦牌。'],['弃牌','右键手牌，或拖到右下弃牌堆；Delete / Backspace 也可。'],['D / S','D 抽牌，S 打开商店；牌堆可点击展开检视。'],['Esc','取消拖放或尚未落定的飞行动画；关闭展开面板。'],['↺ 重置','恢复初始手牌、牌库、星能和商店，正在进行的事务也会取消。']];
  rows.forEach(([title,description])=>dl.append(el('dt','',title),el('dd','',description)));body.append(dl);
  body.append(el('p','','这是一份交互视觉提案：抽牌、弃牌、购买展示真实区域方向；出牌以入场回执示意，不结算战斗规则。商店购买进入弃牌堆；演示刷新保留售空位置。'));
  const link=el('p','source-link','参考手牌焦点与空间层级：');const a=el('a','','Slay the Spire 2 · Mega Crit 官方 Steam 页面');a.href='https://store.steampowered.com/app/2868840/Slay_the_Spire_2/';a.target='_blank';a.rel='noreferrer';link.append(a);body.append(link);modal.append(body);
}
function resetDemo() {
  if(!session)return;
  if(drag){drag.ghost?.remove();drag=null;}
  for(const a of animations)a.cancel();animations.clear();
  activeAnimation=null;flightLayer.replaceChildren();theatre.classList.remove('drag-active');
  resetSession(session,cards);hand.replaceChildren();renderHand();history?.reset();study?.reset();
  if(!overlay.hidden){overlay.hidden=true;modalKind=null;}
  notify('新的幕间。所有卡牌已回到初始位置。');
}
function bindControls() {
  $('#draw-card').addEventListener('click',()=>transact('draw'));
  $('#deck-pile').addEventListener('click',()=>openModal('deck'));
  $('#discard-pile').addEventListener('click',()=>openModal('discard'));
  $('#open-shop').addEventListener('click',()=>openModal('shop'));
  $('#help-button').addEventListener('click',()=>openModal('help'));
  $('#reset-demo').addEventListener('click',resetDemo);
  $('#overlay-backdrop').addEventListener('click',closeModal);
  $('#motion-mode').addEventListener('change',e=>{motion=e.target.value;theatre.classList.toggle('motion-weight',motion==='weight');});
  window.addEventListener('resize',()=>{if(!drag)renderHand();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();if(drag)cancelDrag();else if(!overlay.hidden)closeModal();else cancelFlight();return;}
    if(!overlay.hidden&&e.key==='Tab'){
      const stops=[...modal.querySelectorAll('button:not(:disabled),a[href],select')];
      if(!stops.length){e.preventDefault();return;}
      const first=stops[0],last=stops.at(-1);
      if(e.shiftKey&&(document.activeElement===first||document.activeElement===modal)){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===modal)){e.preventDefault();first.focus();}return;
    }
    if(!overlay.hidden||e.repeat||e.ctrlKey||e.metaKey||e.altKey||['SELECT','INPUT','TEXTAREA'].includes(e.target.tagName))return;
    if(e.key.toLowerCase()==='d'){e.preventDefault();transact('draw');}
    if(e.key.toLowerCase()==='s'){e.preventDefault();openModal('shop');}
  });
  window.addEventListener('blur',cancelDrag);
}
async function start() {
  try{
    const response=await fetch('./data/cards.json');if(!response.ok)throw new Error(`cards ${response.status}`);
    const data=await response.json();
    cards=selection.map(id=>data.cards.find(c=>c.id===id)).filter(Boolean).map(c=>({id:c.id,uid:c.uid,name:c.nameKey,cost:c.costAmount||0,type:c.cardType,attack:c.attack||0,health:c.health||0,faction:factions[c.classId]||'中立',text:c.rulesText||'',art:artFor(c,data)}));
    session=createSession(cards);history=mountHistoryRail($('#history-rail'));study=mountUnitStudy($('#unit-study'));
    renderHand();bindControls();
    [...hand.children].forEach((n,i)=>animate(n,[{opacity:0,translate:'0 65px'},{opacity:1,translate:'0 0'}],{duration:duration(650),delay:prefersReduced.matches?0:i*45}));
    document.documentElement.dataset.demoReady='true';
  }catch(error){$('#hand-hint').textContent='样片资源未能加载，请通过本地服务打开页面。';console.error(error);}
}
start();
