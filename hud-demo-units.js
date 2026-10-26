/** Synthetic visual study. Values below are presentation fixtures, never game authority. */
const TONES = { permanent: '#8edbd1', single: '#ecc584', restricted: '#b4a3ef' };
const UNITS = [
  { uid: 'e66c2fd5-ee14-4cb1-b55e-094324214830', name: '洛岚', title: '猎空 · 指挥官', at: [0, 1], hp: 18, max: 20, attack: 4, ap: 2, armor: 3, kind: 'permanent', ability: '战术指令', detail: '可发动效果 · 在详情中确认目标与费用。', ready: true },
  { uid: 'b85a69b8-6241-45c9-a168-a10282390c44', name: '诺亚', title: '曜日 · 守护者', at: [0, 0], hp: 20, max: 20, attack: 3, ap: 2, armor: 0, kind: 'single', ability: '光之庇护', detail: '可发动效果 · 护佑友方单位。', ready: true },
  { uid: '0166c132-1962-4fc7-9aa6-353ecdba8eab', name: '萌萌机械狗', title: '中立 · 机械', at: [2, 1], hp: 5, max: 8, attack: 2, ap: 1, armor: 0, kind: 'restricted', ability: '待命', detail: '当前没有可发动效果。', ready: false },
];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const project = (col, row) => [450 + (col - row) * 112, 75 + (col + row) * 56];
const polygon = (col, row, inset = .025) => [[col + inset, row + inset], [col + 1 - inset, row + inset], [col + 1 - inset, row + 1 - inset], [col + inset, row + 1 - inset]].map(p => project(...p).join(',')).join(' ');
const sourcePoint = unit => project(unit.at[0] + .5, unit.at[1] + .5);
const arrowPath = unit => {
  const source = sourcePoint(unit), target = project(1.5, 1.5), angle = Math.atan2(target[1] - source[1], target[0] - source[0]);
  const pts = [[24, -6], [43, -6], [43, -13], [62, 0], [43, 13], [43, 6], [24, 6]];
  return pts.map(([x,y]) => `${source[0] + x * Math.cos(angle) - y * Math.sin(angle)},${source[1] + x * Math.sin(angle) + y * Math.cos(angle)}`).join(' ');
};

/** Remaining effective support, independent of movement offers. */
export function placementStudyState({ timeStop = true, overlap = true, singleRemaining = 1 } = {}) {
  const contributions = [
    { kind: 'permanent', active: true },
    { kind: 'single', active: overlap && singleRemaining > 0 },
    { kind: 'restricted', active: overlap },
  ];
  return { contributions, count: contributions.filter(c => c.active).length, lit: timeStop ? contributions.filter(c => c.active).length : 0 };
}

