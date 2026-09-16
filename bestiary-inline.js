/* Race -> branch archive. All gameplay/card data is read-only. */
(async () => {
  'use strict';
  const root=document.getElementById('creatureArchive');if(!root)return;
  const en=document.body.dataset.language==='en',t=(zh,eng)=>en?eng:zh;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const local=v=>v?.[en?'en':'zh']||'';
  const catalog=window.TBH_BESTIARY_CATALOG;
  if(!catalog){root.textContent=t('生物档案暂时无法加载。','The archive could not be loaded.');return;}
  const {races,entries,aliases}=catalog;
  const source=id=>window.TBH_BESTIARY_RECORDS.find(r=>r.id===id);
  const field=(r,name)=>r?.[(en?'en':'zh')+name]||'';
  let artSources=structuredClone(window.TBH_BESTIARY_CARD_SOURCES||{}),snapshot=false;
  if(location.protocol!=='file:')try{
    const response=await fetch('./data/cards.json',{cache:'no-store'});if(!response.ok)throw new Error('Cards unavailable');
    const data=await response.json();
    for(const key of Object.keys(artSources)){
      const matches=data.cards.filter(c=>c.artworkKey===key);
      if(matches.length!==1){artSources[key]={key,unresolved:true};continue;}
      const c=matches[0],selected=(data.artworkVariants[c.id]||[]).find(v=>v.id===data.selectedArtworkIds[c.id]);
      const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(c.artDescription));
      artSources[key]={key,name:c.nameKey,enName:c.englishName,description:c.artDescription,descriptionHash:Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join(''),image:selected?.src||null,unresolved:Boolean(data.selectedArtworkIds[c.id]&&!selected)};
    }
  }catch{snapshot=true;}else snapshot=true;
  const initial=new URLSearchParams(location.search).get('creature');
  const valid=id=>entries.some(e=>e.id===id)||races.some(r=>'race:'+r.id===id);
  let active=valid(aliases[initial]||initial)?aliases[initial]||initial:entries[0].id;
  const raceOf=id=>id.startsWith('race:')?id.slice(5):entries.find(e=>e.id===id)?.raceId;
  const expanded=new Set([raceOf(active)]);
  root.classList.add('creature-archive');
  root.innerHTML=`<div class="creature-purpose"><span class="creature-kicker">SPECIES DESIGN BIBLE</span><p>${t('统一轮廓、结构、材质与设计理念。生成资产时，先遵守种族共性，再遵守分支约束；未完成的设定不可自动补成标准。','Consistent silhouettes, structures, materials and design intent. Apply race-wide principles, then branch constraints. Incomplete designs must not be silently turned into standards.')}</p></div><div class="creature-toolbar"><p id="creatureResultCount" aria-live="polite"></p><label class="creature-search"><span>${t('检索种族与分支','Search races and branches')}</span><input id="creatureSearch" type="search" placeholder="${t('名称、特征或已有卡牌…','Name, trait or existing card…')}" autocomplete="off"></label></div><div class="creature-columns"><nav id="creatureList" class="creature-index" aria-label="${t('种族与生物分支','Races and creature branches')}"></nav><article id="creatureDetail" class="creature-detail" tabindex="-1"></article></div>`;
  const list=root.querySelector('#creatureList'),detail=root.querySelector('#creatureDetail'),search=root.querySelector('#creatureSearch'),count=root.querySelector('#creatureResultCount');
  const searchable=e=>JSON.stringify([e,races.find(r=>r.id===e.raceId),(e.sourceArtworkKeys||[]).map(k=>artSources[k])]).toLocaleLowerCase();
  const state=e=>e.designStatus==='incomplete'?t('设定未完成','Design incomplete'):e.designStatus==='card-reference'?t('个体参考 · 分支待定稿','Individual reference · Branch pending'):t('已有设计依据','Design documented');
  const missing=t('未完成','Incomplete');
  function syncUrl(){const u=new URL(location.href);u.searchParams.set('creature',active);u.hash='bestiary';history.replaceState(null,'',u);}
  function renderList(){
    const query=search.value.trim().toLocaleLowerCase();const visible=entries.filter(e=>!query||searchable(e).includes(query));
    count.textContent=t(`6 个种族 · ${visible.length} / ${entries.length} 个分支`,`6 races · ${visible.length} / ${entries.length} branches`);
    if(!visible.length){list.innerHTML=`<p class="creature-empty">${t('没有符合条件的分支。','No matching branches.')}</p>`;detail.innerHTML=`<p class="creature-empty">${t('尝试其他名称或特征。','Try another name or trait.')}</p>`;return;}
    const activeRace=raceOf(active);
    if(!visible.some(e=>e.id===active)&&!(active.startsWith('race:')&&visible.some(e=>e.raceId===activeRace))){active=visible[0].id;expanded.add(raceOf(active));if(query)syncUrl();}
    list.innerHTML=races.map((r,i)=>{const children=visible.filter(e=>e.raceId===r.id);if(!children.length)return '';return `<details class="creature-race" data-race="${r.id}" ${query||expanded.has(r.id)?'open':''}><summary><span class="race-number">${String(i+1).padStart(2,'0')}</span><strong>${esc(local(r))}</strong><small>${children.length}</small></summary><div class="creature-branches"><button class="creature-race-overview" data-record="race:${r.id}" aria-pressed="${active==='race:'+r.id}">${t('种族共性与设计边界','Shared principles & boundaries')} ↗</button>${children.map(e=>`<button type="button" class="creature-branch" data-record="${e.id}" aria-pressed="${active===e.id}"><span>${esc(local(e.names))}</span><small>${esc(state(e))}</small></button>`).join('')}</div></details>`}).join('');
    renderDetail();
  }
  const unavailable='./assets/card-art/rampaging-puru-beast/rampaging-puru-beast-01.png';
  function image(src,label,kind=''){
    if(!src||src===unavailable)return `<div class="bestiary-concept-pending"><strong>${esc(label)}</strong><p>${t('图像待补全','Image incomplete')}</p></div>`;
    return `<button class="bestiary-art-button" type="button" data-lightbox-src="${esc(src)}" data-lightbox-label="${esc(label)}" aria-label="${esc(t('查看原图：','View image: ')+label)}"><img loading="lazy" src="${esc(src)}" alt="${esc(label)}"><span class="bestiary-art-caption"><span>${esc(label)}</span><small>${esc(kind)}</small></span></button>`;
  }
  const bullets=items=>items?.length?`<ul class="bestiary-traits">${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p class="creature-pending-text">${missing}</p>`;
  function visualRules(title,items,note=''){return `<section class="bestiary-copy-section"><h4>${esc(title)}</h4>${note?`<p>${esc(note)}</p>`:''}${bullets(items)}</section>`;}
  function originalContext(s){if(!s)return '';const sections=[['Ecology',t('生态与行为','Ecology and behavior')],['Relations',t('文明关系','Civilization relations')]];return `<details class="creature-context"><summary>${t('背景与生态参考','Background and ecology')}</summary><div class="creature-context-body"><div class="bestiary-facts">${[['Habitat',t('栖息地／出现条件','Habitat / occurrence')],['Diet',t('能量来源','Energy source')],['Activity',t('活动模式','Activity')]].map(([f,l])=>`<div class="bestiary-fact"><span>${l}</span><strong>${esc(field(s,f))}</strong></div>`).join('')}</div>${sections.map(([f,l])=>`<h4>${l}</h4><p>${esc(field(s,f))}</p>`).join('')}${s.protocolZh?`<h4>${t('既有处置协议','Existing encounter protocols')}</h4>${bullets(s[en?'protocolEn':'protocolZh'])}`:''}</div></details>`;}
  function sourceNotes(s){return ['ConceptNote','KnownFormsNote'].map(k=>field(s,k)?`<p class="creature-source-note">${esc(field(s,k))}</p>`:'').join('');}
  function existingGallery(s){return (s?.specimens||[]).map(x=>image(x.src,en?x.en:x.zh,t('既有参考','Existing reference'))).join('');}
  function renderRace(r){
    const s=source(r.sourceId),children=entries.filter(e=>e.raceId===r.id);
    detail.innerHTML=`<div class="creature-race-title"><span class="creature-kicker">RACE / DESIGN PRINCIPLES</span><h3>${esc(local(r))}</h3><p>${esc(local(r.note))}</p></div><div class="bestiary-body">${s?`<p>${esc(field(s,'Summary'))}</p>${visualRules(t('种族共性','Shared recognition principles'),s[en?'enTraits':'zhTraits'])}`:`<p>${t('每个分支分别维护自己的结构规范与标准图；此总类不强制共享一套外形。','Each branch maintains its own structure and reference images; the category does not impose a single body plan.')}</p>`}<section class="bestiary-copy-section"><h4>${t('分支目录','Branches')}</h4><div class="creature-child-links">${children.map(e=>`<button data-record="${e.id}">${esc(local(e.names))}<small>${esc(state(e))}</small><span>↗</span></button>`).join('')}</div></section>${r.id==='avatar'?`<p class="creature-pending-text">${t('既有卡牌另有「精英豹人战士」，其豹形分支尚未在本轮分类中定型。','The existing Elite Pantherkin Warrior is an additional individual; its branch is not yet defined in this classification.')}</p>`:''}${s?`<details class="creature-context"><summary>${t('种族层既有视觉参考 · 不替代分支标准','Existing race-level visuals · Not branch standards')}</summary><div class="bestiary-art-pair">${image(s.illustration,field(s,'Name'),t('总类参考','Race reference'))}${existingGallery(s)}</div>${sourceNotes(s)}</details>${originalContext(s)}`:''}</div>`;
  }
  function renderDetail(){
    if(active.startsWith('race:')){renderRace(races.find(r=>r.id===raceOf(active)));return;}
    const e=entries.find(e=>e.id===active),r=races.find(r=>r.id===e.raceId),s=source(e.sourceId),common=r.sourceId?source(r.sourceId):null;
    const refs=(e.sourceArtworkKeys||[]).map(k=>artSources[k]).filter(Boolean),review=refs.some(c=>c.unresolved||c.descriptionHash!==e.sourceBriefHashes?.[c.key]);
    const cover=refs.find(c=>c.image)?.image||e.illustration||e.concept;
    const name=local(e.names),isSheet=!refs.some(c=>c.image)&&!e.illustration&&e.concept;
    detail.innerHTML=`<div class="creature-breadcrumb"><button data-record="race:${r.id}">${esc(local(r))}</button><span>/</span><span>${esc(name)}</span></div><div class="bestiary-detail-hero ${cover?'':'no-cover'}">${cover?`<img class="${isSheet?'concept-cover':''}" src="${esc(cover)}" alt="${esc(name)}">`:`<div class="creature-unfinished-art"><span>DESIGN PENDING</span><strong>${t('形象尚未定型','Visual identity pending')}</strong><p>${t('轮廓 · 结构 · 材质 · 尺度','Silhouette · Structure · Material · Scale')}</p></div>`}<div class="bestiary-detail-title"><div class="bestiary-detail-meta"><span>${esc(state(e))}</span>${e.sourceFormName?`<span>${esc(field(s?.knownForms?.find(f=>f.zhName===e.sourceFormName),'Type'))}</span>`:''}</div><h3>${esc(name)}</h3><div class="english-name">${esc(en?e.names.zh:e.names.en)}</div><p class="summary">${esc(local(e.summary)||t('已建立分支入口。具体形象、设计理念与独立标准图待补全；种族共性不能替代该分支的正式设定。','Branch entry created. Its visual identity, design intent and dedicated references remain incomplete; shared race principles cannot replace a branch design.'))}</p></div></div><div class="bestiary-body">${review?`<p class="creature-review-warning">${t('源卡牌描述已变化或身份关联失效；以下提取的特征需重新核对，不能直接作为新资产标准。','Source card description changed or its identity link failed. Reconcile the extracted traits before using them as asset standards.')}</p>`:''}
    ${common?`<section class="creature-inherited"><h4>${t('继承的种族共性','Inherited race principles')} · ${esc(local(r))}</h4><p>${esc(local(r.note))}</p>${bullets(common[en?'enTraits':'zhTraits'])}</section>`:''}
    <div class="creature-constraint-grid">${visualRules(e.designStatus==='card-reference'?t('现有个体特征 · 分支规范待定稿','Individual traits · Branch standards pending'):t('必须保留的识别特征','Recognition features to preserve'),local(e.traits))}${visualRules(t('不可偏离／避免','Constraints / Avoid'),local(e.avoid),local(e.variation))}</div>
    ${e.gaps.zh.length?`<section class="creature-gaps"><h4>${t('待补全的设计','Incomplete design decisions')}</h4>${bullets(local(e.gaps))}</section>`:''}
    <section class="bestiary-art-section"><div class="bestiary-art-header"><div><span>VISUAL REFERENCES</span><h4>${t('视觉依据与标准图','Visual references and concept sheets')}</h4></div><p>${t('个体插画用于举例；设定板用于约束结构。缺失位置保留为空。','Individual illustrations are examples; concept sheets constrain structure. Missing slots remain empty.')}</p></div><div class="bestiary-art-pair">${image(refs.find(c=>c.image)?.image||e.illustration,t('个体／场景参考','Individual / scene reference'))}${image(e.concept,e.id==='celestial-angel'?t('获准形象示例 A1 · 非唯一结构','Approved example A1 · Not the only structure'):t('分支设定板','Branch concept sheet'))}</div>${e.sourceKind==='dossier'?sourceNotes(s):''}${e.specimens.length?`<div class="bestiary-specimens">${existingGallery(e)}</div>`:''}</section>
    ${e.forms.length?`<details class="creature-context"><summary>${t('职能变体 · 共享本分支识别结构','Role variants · Shared branch structure')}</summary><div class="bestiary-form-grid">${e.forms.map(f=>`<article class="bestiary-form-card"><div class="bestiary-form-copy"><small>${esc(field(f,'Type'))}</small><h5>${esc(field(f,'Name'))}</h5><p>${esc(field(f,'Description'))}</p></div>${f.concept?image(f.concept,field(f,'Name')):''}</article>`).join('')}</div></details>`:''}
    ${e.sourceKind==='dossier'?originalContext(s):''}
    <details class="creature-context"><summary>${t('设计来源与关联卡牌','Design sources and associated cards')}</summary><div class="creature-context-body"><p>${esc(e.sourceId?`bestiary-data.js / ${e.sourceId}${e.sourceFormName?' / '+e.sourceFormName:''}`:t('本轮分类确认；细节未完成。','Classification confirmed in this revision; details incomplete.'))}</p>${refs.map(c=>`<h4>${esc(c.name||c.key)} <small>${esc(c.enName||'')}</small></h4><p>${esc(c.description||t('卡牌身份关联待修复。','Card identity link needs repair.'))}</p>`).join('')}${snapshot?`<p>${t('当前显示构建快照。','Showing the build snapshot.')}</p>`:''}<p>${t('最新卡牌中的个体描述与种族共性如有冲突，须明确解决后再生成；不得自行覆盖任一来源。','Resolve conflicts between current individual briefs and shared principles before generation; do not silently override either source.')}</p></div></details>
    <section class="bestiary-chibi"><span>CHIBI / BATTLE ASSET</span><h4>${t('小人／战斗资产','Chibi / battle asset')}</h4><p>${t('预留位置 · 未完成。简化后仍需保留本分支关键识别特征。','Reserved slot · Incomplete. Preserve branch identifiers when simplifying.')}</p></section></div>`;
  }
  function select(id){if(!valid(id))return;active=id;const chosen=entries.find(e=>e.id===id);if(chosen&&search.value.trim()&&!searchable(chosen).includes(search.value.trim().toLocaleLowerCase()))search.value='';expanded.add(raceOf(id));syncUrl();renderList();const target=list.querySelector(`[data-record="${id}"]`);target?.focus({preventScroll:true});if(matchMedia('(max-width: 760px)').matches){detail.scrollIntoView({block:'start',behavior:'smooth'});detail.focus({preventScroll:true});}}
  list.addEventListener('toggle',ev=>{if(!ev.target.matches('.creature-race')||search.value.trim())return;ev.target.open?expanded.add(ev.target.dataset.race):expanded.delete(ev.target.dataset.race);},true);
  root.addEventListener('click',ev=>{const b=ev.target.closest('[data-record]');if(b)select(b.dataset.record);});
  search.addEventListener('input',renderList);
  const dialog=document.createElement('dialog');dialog.className='creature-lightbox';dialog.setAttribute('aria-label',t('原图预览','Image preview'));dialog.innerHTML=`<div class="creature-lightbox-bar"><p></p><a target="_blank" rel="noopener noreferrer">${t('打开原图 ↗','Open original ↗')}</a><button type="button" aria-label="${t('关闭图片预览','Close image preview')}">×</button></div><img alt="">`;document.body.append(dialog);
  let trigger,overflow;
  root.addEventListener('click',ev=>{const b=ev.target.closest('[data-lightbox-src]');if(!b)return;trigger=b;dialog.querySelector('img').src=b.dataset.lightboxSrc;dialog.querySelector('img').alt=b.dataset.lightboxLabel;dialog.querySelector('p').textContent=b.dataset.lightboxLabel;dialog.querySelector('a').href=b.dataset.lightboxSrc;overflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();dialog.querySelector('button').focus();});
  dialog.addEventListener('click',ev=>{if(ev.target===dialog||ev.target.closest('button'))dialog.close();});
  dialog.addEventListener('close',()=>{dialog.querySelector('img').removeAttribute('src');document.body.style.overflow=overflow;trigger?.focus({preventScroll:true});});
  root.addEventListener('error',ev=>{if(!(ev.target instanceof HTMLImageElement))return;const p=document.createElement('span');p.className='creature-missing-image';p.textContent=t('图像缺失 · 待补全','Image missing · Incomplete');const b=ev.target.closest('[data-lightbox-src]');if(b){b.disabled=true;b.removeAttribute('data-lightbox-src');}ev.target.replaceWith(p);},true);
  window.addEventListener('popstate',()=>{const raw=new URLSearchParams(location.search).get('creature'),id=aliases[raw]||raw;if(valid(id)){active=id;search.value='';expanded.add(raceOf(id));renderList();}});
  renderList();
})();
