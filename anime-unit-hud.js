(() => {
  "use strict";
  const $=id=>document.getElementById(id), publishedApi=globalThis.TbhChibiPublished;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)");
  const icon=name=>`<svg class="icon" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
  const factionNames={SkyborneAlliance:"SKYBORNE ALLIANCE",SolarChurch:"SOLAR CHURCH",AstraImperium:"ASTRA IMPERIUM",MachineHeaven:"MACHINE HEAVEN",Neutral:"NEUTRAL"};
  const labels={normal:"常规状态",selected:"选中 / 详情展开",hurt:"受击演示",low:"低生命演示",shield:"护甲与圣盾演示",spent:"行动耗尽演示"};
  let manifest,cards,unit,art,state,main,mini,action="idle",elapsed=0,actionUntil=0,lastTime=0,token=0,raf=0;
  let pinned=false;
  let anchorHeight=1.2, silhouetteHalfWidth=.6;
  class ReadoutStage extends globalThis.TbhPaperStage {
    board(vertices,offset,baseline){
      super.board(vertices,offset,baseline);
      if(!state?.selected)return;
      for(const x of [-1,1])for(const z of [-1,1]){
        this.box(vertices,offset+x*.45,.027,z*.37,.025,.004,.18,[.89,.98,.23]);
        this.box(vertices,offset+x*.37,.027,z*.45,.18,.004,.025,[.89,.98,.23]);
      }
    }
  }
  class Readout {
    constructor(host){
      this.host=host;this.hovered=false;this.focused=false;this.revision=0;this.closeTimer=0;
      host.innerHTML=`<div class="unit-readout"><div class="status-shield">${icon("shield")}</div><button class="compact" aria-expanded="false" aria-label="展开角色数值"><span class="attack-block">${icon("attack")}<b class="attack-value">2</b></span><span class="hp-block"><b class="hp-value">20</b><span class="hp-max">/20</span><span class="hp-label">HP</span><span class="hp-track"><span class="hp-trail"></span><span class="hp-fill"></span></span></span></button><button class="ready-trigger" title="播放可发动效果演示" aria-label="播放可发动效果演示">${icon("ready")}</button><div class="readout-details"><div class="detail-name"><span></span><small></small></div><div class="defenses"><span class="defense armor">${icon("armor")}<b>0</b><small>护甲</small></span><span class="defense shield">${icon("shield")}<small>圣盾</small></span></div><div class="action-row movement">${icon("move")}<span>移动</span><span class="segments"></span><b></b></div><div class="action-row attack">${icon("attack")}<span>攻击</span><span class="segments"></span><b></b></div><div class="effect-row">${icon("ready")}<span class="effect-copy"><b></b><small></small></span></div></div></div>`;
      this.root=host.firstElementChild;this.button=this.root.querySelector(".compact");
      this.root.addEventListener("pointerenter",()=>{clearTimeout(this.closeTimer);this.hovered=true;this.disclosure();});
      this.root.addEventListener("pointerleave",()=>{this.closeTimer=setTimeout(()=>{this.hovered=false;this.disclosure();},120);});
      this.root.addEventListener("focusin",()=>{this.focused=true;this.disclosure();});
      this.root.addEventListener("focusout",event=>{if(!this.root.contains(event.relatedTarget)){this.focused=false;this.disclosure();}});
      this.button.addEventListener("click",()=>setPinned(!pinned));
      this.root.querySelector(".ready-trigger").addEventListener("click",()=>activate());
      this.root.addEventListener("keydown",event=>{if(event.key==="Escape"){setPinned(false);this.button.blur();}});
    }
    disclosure(){const open=this.hovered||this.focused||pinned||state?.selected;this.root.classList.toggle("open",Boolean(open));this.button.setAttribute("aria-expanded",String(Boolean(open)));}
    segments(row,count,total){const root=this.root.querySelector(`.${row} .segments`);root.replaceChildren();root.style.setProperty("--segment-count",Math.max(1,total));for(let i=0;i<total;i++){const p=document.createElement("i");p.className=i<count?"on":"";root.append(p);}this.root.querySelector(`.${row}>b`).textContent=`${count}/${total}`;}
    update(){
      this.revision++;
      for(const [name,enabled]of Object.entries({ready:state.ready,selected:state.selected,low:state.mode==="low",shielded:state.shield,spent:state.mode==="spent"}))this.root.classList.toggle(name,enabled);
      this.root.querySelector(".attack-value").textContent=state.attack;
      this.root.querySelector(".hp-value").textContent=state.hp;
      this.root.querySelector(".hp-max").textContent=`/${state.maxHp}`;
      this.button.setAttribute("aria-label",`${unit.nameKey}，攻击${state.attack}，生命${state.hp}/${state.maxHp}；点击固定详情`);
      for(const bar of this.root.querySelectorAll(".hp-track span"))bar.style.width=`${state.hp/state.maxHp*100}%`;
      this.root.querySelector(".detail-name span").textContent=unit.nameKey;
      this.root.querySelector(".detail-name small").textContent=unit.id;
      this.root.querySelector(".armor b").textContent=state.armor;
      this.root.querySelector(".armor").classList.toggle("active",state.armor>0);
      this.root.querySelector(".defense.shield").classList.toggle("active",state.shield);
      this.segments("movement",state.moves,state.maxMoves);this.segments("action-row.attack",state.attacks,state.maxAttacks);
      this.root.querySelector(".effect-copy b").textContent=state.ready?"可发动效果 · 演示":state.mode==="spent"?"本轮行动已用尽 · 演示":"暂无可发动效果";
      this.root.querySelector(".effect-copy small").textContent=unit.rulesText||"此单位无卡面效果描述。";
      this.root.querySelector(".effect-copy small").title=unit.rulesText||"";
      this.root.querySelector(".ready-trigger").disabled=!state.ready;
      this.disclosure();
    }
    hit(){this.root.classList.remove("hurt");void this.root.offsetWidth;this.root.classList.add("hurt");}
    place(stage){
      // Readout anchors belong to the entity root and a fixed authored height.
      // Sprite frame bounds, per-frame pivots, recoil and leap offsets never move them.
      const off=art.groundOffsetInTiles||{x:0,y:0,z:0},m=stage.matrix;if(!m)return;
      const up=[-Math.sin(stage.pitch)*Math.sin(stage.yaw),Math.cos(stage.pitch),-Math.sin(stage.pitch)*Math.cos(stage.yaw)];
      const right=[Math.cos(stage.yaw),0,-Math.sin(stage.yaw)];
      const w=stage.canvas.clientWidth,h=stage.canvas.clientHeight,root=[off.x,.027+off.y,off.z];
      const project=world=>{const p=[0,0,0,0];for(let r=0;r<4;r++)for(let c=0;c<4;c++)p[r]+=m[c*4+r]*(c===3?1:world[c]);return{x:(p[0]/p[3]*.5+.5)*w,y:(.5-p[1]/p[3]*.5)*h};};
      const foot=project(root),head=project(root.map((v,i)=>v+up[i]*anchorHeight));
      const side=project(root.map((v,i)=>v+right[i]*silhouetteHalfWidth));
      const x=Math.max(100,Math.min(w-100,head.x)),y=Math.max(72,Math.min(h-90,head.y));
      this.host.style.left=`${x}px`;this.host.style.top=`${y}px`;
      const details=this.root.querySelector(".readout-details"),badgeWidth=this.root.offsetWidth,badgeHeight=this.button.offsetHeight;
      const panelWidth=details.offsetWidth,panelHeight=details.offsetHeight,edge=14,topEdge=44,gap=9;
      const badgeLeft=x-badgeWidth/2,badgeTop=y-badgeHeight,half=Math.max(badgeWidth/2,Math.abs(side.x-foot.x))+12;
      const candidates=[
        {kind:"above",left:x-panelWidth/2,top:badgeTop-panelHeight-gap},
        {kind:"right",left:Math.max(x+badgeWidth/2,foot.x+half)+gap,top:Math.max(topEdge,Math.min(h-panelHeight-edge,badgeTop-panelHeight*.22))},
        {kind:"left",left:Math.min(x-badgeWidth/2,foot.x-half)-panelWidth-gap,top:Math.max(topEdge,Math.min(h-panelHeight-edge,badgeTop-panelHeight*.22))}
      ];
      const fits=r=>r.left>=edge&&r.top>=topEdge&&r.left+panelWidth<=w-edge&&r.top+panelHeight<=h-edge;
      const placement=candidates.find(fits);
      const dock=this===views[0]?$("detailDock"):null;
      this.root.classList.toggle("external-details",!placement);
      if(dock){
        const show=!placement&&this.root.classList.contains("open");dock.hidden=!show;
        if(show){
          dock.dataset.skin=document.body.dataset.skin;
          if(dock.dataset.revision!==String(this.revision)){dock.replaceChildren(details.cloneNode(true));dock.dataset.revision=String(this.revision);}
        }
      }
      if(placement){
        this.root.dataset.detailPlacement=placement.kind;
        details.style.left=`${placement.left-badgeLeft}px`;details.style.top=`${placement.top-badgeTop}px`;
      }
      if(this===views[0]){$("mainFloat").style.left=`${x+100}px`;$("mainFloat").style.top=`${y+20}px`;}
    }
  }
  const views=[];
  function setPinned(value){pinned=value;$("pinDetail").checked=pinned;for(const view of views){if(!pinned){view.hovered=false;view.focused=false;}view.disclosure();}}
  function newState(mode){
    const maxHp=Math.max(1,Number(unit.health)||1),maxMoves=Math.max(0,Number(unit.movement)||0);
    const canActivate=Boolean(unit.execution?.abilities?.some(a=>a.kind==="Activated"));
    return {mode,maxHp,hp:maxHp,attack:Math.max(0,Number(unit.attack)||0),maxMoves,moves:maxMoves,maxAttacks:1,attacks:1,armor:0,shield:false,ready:canActivate,selected:mode==="selected"};
  }
  function changeState(mode){
    const previous=state;state=newState(mode);
    if(mode==="hurt")state.hp=Math.max(0,(previous?.mode==="hurt"?previous.hp:state.maxHp)-3);
    if(mode==="low")state.hp=Math.max(1,Math.floor(state.maxHp*.2));
    if(mode==="shield"){state.armor=6;state.shield=true;}
    if(mode==="spent"){state.moves=0;state.attacks=0;state.ready=false;}
    for(const b of $("stateButtons").children)b.setAttribute("aria-pressed",String(b.dataset.state===mode));
    $("stateLabel").textContent=labels[mode];
    views.forEach(v=>v.update());
    if(mode==="hurt"){
      playAction("hit",.7);views.forEach(v=>v.hit());
      const lost=Math.min(3,previous?.mode==="hurt"?previous.hp:state.maxHp);$("mainFloat").textContent=`−${lost}`;$("mainFloat").classList.remove("visible");void $("mainFloat").offsetWidth;$("mainFloat").classList.add("visible");
      setTimeout(()=>$("mainFloat").classList.remove("visible"),900);
    }else playAction("idle",0);
    $("liveAnnouncement").textContent=`${labels[mode]} · 合成状态，不写入卡牌或游戏`;
  }
  function playAction(next,duration){action=next;elapsed=0;actionUntil=duration?performance.now()+duration*1000:0;}
  function activate(){if(!state?.ready)return;playAction("effect",1.2);views.forEach(v=>{v.root.classList.add("activating");setTimeout(()=>v.root.classList.remove("activating"),450);});$("liveAnnouncement").textContent="播放发动插画与跃起演示 · 未发送游戏指令";}
  async function choose(uid){
    const attempt=++token;unit=cards.find(c=>c.uid===uid);if(!unit)return;
    art=publishedApi.entry(manifest,uid);
    anchorHeight=art.heightInTiles+.1;
    silhouetteHalfWidth=Math.max(...art.layout.frames.map(f=>{const scale=art.heightInTiles/art.layout.nominalCellHeight;return f.rect.width*scale*Math.max(f.pivot.x,1-f.pivot.x)+Math.abs(f.offsetInTiles?.x||0);}))+.15*art.heightInTiles;
    $("stageError").hidden=true;$("unitName").textContent=unit.nameKey;$("unitEnglish").textContent=unit.englishName||"";$("unitIdentity").textContent=`${factionNames[unit.classId]||unit.classId} / ${unit.id}`;
    $("workbenchLink").href=`./chibi.html?unit=${encodeURIComponent(uid)}`;$("sourceTag").textContent=`PUBLISHED / ${art.heightInTiles.toFixed(2)} TILE`;
    const url=new URL(location.href);url.searchParams.set("unit",uid);history.replaceState(null,"",url);changeState("normal");
    try{await Promise.all([main.setActor(0,art),mini.setActor(0,art)]);if(attempt!==token)return;$("liveAnnouncement").textContent="已读取真实发布图集 · 属性变化仅供演示";}catch(e){if(attempt===token){$("stageError").textContent=e.message;$("stageError").hidden=false;}}
  }
  function skin(value){document.body.dataset.skin=value;for(const b of document.querySelectorAll(".skin-switch button"))b.setAttribute("aria-pressed",String(b.dataset.skin===value));$("schemeTitle").innerHTML=value==="arcade"?"硬边，快读。<br>把颜色留给状态。":"轻一点的边。<br>像贴在故事里的纸签。";$("schemeDescription").textContent=value==="arcade"?"黑白承担结构，青绿只表示生命。荧光黄是一枚可用效果的信号，而不是整张面板的背景。":"相同的信息层级，换成白纸黑字。减轻底板的视觉重量，让角色插画继续成为主角。";}
  async function init(){
    const fetchJson=async p=>{const r=await fetch(p,{cache:"no-store"});if(!r.ok)throw new Error(`无法读取 ${p}`);return r.json();};
    [manifest,{cards}]=await Promise.all([fetchJson("./data/chibi-published.json"),fetchJson("./data/cards.json")]);cards=cards.filter(c=>manifest.units.some(u=>u.uid===c.uid));
    for(const card of cards){const option=document.createElement("option");option.value=card.uid;option.textContent=`${card.nameKey} / ${card.id}`;$("unitSelect").append(option);}
    main=new ReadoutStage($("mainStage"));mini=new ReadoutStage($("miniStage"));
    for(const stage of [main,mini]){stage.compare=false;stage.reset();stage.distance=5.8;stage.motion=!reduce.matches;stage.onError=message=>{$("stageError").textContent=message;$("stageError").hidden=false;};}
    views.push(new Readout($("mainHud")),new Readout($("miniHud")));
    $("unitSelect").onchange=()=>choose($("unitSelect").value);for(const button of document.querySelectorAll(".skin-switch button"))button.onclick=()=>skin(button.dataset.skin);
    for(const button of $("stateButtons").children)button.onclick=()=>changeState(button.dataset.state);
    $("pinDetail").onchange=()=>setPinned($("pinDetail").checked);
    $("resetCamera").onclick=()=>{main.reset();main.distance=5.8;};$("flip").onclick=()=>{main.facing*=-1;mini.facing=main.facing;$("flip").textContent=main.facing===1?"朝向 →":"朝向 ←";};
    reduce.addEventListener("change",()=>{for(const s of [main,mini])s.motion=!reduce.matches;});
    const uid=new URL(location.href).searchParams.get("unit");$("unitSelect").value=cards.some(c=>c.uid===uid)?uid:cards.find(c=>c.id==="SA-000").uid;
    await choose($("unitSelect").value);
    function tick(now){
      const dt=lastTime?Math.min(.05,(now-lastTime)/1000):0;lastTime=now;
      if(!document.hidden){
        if(actionUntil&&now>=actionUntil)playAction("idle",0);
        const moving=$("animate").checked&&!reduce.matches;if(moving||action!=="idle")elapsed+=dt;
        mini.yaw=main.yaw;mini.pitch=main.pitch;mini.distance=main.distance;
        const clip=art.layout.clips[action],index=clip.loop?Math.floor(elapsed*clip.fps)%clip.frames.length:Math.min(clip.frames.length-1,Math.floor(elapsed*clip.fps));
        for(const s of [main,mini]){s.motion=moving;s.action=action;s.elapsed=elapsed;s.frameIndices[0]=clip.frames[moving||action!=="idle"?index:0];s.render();}
        views[0].place(main);views[1].place(mini);
      }
      raf=requestAnimationFrame(tick);
    }
    raf=requestAnimationFrame(tick);addEventListener("pagehide",()=>{cancelAnimationFrame(raf);main.dispose();mini.dispose();},{once:true});
  }
  init().catch(error=>{$("stageError").textContent=error.message;$("stageError").hidden=false;$("sourceTag").textContent="素材载入失败";});
})();