function boardMarkup() {
  let tiles = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) tiles += `<polygon class="hs-tile" points="${polygon(c,r)}"/><path class="hs-seam" d="M${project(c+.12,r+.13)} l12,6"/>`;
  const outline = [[0,0],[3,0],[3,3],[0,3]].map(p => project(...p).join(',')).join(' ');
  return `<svg class="hs-board" viewBox="0 0 900 460" aria-hidden="true"><defs><linearGradient id="hs-deck" x2=".4" y2="1"><stop stop-color="#40555a"/><stop offset="1" stop-color="#253b42"/></linearGradient><radialGradient id="hs-light"><stop stop-color="white" stop-opacity=".8"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient><filter id="hs-blur"><feGaussianBlur stdDeviation="10"/></filter></defs><polygon points="${outline}" fill="#0b171c" transform="translate(0 13)"/>${tiles}<polygon points="${outline}" class="hs-outline"/>
  <g class="hs-target"><polygon class="hs-target-inset" points="${polygon(1,1,.12)}"/>${['permanent','single','restricted'].map(k=>`<polygon data-light="${k}" class="hs-glow" points="${polygon(1,1,.04)}" fill="${TONES[k]}"/><ellipse data-aura="${k}" cx="450" cy="243" rx="83" ry="37" fill="${TONES[k]}" filter="url(#hs-blur)"/>`).join('')}<text class="hs-support-count" x="450" y="246" text-anchor="middle">3</text><text class="hs-support-caption" x="450" y="263" text-anchor="middle">放置支持</text></g>
  ${UNITS.map(u=>`<ellipse cx="${sourcePoint(u)[0]}" cy="${sourcePoint(u)[1]+3}" rx="35" ry="12" fill="#071518" opacity=".4"/><polygon class="hs-foot-arrow" data-arrow="${u.kind}" points="${arrowPath(u)}" fill="${TONES[u.kind]}"/>`).join('')}</svg>`;
}
function statMarkup(unit) {
  return `<span class="hs-stat hs-attack" title="攻击"><span aria-hidden="true">⚔</span> ${unit.attack}</span><span class="hs-stat hs-health" title="生命 ${unit.hp}/${unit.max}"><span class="hs-heart" aria-hidden="true">♥</span> ${unit.hp}<small>/${unit.max}</small></span><span class="hs-action-pips" title="剩余行动点 ${unit.ap}" aria-label="剩余行动点 ${unit.ap}">${Array.from({length:2},(_,i)=>`<i class="${i<unit.ap?'is-full':''}"></i>`).join('')}</span>${unit.ready?'<span class="hs-ready" title="有可发动效果" aria-label="有可发动效果">✦</span>':''}`;
}
function unitMarkup(unit, index) {
  const [x,y] = sourcePoint(unit);
  return `<div class="hs-unit hs-unit-${index}" style="--ux:${x/9}%;--uy:${y/4.6}%;--unit-accent:${TONES[unit.kind]}" data-unit="${index}"><button class="hs-unit-hit" aria-expanded="false" aria-label="${unit.name}，生命 ${unit.hp}/${unit.max}，展开信息"><canvas width="340" height="380" class="hs-portrait" aria-hidden="true"></canvas><span class="hs-unit-summary">${statMarkup(unit)}</span></button><section class="hs-unit-detail" aria-label="${unit.name}信息"><div class="hs-detail-title"><span><small>${unit.title}</small><strong>${unit.name}</strong></span><span class="hs-shield">${unit.armor?`◇ ${unit.armor}`:'◇ —'}</span></div><div class="hs-detail-stats"><span>攻击 <b>${unit.attack}</b></span><span>生命 <b>${unit.hp}/${unit.max}</b></span><span>行动 <b>${unit.ap}/2</b></span></div><div class="hs-detail-rule"></div><div class="hs-ability ${unit.ready?'is-ready':''}"><span>✦</span><span><b>${unit.ability}</b><small>${unit.detail}</small></span></div><small class="hs-fixture-note">信息样式示例 · 数值与能力为演示夹具</small></section></div>`;
}
function setExpanded(unit, value) {
  unit.classList.toggle('is-open', value);
  unit.querySelector('button').setAttribute('aria-expanded', String(value));
  const detail=unit._detail; if(!detail)return;
  detail.classList.toggle('is-visible',value);
  if(value){const box=unit.querySelector('button').getBoundingClientRect(), host=detail.parentElement.getBoundingClientRect();
    detail.style.left=`${Math.max(10,Math.min(host.width-270,box.right-host.left+12))}px`;
    detail.style.top=`${Math.max(44,Math.min(host.height-228,box.top-host.top+12))}px`;
  }
}
function createFrame(image, layout, frame) {
  const output = document.createElement('canvas'); output.width = 340; output.height = 380;
  const ctx = output.getContext('2d'), rect = frame.rect, pivot = frame.pivot;
  const scale = 340 / (layout.nominalCellHeight || layout.frames[0].rect.height);
  const width = rect.width * scale, height = rect.height * scale;
  const left = 170 - pivot.x * width, top = 369 - (1 - pivot.y) * height;
  const mask = document.createElement('canvas'); mask.width = output.width; mask.height = output.height;
  const mc = mask.getContext('2d');
  const draw = context => {
    context.drawImage(image,rect.x,layout.sourceHeight-rect.y-rect.height,rect.width,rect.height,left,top,width,height);
    for (const e of frame.excludedRects || []) context.clearRect(left+e.x*scale,top+(rect.height-e.y-e.height)*scale,e.width*scale,e.height*scale);
  };
  draw(mc); mc.globalCompositeOperation = 'source-in'; mc.fillStyle = '#f1eee5'; mc.fillRect(0,0,340,380);
  ctx.shadowColor = '#07111490'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 7; ctx.drawImage(mask,0,0); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  for(let i=0;i<12;i++){ const a=i*Math.PI/6; ctx.drawImage(mask,Math.cos(a)*3,Math.sin(a)*3); }
  draw(ctx); return output;
}
async function loadPortraits(root, signal) {
  const response = await fetch('./data/chibi-review.json',{signal}); if (!response.ok) throw new Error('角色图集无法加载');
  const manifest = await response.json();
  return Promise.all(UNITS.map(async (unit,index) => {
    const entry = [manifest.baseline,...manifest.entries].find(e=>e.uid===unit.uid);
    const image = new Image(); image.src = entry.atlasSrc;
    await image.decode(); if(signal.aborted)return null;
    return {canvas:root.querySelector(`[data-unit="${index}"] canvas`),frames:entry.layout.frames.slice(0,3).map(f=>createFrame(image,entry.layout,f))};
  }));
}

export function mountUnitStudy(root, config = {}) {
  if(!root)throw new TypeError('Unit study requires a root');
  const abort = new AbortController();
  root.classList.add('hs-root');
  root.innerHTML = `<div class="hs-heading"><span class="hs-kicker">单位信息 · 悬浮查看</span><div class="hs-style-selector" role="group" aria-label="单位信息样式"><button data-style="jewel" class="is-active" aria-pressed="true">徽章</button><button data-style="line" aria-pressed="false">刻度</button><button data-style="plaque" aria-pressed="false">铭牌</button></div></div><div class="hs-stage" data-style="jewel"><div class="hs-stage-fit">${boardMarkup()}${UNITS.map(unitMarkup).join('')}</div></div><div class="hs-controls"><button class="hs-phase is-active" aria-pressed="true"><i></i><span>时停 · 光源开启</span></button><label class="hs-overlap"><input type="checkbox" checked> 叠加支持</label><button class="hs-consume">消耗一次性箭头</button><button class="hs-reset" title="重置演示" aria-label="重置箭头演示">↺</button></div><div class="hs-legend"><span style="--tone:${TONES.permanent}">永续</span><span style="--tone:${TONES.single}">一次性</span><span style="--tone:${TONES.restricted}">限定用途 · 示例</span><small>光只表达放置支持，不代表可移动。</small></div><span class="hs-status" role="status" aria-live="polite"></span>`;
  const stage = root.querySelector('.hs-stage');
  const resize = new ResizeObserver(() => stage.style.setProperty('--stage-scale',Math.min(stage.clientWidth/900,stage.clientHeight/460)));
  resize.observe(stage);
  const state = {timeStop:true,overlap:true,singleRemaining:1};
  const listen=(element,type,listener)=>element.addEventListener(type,listener,{signal:abort.signal});
  function paint(){
    const view = placementStudyState(state);
    view.contributions.forEach(c=>{
      root.querySelector(`[data-light="${c.kind}"]`).style.opacity=state.timeStop&&c.active?'.12':'0';
      root.querySelector(`[data-aura="${c.kind}"]`).style.opacity=state.timeStop&&c.active?'.13':'0';
      const arrow=root.querySelector(`[data-arrow="${c.kind}"]`);arrow.classList.toggle('is-spent',!c.active);arrow.style.filter=state.timeStop&&c.active?`drop-shadow(0 0 5px ${TONES[c.kind]})`:'none';
    });
    root.querySelector('.hs-support-count').textContent=String(view.count);
    root.querySelector('.hs-target').classList.toggle('is-lit',state.timeStop);
    const phase=root.querySelector('.hs-phase');phase.classList.toggle('is-active',state.timeStop);phase.setAttribute('aria-pressed',String(state.timeStop));phase.querySelector('span').textContent=state.timeStop?'时停 · 光源开启':'时动 · 保留箭头';
    root.querySelector('.hs-overlap input').checked=state.overlap;
    const consume=root.querySelector('.hs-consume');consume.disabled=state.singleRemaining===0||!state.overlap;consume.textContent=state.singleRemaining?'消耗一次性箭头':'一次性已耗尽';
    config.onChange?.({...state,...view});
  }
  listen(root.querySelector('.hs-phase'),'click',()=>{state.timeStop=!state.timeStop;paint();});
  listen(root.querySelector('.hs-overlap input'),'change',event=>{state.overlap=event.target.checked;paint();});
  listen(root.querySelector('.hs-consume'),'click',()=>{state.singleRemaining=0;paint();root.querySelector('.hs-status').textContent='一次性支持已耗尽，对应箭头熄灭，其余支持保留。';});
  const reset=()=>{Object.assign(state,{timeStop:true,overlap:true,singleRemaining:1});paint();root.querySelector('.hs-status').textContent='演示已重置。';root.querySelectorAll('.hs-unit').forEach(u=>{u.dataset.pinned='';setExpanded(u,false);});};
  listen(root.querySelector('.hs-reset'),'click',reset);
  root.querySelectorAll('[data-style]').forEach(button=>{if(button.tagName!=='BUTTON')return;listen(button,'click',()=>{root.querySelector('.hs-stage').dataset.style=button.dataset.style;root.querySelectorAll('.hs-style-selector button').forEach(b=>{b.classList.toggle('is-active',b===button);b.setAttribute('aria-pressed',String(b===button));});});});
  root.querySelectorAll('.hs-unit').forEach(unit=>{
    let closeTimer;
    const detail=unit.querySelector('.hs-unit-detail');unit._detail=detail;detail.style.setProperty('--unit-accent',TONES[UNITS[Number(unit.dataset.unit)].kind]);root.append(detail);
    const show=()=>{clearTimeout(closeTimer);setExpanded(unit,true);};
    const hide=()=>{clearTimeout(closeTimer);closeTimer=setTimeout(()=>{if(unit.dataset.pinned!=='true'&&!unit.contains(document.activeElement)&&!detail.contains(document.activeElement)&&!detail.matches(':hover'))setExpanded(unit,false);},120);};
    listen(detail,'pointerenter',show);listen(detail,'pointerleave',hide);listen(detail,'focusin',show);listen(detail,'focusout',hide);
    listen(unit,'pointerenter',show);listen(unit,'pointerleave',hide);listen(unit,'focusin',show);listen(unit,'focusout',hide);
    listen(unit.querySelector('button'),'click',()=>{const pinned=unit.dataset.pinned!=='true';root.querySelectorAll('.hs-unit').forEach(other=>{other.dataset.pinned='';if(other!==unit)setExpanded(other,false);});unit.dataset.pinned=String(pinned);setExpanded(unit,pinned);});
    listen(unit,'keydown',event=>{if(event.key==='Escape'){unit.dataset.pinned='';setExpanded(unit,false);}});
    abort.signal.addEventListener('abort',()=>clearTimeout(closeTimer),{once:true});
  });
  listen(document,'pointerdown',event=>{if(root.contains(event.target)&&event.target.closest('.hs-unit,.hs-unit-detail'))return;root.querySelectorAll('.hs-unit').forEach(unit=>{unit.dataset.pinned='';setExpanded(unit,false);});});
  let frame=0,portraits=[]; const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const draw=()=>{portraits.forEach(p=>{if(!p)return;const context=p.canvas.getContext('2d');context.clearRect(0,0,340,380);context.drawImage(p.frames[frame%3],0,0);});};
  loadPortraits(root,abort.signal).then(items=>{if(abort.signal.aborted)return;portraits=items;draw();}).catch(error=>{if(error.name!=='AbortError'&&!abort.signal.aborted)root.querySelector('.hs-status').textContent=error.message;});
  const timer=setInterval(()=>{if(!document.hidden&&!motion.matches){frame++;draw();}},400);paint();
  return {reset,destroy(){abort.abort();resize.disconnect();clearInterval(timer);root.replaceChildren();root.classList.remove('hs-root');}};
}

const defaultHistory = [
  {id:'seed-1',name:'洛岚',art:'./assets/card-art/luolan/luolan-01.png',kind:'入场',detail:'洛岚抵达战场。部署动效已完成。'},
  {id:'seed-2',name:'诺亚',art:'./assets/card-art/noa/noa-01.png',kind:'效果',detail:'友方单位获得护甲。点击条目可固定展开。'},
];
export function mountHistoryRail(root, config={}) {
  if(!root)throw new TypeError('History rail requires a root');
  const abort=new AbortController(); let records=[],pinned=false,activeId=null;
  root.classList.add('hr-root');
  root.innerHTML=`<button class="hr-toggle" aria-expanded="false" title="展开对局记录"><span aria-hidden="true">◷</span><span class="hr-count">0</span></button><div class="hr-thumbnails" aria-label="最近对局记录"></div><section class="hr-panel" aria-label="对局记录"><header><span><small>BATTLE JOURNAL</small><strong>对局记录</strong></span><button class="hr-close" aria-label="收起对局记录">×</button></header><div class="hr-list"></div><footer>悬浮展开 · 点击固定 · Esc 收起</footer></section>`;
  const listen=(node,type,fn)=>node.addEventListener(type,fn,{signal:abort.signal});
  const open=value=>{root.classList.toggle('is-open',value);root.querySelector('.hr-toggle').setAttribute('aria-expanded',String(value));};
  const render=()=>{
    root.querySelector('.hr-count').textContent=records.length;
    root.querySelector('.hr-thumbnails').innerHTML=records.slice(0,5).map((r,i)=>`<button class="hr-thumb" data-record="${esc(r.id)}" aria-label="${esc(r.kind+' · '+r.name)}" style="--order:${i}"><img src="${esc(r.art)}" alt=""/><span>${esc(r.kind)}</span></button>`).join('');
    root.querySelector('.hr-list').innerHTML=records.length?records.map((r,i)=>`<button class="hr-record ${r.id===activeId?'is-active':''}" data-record="${esc(r.id)}"><img src="${esc(r.art)}" alt=""/><span class="hr-copy"><span class="hr-meta"><small>${esc(r.kind)}</small><em>${String(records.length-i).padStart(2,'0')}</em></span><strong>${esc(r.name)}</strong><span class="hr-detail">${esc(r.detail)}</span></span></button>`).join(''):'<div class="hr-empty">新的行动将留在这里。</div>';
  };
  const add=record=>{if(!record)return;const id=String(record.id||`record-${Date.now()}-${records.length}`);records=[{...record,id},...records.filter(r=>r.id!==id)].slice(0,30);render();};
  const reset=()=>{records=[];activeId=null;pinned=false;(config.records??defaultHistory).forEach(r=>add(r));render();open(false);};
  listen(root,'click',event=>{const button=event.target.closest('[data-record]');if(!button||!root.contains(button))return;activeId=button.dataset.record;pinned=true;render();open(true);[...root.querySelectorAll('.hr-record')].find(r=>r.dataset.record===activeId)?.focus();});
  let timer;
  listen(root,'pointerenter',()=>{clearTimeout(timer);open(true);});
  listen(root,'pointerleave',()=>{timer=setTimeout(()=>{if(!pinned&&!root.contains(document.activeElement))open(false);},140);});
  listen(root,'focusin',()=>{clearTimeout(timer);open(true);});
  listen(root,'focusout',()=>{timer=setTimeout(()=>{if(!pinned&&!root.contains(document.activeElement))open(false);},120);});
  listen(root.querySelector('.hr-toggle'),'click',()=>{pinned=!pinned;open(pinned);});
  listen(root.querySelector('.hr-close'),'click',()=>{pinned=false;open(false);root.querySelector('.hr-toggle').focus();open(false);});
  listen(root,'keydown',event=>{if(event.key==='Escape'){pinned=false;open(false);event.stopPropagation();}});
  reset();return {add,reset,destroy(){abort.abort();clearTimeout(timer);root.replaceChildren();root.classList.remove('hr-root');}};
}
